from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.loan import LoanCreate, LoanUpdate
from app.crud.loan import (
    create_loan,
    get_loans,
    get_loan,
    update_loan,
    delete_loan,
)
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
    loan.tenant_id = current_user.tenant_id

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


@router.get("/{loan_id}")
def get(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = get_loan(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )

    if not loan:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Loan not found.",
        )

    return loan


@router.patch("/{loan_id}")
def update(
    loan_id: str,
    data: LoanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = get_loan(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )

    if not loan:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Loan not found.",
        )

    return update_loan(
        db=db,
        loan=loan,
        data=data,
    )


@router.delete("/{loan_id}")
def remove(
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = get_loan(
        db=db,
        loan_id=loan_id,
        tenant_id=current_user.tenant_id,
    )

    if not loan:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Loan not found.",
        )

    return delete_loan(
        db=db,
        loan=loan,
    )
