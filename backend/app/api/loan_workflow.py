from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.loan_workflow import approve_loan, disburse_loan


router = APIRouter(
    prefix="/loan-workflow",
    tags=["Loan Workflow"],
)


@router.post("/{loan_id}/approve")
def approve(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return approve_loan(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )


@router.post("/{loan_id}/disburse")
def disburse(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return disburse_loan(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )
