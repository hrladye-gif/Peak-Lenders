from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class TenantSettings(BaseMixin, Base):
    __tablename__ = "tenant_settings"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    org_name = Column(
        String,
        nullable=False,
    )

    currency = Column(
        String(10),
        nullable=False,
    )

    timezone = Column(
        String(100),
        nullable=False,
    )

    session_timeout_minutes = Column(
        Integer,
        nullable=False,
        default=30,
    )

    par_grace_period_days = Column(
        Integer,
        nullable=False,
        default=3,
    )

    logo = Column(
        Text,
        nullable=True,
    )

    tenant = relationship("Tenant")

    __table_args__ = ()
