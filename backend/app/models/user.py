from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class User(BaseMixin, Base):

    __tablename__ = "users"


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


    first_name = Column(
        String,
        nullable=False
    )


    last_name = Column(
        String,
        nullable=False
    )


    email = Column(
        String,
        unique=True,
        nullable=False
    )


    password_hash = Column(
        String,
        nullable=False
    )


    role = Column(
        String,
        nullable=False
    )


    is_active = Column(
        Boolean,
        default=True
    )


    tenant = relationship(
        "Tenant",
        back_populates="users"
    )


    branch = relationship(
        "Branch",
        back_populates="users"
    )
