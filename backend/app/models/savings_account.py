from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import ForeignKey

from app.db.database import Base
from app.models.base import BaseMixin

class SavingsAccount(BaseMixin, Base):
    __tablename__ = "savings_accounts"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False
    )

    product_id = Column(
        String,
        ForeignKey("savings_products.id"),
        nullable=False
    )

    account_number = Column(
        String,
        unique=True,
        nullable=False
    )

    current_balance = Column(
        Numeric(18,2),
        default=0
    )

    status = Column(
        String,
        default='ACTIVE'
    )
