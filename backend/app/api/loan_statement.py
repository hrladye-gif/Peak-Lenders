from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.loan_statement_service import get_loan_statement


router = APIRouter(
    prefix="/loan-statements",
    tags=["Loan Statements"],
)


@router.get("/{loan_id}")
def loan_statement(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_loan_statement(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )
