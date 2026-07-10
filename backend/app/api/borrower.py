from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.borrower import BorrowerCreate

from app.crud.borrower import (
    create_borrower,
    get_borrowers
)

from app.api.dependencies import get_db


router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"]
)



@router.post("/")
def create(
    borrower: BorrowerCreate,
    db: Session = Depends(get_db)
):

    return create_borrower(
        db,
        borrower
    )



@router.get("/{tenant_id}")
def list_borrowers(
    tenant_id: str,
    db: Session = Depends(get_db)
):

    return get_borrowers(
        db,
        tenant_id
    )
