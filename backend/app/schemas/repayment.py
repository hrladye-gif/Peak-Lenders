from datetime import date

from pydantic import BaseModel


class RepaymentCreate(BaseModel):
    loan_id: str
    payment_date: date
    amount: float
    payment_method: str | None = None
    reference_no: str | None = None
