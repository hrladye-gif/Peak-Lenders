from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date

from app.db.database import Base
from app.models.base import BaseMixin

class Borrower(BaseMixin, Base):
    __tablename__ = "borrowers"

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

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    phone = Column(String)
    email = Column(String)

    national_id = Column(String)

    date_of_birth = Column(Date)

    gender = Column(String)

    address = Column(String)
