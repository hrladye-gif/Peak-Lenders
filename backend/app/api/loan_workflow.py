from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db

from app.services.loan_workflow import (
    approve_loan,
    disburse_loan
)



router = APIRouter(
    prefix="/loan-workflow",
    tags=["Loan Workflow"]
)



@router.post("/{loan_id}/approve")
def approve(
    loan_id: str,
    db: Session = Depends(get_db)
):

    return approve_loan(
        db,
        loan_id
    )



@router.post("/{loan_id}/disburse")
def disburse(
    loan_id: str,
    db: Session = Depends(get_db)
):

    return disburse_loan(
        db,
        loan_id
    )
