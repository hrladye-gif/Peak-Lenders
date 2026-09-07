from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user, require_permission
from app.models.user import User
from app.models.role import Role, RolePermission, UserRole
from app.models.permission import Permission
from app.services.audit_service import create_audit_log


router = APIRouter(
    prefix="/roles",
    tags=["Roles & Permissions"],
)


def _require_admin(current_user: User):
    if str(current_user.role or "").lower() not in {
        "admin",
        "administrator",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )


@router.get("/")
def list_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("roles.read")),
):

    roles = (
        db.query(Role)
        .filter(Role.tenant_id == current_user.tenant_id)
        .order_by(Role.name)
        .all()
    )

    return [
        {
            "id": role.id,
            "tenant_id": role.tenant_id,
            "name": role.name,
            "code": role.code,
            "description": role.description,
            "is_system": role.is_system,
            "permissions": [
                rp.permission.code
                for rp in role.role_permissions
            ],
        }
        for role in roles
    ]


@router.get("/permissions")
def list_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("roles.read")),
):

    permissions = (
        db.query(Permission)
        .order_by(Permission.code)
        .all()
    )

    return [
        {
            "id": permission.id,
            "code": permission.code,
            "name": permission.name,
            "description": permission.description,
        }
        for permission in permissions
    ]


@router.post("/")
def create_role(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("roles.manage")),
):

    name = str(payload.get("name", "")).strip()
    code = str(payload.get("code", "")).strip().lower()
    description = payload.get("description")

    if not name or not code:
        raise HTTPException(
            status_code=400,
            detail="Role name and code are required.",
        )

    existing = (
        db.query(Role)
        .filter(
            Role.tenant_id == current_user.tenant_id,
            (Role.code == code) | (Role.name == name),
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A role with this name or code already exists.",
        )

    role = Role(
        tenant_id=current_user.tenant_id,
        name=name,
        code=code,
        description=description,
        is_system=False,
    )

    db.add(role)

    try:
        db.flush()

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="Role",
            entity_id=role.id,
            action="ROLE_CREATED",
            performed_by=current_user.id,
            details=f"Created role {role.name} ({role.code}).",
        )

        db.commit()
        db.refresh(role)
    except Exception:
        db.rollback()
        raise

    return {
        "id": role.id,
        "tenant_id": role.tenant_id,
        "name": role.name,
        "code": role.code,
        "description": role.description,
        "is_system": role.is_system,
        "permissions": [],
    }


@router.put("/{role_id}/permissions")
def set_role_permissions(
    role_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("roles.manage")),
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
            status_code=404,
            detail="Role not found.",
        )

    permission_codes = payload.get("permissions", [])

    if not isinstance(permission_codes, list):
        raise HTTPException(
            status_code=400,
            detail="permissions must be a list.",
        )

    permission_codes = {
        str(code).strip().lower()
        for code in permission_codes
        if str(code).strip()
    }

    previous_permission_codes = {
        rp.permission.code
        for rp in role.role_permissions
    }

    permissions = (
        db.query(Permission)
        .filter(Permission.code.in_(permission_codes))
        .all()
    )

    if len(permissions) != len(permission_codes):
        raise HTTPException(
            status_code=400,
            detail="One or more permissions are invalid.",
        )

    db.query(RolePermission).filter(
        RolePermission.role_id == role.id
    ).delete(synchronize_session=False)

    for permission in permissions:
        db.add(
            RolePermission(
                role_id=role.id,
                permission_id=permission.id,
            )
        )

    try:
        db.flush()

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="Role",
            entity_id=role.id,
            action="ROLE_PERMISSIONS_UPDATED",
            performed_by=current_user.id,
            details=(
                f"Updated permissions for role {role.name}. "
                f"Previous: {sorted(previous_permission_codes)}. "
                f"New: {sorted(permission_codes)}."
            ),
        )

        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "role_id": role.id,
        "permissions": sorted(permission_codes),
    }


@router.put("/{role_id}/users/{user_id}")
def assign_role(
    role_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("roles.manage")),
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
            status_code=404,
            detail="Role not found.",
        )

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

    existing = (
        db.query(UserRole)
        .filter(
            UserRole.user_id == user.id,
        )
        .first()
    )

    previous_role = None
    if existing:
        previous_role = (
            db.query(Role)
            .filter(Role.id == existing.role_id)
            .first()
        )

        if existing.role_id != role.id:
            existing.role_id = role.id
    else:
        db.add(
            UserRole(
                user_id=user.id,
                role_id=role.id,
            )
        )

    user.role = role.code

    try:
        db.flush()

        if not previous_role or previous_role.id != role.id:
            previous_name = previous_role.name if previous_role else "None"

            create_audit_log(
                db=db,
                tenant_id=current_user.tenant_id,
                entity_type="User",
                entity_id=user.id,
                action="USER_ROLE_CHANGED",
                performed_by=current_user.id,
                details=(
                    f"Changed user {user.email} role "
                    f"from {previous_name} to {role.name}."
                ),
            )

        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "user_id": user.id,
        "role_id": role.id,
        "status": "assigned",
    }
