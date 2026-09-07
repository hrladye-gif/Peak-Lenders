from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime, Date, Text, Index
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin


class SavingsTransaction(BaseMixin, Base):
    __tablename__ = "savings_transactions"

    savings_account_id = Column(
        String,
        ForeignKey("savings_accounts.id"),
        nullable=False,
    )

    transaction_type = Column(
        String,
        nullable=False,
    )

    amount = Column(
        Numeric(18, 2),
        nullable=False,
    )

    reference_no = Column(
        String,
        nullable=True,
    )

    transaction_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    payment_method = Column(
        String,
        nullable=False,
        default="CASH",
    )

    effective_date = Column(
        Date,
        nullable=False,
        server_default=func.current_date(),
    )

    initiated_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    reversed_transaction_id = Column(
        String,
        ForeignKey("savings_transactions.id"),
        nullable=True,
    )

    reversal_reason = Column(
        Text,
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )


Index(
    "uq_savings_transactions_reference_no",
    SavingsTransaction.reference_no,
    unique=True,
    postgresql_where=(
        SavingsTransaction.reference_no.isnot(None)
    ),
)
