from pydantic import BaseModel, ConfigDict


class LoanProductCreate(BaseModel):
    name: str
    code: str
    interest_method: str = "DECLINING"
    repayment_frequency: str = "MONTHLY"
    interest_rate: float
    min_amount: float
    max_amount: float
    max_term_months: int


class LoanProductUpdate(BaseModel):
    name: str
    code: str
    interest_method: str
    repayment_frequency: str
    interest_rate: float
    min_amount: float
    max_amount: float
    max_term_months: int


class LoanProductStatusUpdate(BaseModel):
    is_active: bool


class LoanProductResponse(BaseModel):
    id: str
    tenant_id: str
    name: str
    code: str
    interest_method: str
    repayment_frequency: str
    interest_rate: float
    min_amount: float
    max_amount: float
    max_term_months: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
