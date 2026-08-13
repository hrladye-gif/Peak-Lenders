from sqlalchemy.orm import Session, joinedload

from app.models.group import Group, GroupMember
from app.models.borrower import Borrower
from app.schemas.group import GroupCreate, GroupMemberCreate


def create_group(
    db: Session,
    data: GroupCreate,
    tenant_id: str,
    branch_id: str | None = None,
):
    group = Group(
        tenant_id=tenant_id,
        branch_id=data.branch_id or branch_id,
        name=data.name,
        location=data.location,
        status="ACTIVE",
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    return group


def get_groups(db: Session, tenant_id: str):
    return (
        db.query(Group)
        .options(
            joinedload(Group.members)
            .joinedload(GroupMember.borrower)
        )
        .filter(Group.tenant_id == tenant_id)
        .order_by(Group.created_at.desc())
        .all()
    )


def get_group(
    db: Session,
    group_id: str,
    tenant_id: str,
):
    return (
        db.query(Group)
        .options(
            joinedload(Group.members)
            .joinedload(GroupMember.borrower)
        )
        .filter(
            Group.id == group_id,
            Group.tenant_id == tenant_id,
        )
        .first()
    )


def add_group_member(
    db: Session,
    group: Group,
    data: GroupMemberCreate,
):
    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == data.borrower_id,
            Borrower.tenant_id == group.tenant_id,
        )
        .first()
    )

    if not borrower:
        return None, "Borrower not found"

    existing = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group.id,
            GroupMember.borrower_id == borrower.id,
        )
        .first()
    )

    if existing:
        return None, "Borrower is already a member of this group"

    member = GroupMember(
        group_id=group.id,
        borrower_id=borrower.id,
        role=data.role.upper(),
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member, None
