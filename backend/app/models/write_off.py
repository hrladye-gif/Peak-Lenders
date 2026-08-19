from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Numeric

from app.db.database import Base
from app.models.base import BaseMixin


class WriteOff(BaseMixin, Base):
    __tablename__ = "write_offs"

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

    requested_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    approved_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    amount = Column(
        Numeric(18, 2),
        nullable=False,
    )

    reason = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        nullable=False,
        default="Pending",
    )

    write_off_date = Column(
        Date,
        nullable=True,
    )
