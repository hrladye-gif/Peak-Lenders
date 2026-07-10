from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Numeric
from sqlalchemy import Integer
from sqlalchemy import Boolean

from app.db.database import Base
from app.models.base import BaseMixin

class LoanProduct(BaseMixin, Base):
    __tablename__ = "loan_products"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    name = Column(String, nullable=False)

    code = Column(String, nullable=False)

    interest_method = Column(
        String,
        nullable=False,
        default="DECLINING"
    )

    repayment_frequency = Column(
        String,
        nullable=False,
        default="MONTHLY"
    )

    interest_rate = Column(
        Numeric(12,2),
        nullable=False
    )

    min_amount = Column(
        Numeric(18,2),
        nullable=False
    )

    max_amount = Column(
        Numeric(18,2),
        nullable=False
    )

    max_term_months = Column(
        Integer,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )
