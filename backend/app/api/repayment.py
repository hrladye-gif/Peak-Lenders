from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db

from app.schemas.repayment import RepaymentCreate

from app.services.repayment_service import (
    process_repayment
)


router = APIRouter(
    prefix="/repayments",
    tags=["Repayments"]
)


@router.post("/")
def create_payment(
    payment: RepaymentCreate,
    db: Session = Depends(get_db)
):

    return process_repayment(
        db,
        payment
    )
