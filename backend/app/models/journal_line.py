from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Numeric
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class JournalLine(BaseMixin, Base):
    __tablename__ = "journal_lines"

    journal_entry_id = Column(
        String,
        ForeignKey("journal_entries.id"),
        nullable=False
    )

    account_id = Column(
        String,
        ForeignKey("accounts.id"),
        nullable=False
    )

    debit = Column(
        Numeric(18,2),
        default=0
    )

    credit = Column(
        Numeric(18,2),
        default=0
    )

    journal_entry = relationship(
        "JournalEntry",
        back_populates="lines"
    )

    account = relationship(
        "Account"
    )
