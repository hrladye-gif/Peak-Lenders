from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin

class AuditLog(BaseMixin, Base):
    __tablename__ = "audit_logs"

    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)

    action = Column(String, nullable=False)

    performed_by = Column(String)

    details = Column(Text)

    event_time = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
