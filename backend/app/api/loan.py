from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session


from app.schemas.loan import LoanCreate


from app.crud.loan import (
    create_loan,
    get_loans
)


from app.api.dependencies import get_db



router = APIRouter(
    prefix="/loans",
    tags=["Loans"]
)



@router.post("/")
def create(
    loan: LoanCreate,
    db: Session = Depends(get_db)
):

    return create_loan(
        db,
        loan
    )



@router.get("/{tenant_id}")
def list_loans(
    tenant_id: str,
    db: Session = Depends(get_db)
):

    return get_loans(
        db,
        tenant_id
    )
