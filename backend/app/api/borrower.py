from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.borrower import BorrowerCreate
from app.crud.borrower import create_borrower, get_borrowers, get_borrower
from app.api.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/borrowers",
    tags=["Borrowers"],
)


@router.post("")
def create(
    borrower: BorrowerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    borrower.tenant_id = current_user.tenant_id

    if borrower.branch_id is None:
        borrower.branch_id = current_user.branch_id

    return create_borrower(db, borrower)


@router.get("")
def list_borrowers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_borrowers(
        db,
        current_user.tenant_id,
    )


@router.get("/{borrower_id}")
def detail(
    borrower_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    borrower = get_borrower(
        db,
        borrower_id,
        current_user.tenant_id,
    )

    if not borrower:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Borrower not found",
        )

    return borrower
