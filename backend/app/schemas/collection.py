from datetime import date
from typing import Optional

from pydantic import BaseModel


class CollectionSummary(BaseModel):
    total_due: float
    total_paid: float
    overdue_amount: float
    overdue_count: int


class CollectionCase(BaseModel):
    id: str
    loanNo: str
    borrower: str
    phone: Optional[str] = None
    branch: Optional[str] = None
    officer: Optional[str] = None
    arrears: float
    days: int
    action: str
    outcome: Optional[str] = None
    nextVisit: Optional[str] = None
    status: str


class CollectionActivityCreate(BaseModel):
    loan_id: str
    borrower_id: str
    action: str
    outcome: Optional[str] = None
    notes: Optional[str] = None
    next_visit: Optional[date] = None
    status: str = "Pending"


class CollectionActivityResponse(BaseModel):
    id: str
    tenant_id: str
    loan_id: str
    borrower_id: str
    officer_id: Optional[str] = None
    action: str
    outcome: Optional[str] = None
    notes: Optional[str] = None
    next_visit: Optional[date] = None
    status: str

    class Config:
        from_attributes = True
