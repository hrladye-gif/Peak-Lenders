from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Numeric

from app.db.database import Base
from app.models.base import BaseMixin

class Repayment(BaseMixin, Base):
    __tablename__ = "repayments"

    loan_id = Column(
        String,
        ForeignKey("loans.id"),
        nullable=False
    )

    schedule_id = Column(
        String,
        ForeignKey("loan_schedules.id"),
        nullable=True
    )

    payment_date = Column(
        Date,
        nullable=False
    )

    principal_paid = Column(
        Numeric(18,2),
        default=0
    )

    interest_paid = Column(
        Numeric(18,2),
        default=0
    )

    penalty_paid = Column(
        Numeric(18,2),
        default=0
    )

    total_paid = Column(
        Numeric(18,2),
        nullable=False
    )

    reference_no = Column(String)

    payment_method = Column(String)

    received_by = Column(String)
