from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class Permission(BaseMixin, Base):
    __tablename__ = "permissions"

    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    role_permissions = relationship(
        "RolePermission",
        back_populates="permission",
        cascade="all, delete-orphan",
    )
