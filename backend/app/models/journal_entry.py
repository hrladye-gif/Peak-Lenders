from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Text
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class JournalEntry(BaseMixin, Base):
    __tablename__ = "journal_entries"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    entry_date = Column(
        Date,
        nullable=False
    )

    reference_no = Column(String)

    description = Column(Text)

    source_module = Column(String)

    tenant = relationship(
        "Tenant"
    )

    lines = relationship(
        "JournalLine",
        back_populates="journal_entry",
        cascade="all, delete-orphan"
    )
