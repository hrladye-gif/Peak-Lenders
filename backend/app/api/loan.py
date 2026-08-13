from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.loan import LoanCreate
from app.crud.loan import create_loan, get_loans
from app.api.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/loans",
    tags=["Loans"],
)


@router.post("/")
def create(
    loan: LoanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Tenant is always taken from the authenticated user.
    loan.tenant_id = current_user.tenant_id

    # If the user has a branch, keep the loan inside that branch.
    if current_user.branch_id:
        loan.branch_id = current_user.branch_id

    return create_loan(
        db=db,
        data=loan,
    )


@router.get("/")
def list_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_loans(
        db=db,
        tenant_id=current_user.tenant_id,
    )
