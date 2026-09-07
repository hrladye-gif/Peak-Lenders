from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.branch import Branch
from app.models.user import User


def create_branch(db: Session, data):
    name = str(data.name).strip()
    code = str(data.code).strip().upper()
    address = (
        str(data.address).strip()
        if data.address is not None
        else None
    )

    if not name:
        raise ValueError("Branch name is required.")

    if not code:
        raise ValueError("Branch code is required.")

    branch = Branch(
        tenant_id=data.tenant_id,
        name=name,
        code=code,
        address=address,
    )

    db.add(branch)

    try:
        db.flush()
    except IntegrityError:
        db.rollback()

        existing = (
            db.query(Branch)
            .filter(
                Branch.tenant_id == data.tenant_id,
                (Branch.code == code) | (Branch.name == name),
            )
            .first()
        )

        if existing:
            if existing.code == code:
                raise ValueError(
                    "A branch with this code already exists."
                )

            raise ValueError(
                "A branch with this name already exists."
            )

        raise

    return branch


def get_branches(db: Session, tenant_id: str):
    return (
        db.query(Branch)
        .filter(Branch.tenant_id == tenant_id)
        .order_by(Branch.name)
        .all()
    )


def get_branch(db: Session, branch_id: str, tenant_id: str):
    return (
        db.query(Branch)
        .filter(
            Branch.id == branch_id,
            Branch.tenant_id == tenant_id,
        )
        .first()
    )


def update_branch(db: Session, branch: Branch, data):
    if data.name is not None:
        name = str(data.name).strip()
        if not name:
            raise ValueError("Branch name is required.")
        branch.name = name

    if data.code is not None:
        code = str(data.code).strip().upper()
        if not code:
            raise ValueError("Branch code is required.")
        branch.code = code

    if data.address is not None:
        address = str(data.address).strip()
        branch.address = address or None

    try:
        db.flush()
    except IntegrityError:
        db.rollback()

        existing = (
            db.query(Branch)
            .filter(
                Branch.tenant_id == branch.tenant_id,
                Branch.id != branch.id,
                (Branch.code == branch.code)
                | (Branch.name == branch.name),
            )
            .first()
        )

        if existing:
            if existing.code == branch.code:
                raise ValueError(
                    "A branch with this code already exists."
                )

            raise ValueError(
                "A branch with this name already exists."
            )

        raise

    return branch


def set_branch_status(
    db: Session,
    branch: Branch,
    is_active: bool,
):
    if not is_active:
        active_users = (
            db.query(User.id)
            .filter(
                User.branch_id == branch.id,
                User.tenant_id == branch.tenant_id,
                User.is_active.is_(True),
            )
            .count()
        )

        if active_users:
            raise ValueError(
                "This branch cannot be deactivated while it has "
                f"{active_users} active user(s). Reassign or deactivate "
                "those users first."
            )

    branch.is_active = is_active

    try:
        db.flush()
    except Exception:
        db.rollback()
        raise

    return branch
