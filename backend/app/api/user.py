from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, require_permission
from app.core.security import hash_password
from app.models.user import User
from app.models.branch import Branch
from app.models.role import Role, UserRole
from app.services.audit_service import create_audit_log


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


def _serialize_user(user: User, db: Session):
    user_role = (
        db.query(Role)
        .join(UserRole, UserRole.role_id == Role.id)
        .filter(
            UserRole.user_id == user.id,
            Role.tenant_id == user.tenant_id,
        )
        .order_by(Role.name)
        .first()
    )

    role_name = user_role.name if user_role else user.role

    return {
        "id": user.id,
        "tenant_id": user.tenant_id,
        "branch_id": user.branch_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email,
        "role": role_name,
        "role_id": user_role.id if user_role else None,
        "is_active": user.is_active,
        "status": "Active" if user.is_active else "Inactive",
        "branch": user.branch.name if user.branch else None,
    }


def _get_user(
    db: Session,
    user_id: str,
    current_user: User,
):
    user = (
        db.query(User)
        .filter(
            User.id == user_id,
            User.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return user


def _get_role(
    db: Session,
    role_id: str,
    current_user: User,
):
    role = (
        db.query(Role)
        .filter(
            Role.id == role_id,
            Role.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not role:
        raise HTTPException(
            status_code=400,
            detail="Invalid role.",
        )

    return role


def _assign_role(
    db: Session,
    user: User,
    role: Role,
):
    db.query(UserRole).filter(
        UserRole.user_id == user.id
    ).delete(synchronize_session=False)

    db.add(
        UserRole(
            user_id=user.id,
            role_id=role.id,
        )
    )

    user.role = role.code


@router.get("/")
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_permission("users.read")
    ),
):
    users = (
        db.query(User)
        .filter(User.tenant_id == current_user.tenant_id)
        .order_by(User.first_name, User.last_name)
        .all()
    )

    return [
        _serialize_user(user, db)
        for user in users
    ]


@router.post("/")
def create_user(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_permission("users.manage")
    ),
):
    first_name = str(
        payload.get("first_name", "")
    ).strip()

    last_name = str(
        payload.get("last_name", "")
    ).strip()

    email = str(
        payload.get("email", "")
    ).strip().lower()

    password = str(
        payload.get("password", "")
    )

    role_id = str(
        payload.get("role_id", "")
    ).strip()

    branch_id = payload.get("branch_id")

    if not first_name or not last_name:
        raise HTTPException(
            status_code=400,
            detail="First name and last name are required.",
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters.",
        )

    if not role_id:
        raise HTTPException(
            status_code=400,
            detail="Role is required.",
        )

    role = _get_role(
        db,
        role_id,
        current_user,
    )

    existing = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A user with this email already exists.",
        )

    if branch_id:
        branch = (
            db.query(Branch)
            .filter(
                Branch.id == branch_id,
                Branch.tenant_id == current_user.tenant_id,
            )
            .first()
        )

        if not branch:
            raise HTTPException(
                status_code=400,
                detail="Invalid branch.",
            )

    user = User(
        tenant_id=current_user.tenant_id,
        branch_id=branch_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=hash_password(password),
        role=role.code,
        is_active=True,
    )

    db.add(user)

    try:
        db.flush()

        _assign_role(
            db,
            user,
            role,
        )

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="User",
            entity_id=user.id,
            action="USER_CREATED",
            performed_by=current_user.id,
            details=f"Created user {user.email} with role {role.code}.",
        )

        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()
        raise

    return _serialize_user(user, db)


@router.patch("/{user_id}")
def update_user(
    user_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_permission("users.manage")
    ),
):
    user = _get_user(
        db,
        user_id,
        current_user,
    )

    changes = []

    first_name = payload.get("first_name")
    last_name = payload.get("last_name")
    email = payload.get("email")
    role_id = payload.get("role_id")
    branch_id = payload.get("branch_id")

    if first_name is not None:
        first_name = str(first_name).strip()

        if not first_name:
            raise HTTPException(
                status_code=400,
                detail="First name cannot be empty.",
            )

        if user.first_name != first_name:
            changes.append("first_name")
        user.first_name = first_name

    if last_name is not None:
        last_name = str(last_name).strip()

        if not last_name:
            raise HTTPException(
                status_code=400,
                detail="Last name cannot be empty.",
            )

        if user.last_name != last_name:
            changes.append("last_name")
        user.last_name = last_name

    if email is not None:
        email = str(email).strip().lower()

        existing = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != user.id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="A user with this email already exists.",
            )

        if user.email != email:
            changes.append("email")
        user.email = email

    if role_id is not None:
        role_id = str(role_id).strip()

        if not role_id:
            raise HTTPException(
                status_code=400,
                detail="Role cannot be empty.",
            )

        role = _get_role(
            db,
            role_id,
            current_user,
        )

        previous_role = user.role
        _assign_role(
            db,
            user,
            role,
        )
        if previous_role != role.code:
            changes.append("role")

    if branch_id is not None:
        if branch_id == "":
            if user.branch_id is not None:
                changes.append("branch")
            user.branch_id = None
        else:
            branch = (
                db.query(Branch)
                .filter(
                    Branch.id == branch_id,
                    Branch.tenant_id == current_user.tenant_id,
                )
                .first()
            )

            if not branch:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid branch.",
                )

            if user.branch_id != branch_id:
                changes.append("branch")
            user.branch_id = branch_id

    if changes:
        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="User",
            entity_id=user.id,
            action="USER_UPDATED",
            performed_by=current_user.id,
            details="Updated user fields: " + ", ".join(changes) + ".",
        )

    try:
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()
        raise

    return _serialize_user(user, db)


@router.patch("/{user_id}/status")
def toggle_user_status(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_permission("users.manage")
    ),
):
    user = _get_user(
        db,
        user_id,
        current_user,
    )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account.",
        )

    user.is_active = not user.is_active

    create_audit_log(
        db=db,
        tenant_id=current_user.tenant_id,
        entity_type="User",
        entity_id=user.id,
        action="USER_ACTIVATED" if user.is_active else "USER_DEACTIVATED",
        performed_by=current_user.id,
        details=(
            f"User {user.email} was "
            f"{'activated' if user.is_active else 'deactivated'}."
        ),
    )

    try:
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()
        raise

    return _serialize_user(user, db)
