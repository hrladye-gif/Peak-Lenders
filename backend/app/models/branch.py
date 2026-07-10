from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.db.database import Base
from app.models.base import BaseMixin

class Branch(BaseMixin, Base):
    __tablename__ = "branches"

    tenant_id = Column(
        String,
        ForeignKey("tenants.id"),
        nullable=False
    )

    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    address = Column(String)
