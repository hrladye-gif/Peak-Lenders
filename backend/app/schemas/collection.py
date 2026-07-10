from pydantic import BaseModel


class CollectionSummary(BaseModel):

    total_due: float

    total_paid: float

    overdue_amount: float

    overdue_count: int
