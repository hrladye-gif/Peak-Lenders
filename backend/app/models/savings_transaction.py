from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin

class SavingsTransaction(BaseMixin, Base):
    __tablename__ = "savings_transactions"

    savings_account_id = Column(
        String,
        ForeignKey("savings_accounts.id"),
        nullable=False
    )

    transaction_type = Column(
        String,
        nullable=False
    )

    amount = Column(
        Numeric(18,2),
        nullable=False
    )

    reference_no = Column(String)

    transaction_time = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
