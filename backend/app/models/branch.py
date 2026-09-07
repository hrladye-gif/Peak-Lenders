from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class Branch(BaseMixin, Base):
    __tablename__ = "branches"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    code = Column(
        String,
        nullable=False
    )

    address = Column(String)

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    tenant = relationship(
        "Tenant",
        back_populates="branches"
    )

    users = relationship(
        "User",
        back_populates="branch"
    )

    borrowers = relationship(
        "Borrower",
        back_populates="branch"
    )

    groups = relationship(
        "Group",
        back_populates="branch"
    )

    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "name",
            name="uq_branches_tenant_name",
        ),
        UniqueConstraint(
            "tenant_id",
            "code",
            name="uq_branches_tenant_code",
        ),
    )
