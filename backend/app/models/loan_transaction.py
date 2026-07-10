from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Numeric
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin

class LoanTransaction(BaseMixin, Base):
    __tablename__ = "loan_transactions"

    loan_id = Column(
        String,
        ForeignKey("loans.id"),
        nullable=False
    )

    transaction_type = Column(
        String,
        nullable=False
    )

    principal_amount = Column(
        Numeric(18,2),
        default=0
    )

    interest_amount = Column(
        Numeric(18,2),
        default=0
    )

    penalty_amount = Column(
        Numeric(18,2),
        default=0
    )

    total_amount = Column(
        Numeric(18,2),
        nullable=False
    )

    notes = Column(String)

    transaction_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
