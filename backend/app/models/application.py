from sqlalchemy import Column, String, ForeignKey, Numeric, Integer, DateTime
from sqlalchemy.sql import func

from app.db.database import Base
from app.models.base import BaseMixin


class LoanApplication(BaseMixin, Base):
    __tablename__ = "loan_applications"

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
        nullable=True
    )

    application_number = Column(
        String,
        unique=True,
        nullable=False
    )

    amount = Column(
        Numeric(18, 2),
        nullable=False
    )

    term_months = Column(
        Integer,
        nullable=False
    )

    purpose = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        nullable=False,
        default="PENDING"
    )

    submitted_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    reviewed_by = Column(
        String,
        ForeignKey("users.id"),
        nullable=True
    )
