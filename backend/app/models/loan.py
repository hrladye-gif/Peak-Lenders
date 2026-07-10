from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy import Numeric

from app.db.database import Base
from app.models.base import BaseMixin

class Loan(BaseMixin, Base):
    __tablename__ = "loans"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    branch_id = Column(
        String,
        ForeignKey("branches.id"),
        nullable=True
    )

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False
    )

    loan_product_id = Column(
        String,
        ForeignKey("loan_products.id"),
        nullable=False
    )

    loan_number = Column(
        String,
        unique=True,
        nullable=False
    )

    principal = Column(
        Numeric(18,2),
        nullable=False
    )

    interest_rate = Column(
        Numeric(12,2),
        nullable=False
    )

    term_months = Column(
        Numeric(12,0),
        nullable=False
    )

    disbursement_date = Column(Date)

    maturity_date = Column(Date)

    status = Column(
        String,
        default='PENDING'
    )
