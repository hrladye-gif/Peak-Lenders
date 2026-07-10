from pydantic import BaseModel


class LoanCreate(BaseModel):

    tenant_id: str
    branch_id: str | None = None

    borrower_id: str

    loan_product_id: str

    principal: float

    interest_rate: float

    term_months: int



class LoanResponse(BaseModel):

    id: str

    loan_number: str

    principal: float

    status: str


    class Config:
        from_attributes = True
