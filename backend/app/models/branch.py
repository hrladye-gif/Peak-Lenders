from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
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
