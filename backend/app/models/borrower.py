from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date
from sqlalchemy.orm import relationship

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


    borrower_type = Column(
        String,
        nullable=False,
        default="INDIVIDUAL"
    )


    first_name = Column(String)

    last_name = Column(String)

    business_name = Column(String)

    phone = Column(String)

    email = Column(String)

    national_id = Column(String)

    date_of_birth = Column(Date)

    gender = Column(String)

    address = Column(String)


    tenant = relationship(
        "Tenant",
        back_populates="borrowers"
    )


    branch = relationship(
        "Branch",
        back_populates="borrowers"
    )

    group_memberships = relationship(
        "GroupMember",
        back_populates="borrower"
    )
