from sqlalchemy import Column
from sqlalchemy import String

from app.db.database import Base
from app.models.base import BaseMixin

class Tenant(BaseMixin, Base):
    __tablename__ = "tenants"

    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
