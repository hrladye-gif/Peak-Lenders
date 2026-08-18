from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Text

from app.db.database import Base
from app.models.base import BaseMixin


class CollectionActivity(BaseMixin, Base):
    __tablename__ = "collection_activities"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
    )

    loan_id = Column(
        String,
        ForeignKey("loans.id"),
        nullable=False,
    )

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False,
    )

    officer_id = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    action = Column(
        String,
        nullable=False,
    )

    outcome = Column(
        String,
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    next_visit = Column(
        Date,
        nullable=True,
    )

    status = Column(
        String,
        nullable=False,
        default="Pending",
    )
