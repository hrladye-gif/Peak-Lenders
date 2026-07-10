from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from app.db.database import Base
from app.models.base import BaseMixin

class SavingsProduct(BaseMixin, Base):
    __tablename__ = "savings_products"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    name = Column(String, nullable=False)

    code = Column(String, nullable=False)

    interest_rate = Column(
        Numeric(12,2),
        default=0
    )

    minimum_balance = Column(
        Numeric(18,2),
        default=0
    )

    is_active = Column(
        Boolean,
        default=True
    )
