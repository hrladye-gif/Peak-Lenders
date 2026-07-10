from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Numeric
from sqlalchemy import Integer

from app.db.database import Base
from app.models.base import BaseMixin

class LoanSchedule(BaseMixin, Base):
    __tablename__ = "loan_schedules"

    loan_id = Column(
        String,
        ForeignKey("loans.id"),
        nullable=False
    )

    installment_no = Column(
        Integer,
        nullable=False
    )

    due_date = Column(
        Date,
        nullable=False
    )

    principal_due = Column(
        Numeric(18,2),
        nullable=False
    )

    interest_due = Column(
        Numeric(18,2),
        nullable=False
    )

    total_due = Column(
        Numeric(18,2),
        nullable=False
    )

    balance_after = Column(
        Numeric(18,2),
        nullable=False
    )

    status = Column(
        String,
        default='PENDING'
    )
