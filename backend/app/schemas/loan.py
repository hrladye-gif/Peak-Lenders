from datetime import date

from pydantic import BaseModel, ConfigDict


class LoanCreate(BaseModel):
    tenant_id: str | None = None
    branch_id: str | None = None

    borrower_id: str
    loan_product_id: str

    principal: float
    interest_rate: float
    term_months: int

    disbursement_date: date | None = None
    maturity_date: date | None = None


class LoanUpdate(BaseModel):
    borrower_id: str | None = None
    loan_product_id: str | None = None
    principal: float | None = None
    interest_rate: float | None = None
    term_months: int | None = None
    maturity_date: date | None = None


class LoanResponse(BaseModel):
    id: str
    loan_number: str
    principal: float
    status: str
    disbursement_date: date | None = None
    maturity_date: date | None = None

    model_config = ConfigDict(from_attributes=True)
