from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class Role(BaseMixin, Base):
    __tablename__ = "roles"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_system = Column(
        # System roles cannot be deleted through the API.
        # They may still be updated only where explicitly allowed.
        __import__("sqlalchemy").Boolean,
        nullable=False,
        default=False,
    )

    tenant = relationship("Tenant")
    user_roles = relationship(
        "UserRole",
        back_populates="role",
        cascade="all, delete-orphan",
    )
    role_permissions = relationship(
        "RolePermission",
        back_populates="role",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "code",
            name="uq_roles_tenant_code",
        ),
        UniqueConstraint(
            "tenant_id",
            "name",
            name="uq_roles_tenant_name",
        ),
    )


class RolePermission(Base):
    __tablename__ = "role_permissions"

    role_id = Column(
        String,
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )

    permission_id = Column(
        String,
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    )

    role = relationship(
        "Role",
        back_populates="role_permissions",
    )

    permission = relationship(
        "Permission",
        back_populates="role_permissions",
    )


class UserRole(Base):
    __tablename__ = "user_roles"

    user_id = Column(
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    role_id = Column(
        String,
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )

    user = relationship("User")
    role = relationship(
        "Role",
        back_populates="user_roles",
    )
