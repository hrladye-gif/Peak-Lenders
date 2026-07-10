from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db

from app.services.schedule_service import (
    create_schedule
)


router = APIRouter(
    prefix="/schedules",
    tags=["Loan Schedules"]
)


@router.post("/{loan_id}")
def generate(
    loan_id: str,
    db: Session = Depends(get_db)
):

    return create_schedule(
        db,
        loan_id
    )
