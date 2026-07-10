from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.db.database import Base
from app.models.base import BaseMixin

class Guarantor(BaseMixin, Base):
    __tablename__ = "guarantors"

    borrower_id = Column(
        String,
        ForeignKey("borrowers.id"),
        nullable=False
    )

    full_name = Column(String, nullable=False)

    phone = Column(String)

    national_id = Column(String)

    address = Column(String)
