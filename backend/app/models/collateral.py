from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Numeric

from app.db.database import Base
from app.models.base import BaseMixin

class Collateral(BaseMixin, Base):
    __tablename__ = "collaterals"

    loan_id = Column(
        String,
        ForeignKey("loans.id"),
        nullable=False
    )

    collateral_type = Column(
        String,
        nullable=False
    )

    description = Column(String)

    estimated_value = Column(
        Numeric(18,2),
        default=0
    )
