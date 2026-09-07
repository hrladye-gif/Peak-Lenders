from sqlalchemy import Column, String, Numeric, Boolean, ForeignKey, Index

from app.db.database import Base
from app.models.base import BaseMixin


class SavingsProduct(BaseMixin, Base):
    __tablename__ = "savings_products"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False,
    )

    name = Column(String, nullable=False)
    code = Column(String, nullable=False)

    interest_rate = Column(
        Numeric(12, 2),
        default=0,
    )

    # Kept for backward compatibility with existing data.
    minimum_balance = Column(
        Numeric(18, 2),
        default=0,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    product_type = Column(
        String,
        nullable=False,
        default="VOLUNTARY",
    )

    interest_frequency = Column(
        String,
        nullable=False,
        default="NONE",
    )

    opening_minimum_balance = Column(
        Numeric(18, 2),
        nullable=False,
        default=0,
    )

    withdrawal_minimum_balance = Column(
        Numeric(18, 2),
        nullable=False,
        default=0,
    )

    allow_withdrawals = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    allow_deposits = Column(
        Boolean,
        nullable=False,
        default=True,
    )


Index(
    "uq_savings_products_tenant_code",
    SavingsProduct.tenant_id,
    SavingsProduct.code,
    unique=True,
)
