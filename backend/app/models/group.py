from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class Group(BaseMixin, Base):
    __tablename__ = "groups"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    branch_id = Column(
        String,
        ForeignKey("branches.id"),
        nullable=True
    )

    name = Column(
        String,
        nullable=False
    )

    location = Column(String)

    status = Column(
        String,
        nullable=False,
        default="ACTIVE"
    )

    tenant = relationship(
        "Tenant",
        back_populates="groups"
    )

    branch = relationship(
        "Branch",
        back_populates="groups"
    )

    members = relationship(
        "GroupMember",
        back_populates="group",
        cascade="all, delete-orphan"
    )


class GroupMember(BaseMixin, Base):
    __tablename__ = "group_members"

    group_id = Column(
        String,
        ForeignKey("groups.id"),
        nullable=False
    )

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False
    )

    role = Column(
        String,
        nullable=False,
        default="MEMBER"
    )

    group = relationship(
        "Group",
        back_populates="members"
    )

    borrower = relationship(
        "Borrower",
        back_populates="group_memberships"
    )
