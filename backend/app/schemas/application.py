from datetime import datetime
from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    borrower_id: str
    branch_id: str | None = None
    loan_product_id: str | None = None
    amount: float
    term_months: int
    purpose: str | None = None


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: str
    application_number: str
    borrower_id: str
    branch_id: str | None = None
    loan_product_id: str | None = None
    amount: float
    term_months: int
    purpose: str | None = None
    status: str
    submitted_at: datetime

    class Config:
        from_attributes = True
