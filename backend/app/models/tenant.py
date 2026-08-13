from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin

class Tenant(BaseMixin, Base):
    __tablename__ = "tenants"

    name = Column(String, nullable=False)

    code = Column(
        String,
        unique=True,
        nullable=False
    )

    branches = relationship(
        "Branch",
        back_populates="tenant"
    )

    users = relationship(
        "User",
        back_populates="tenant"
    )

    borrowers = relationship(
        "Borrower",
        back_populates="tenant"
    )

    groups = relationship(
        "Group",
        back_populates="tenant"
    )
