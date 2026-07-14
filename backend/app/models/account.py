from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.base import BaseMixin


class Account(BaseMixin, Base):
    __tablename__ = "accounts"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    account_code = Column(
        String,
        nullable=False
    )

    account_name = Column(
        String,
        nullable=False
    )

    account_type = Column(
        String,
        nullable=False
    )

    tenant = relationship(
        "Tenant"
    )

    journal_lines = relationship(
        "JournalLine",
        back_populates="account"
    )
