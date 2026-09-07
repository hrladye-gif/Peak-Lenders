from sqlalchemy import Column, ForeignKey, Index, String, Text, DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin


class AuditLog(BaseMixin, Base):
    __tablename__ = "audit_logs"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)

    action = Column(String, nullable=False)

    performed_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    details = Column(Text)

    event_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    __table_args__ = (
        Index(
            "ix_audit_logs_tenant_event_time",
            "tenant_id",
            "event_time",
        ),
        Index(
            "ix_audit_logs_tenant_entity",
            "tenant_id",
            "entity_type",
            "entity_id",
        ),
    )
