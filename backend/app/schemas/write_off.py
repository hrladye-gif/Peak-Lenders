from datetime import date
from typing import Optional

from pydantic import BaseModel


class WriteOffCreate(BaseModel):
    loan_id: str
    amount: float
    reason: str


class WriteOffResponse(BaseModel):
    id: str
    tenant_id: str
    loan_id: str
    borrower_id: str
    requested_by: Optional[str] = None
    approved_by: Optional[str] = None
    amount: float
    reason: str
    status: str
    write_off_date: Optional[date] = None

    class Config:
        from_attributes = True


class WriteOffSummary(BaseModel):
    total_cases: int
    total_amount: float
    pending_cases: int
    approved_cases: int
