from sqlalchemy import Column, String, Numeric, ForeignKey, Date, DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin


class SavingsAccount(BaseMixin, Base):
    __tablename__ = "savings_accounts"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
    )

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False,
    )

    product_id = Column(
        String,
        ForeignKey("savings_products.id"),
        nullable=False,
    )

    account_number = Column(
        String,
        unique=True,
        nullable=False,
    )

    current_balance = Column(
        Numeric(18, 2),
        default=0,
    )

    status = Column(
        String,
        default="ACTIVE",
    )

    account_type = Column(
        String,
        nullable=False,
        default="VOLUNTARY_SAVINGS",
    )

    opening_date = Column(
        Date,
        nullable=False,
        server_default=func.current_date(),
    )

    closing_date = Column(
        Date,
        nullable=True,
    )

    closure_reason = Column(
        String,
        nullable=True,
    )

    last_transaction_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    closed_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True,
    )

    branch_id = Column(
        String,
        ForeignKey("branches.id"),
        nullable=True,
    )
