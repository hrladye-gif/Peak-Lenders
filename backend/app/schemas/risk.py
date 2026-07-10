from pydantic import BaseModel


class RiskSummary(BaseModel):

    portfolio_outstanding: float

    overdue_amount: float

    par_percentage: float

    overdue_loans: int
