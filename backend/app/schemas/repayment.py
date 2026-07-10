from pydantic import BaseModel


class RepaymentCreate(BaseModel):

    loan_id: str

    payment_date: str

    amount: float

    payment_method: str | None = None

    reference_no: str | None = None
