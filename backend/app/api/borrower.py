from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.borrower import BorrowerCreate, BorrowerUpdate, BorrowerStatusUpdate
from app.crud.borrower import (
    create_borrower,
    get_borrowers,
    get_borrower,
    update_borrower,
    set_borrower_active_status,
)
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
        raise HTTPException(
            status_code=404,
            detail="Borrower not found",
        )

    return borrower


@router.put("/{borrower_id}")
def update(
    borrower_id: str,
    data: BorrowerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    borrower = get_borrower(
        db,
        borrower_id,
        current_user.tenant_id,
    )

    if not borrower:
        raise HTTPException(
            status_code=404,
            detail="Borrower not found",
        )

    if data.phone is not None and not data.phone.strip():
        raise HTTPException(
            status_code=400,
            detail="Phone number is required.",
        )

    return update_borrower(
        db,
        borrower,
        data,
    )


@router.patch("/{borrower_id}/status")
def update_status(
    borrower_id: str,
    data: BorrowerStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    borrower = get_borrower(
        db,
        borrower_id,
        current_user.tenant_id,
    )

    if not borrower:
        raise HTTPException(
            status_code=404,
            detail="Borrower not found",
        )

    return set_borrower_active_status(
        db,
        borrower,
        data.is_active,
    )


@router.delete("/{borrower_id}")
def delete(
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
        raise HTTPException(
            status_code=404,
            detail="Borrower not found",
        )

    try:
        db.delete(borrower)
        db.commit()

        return {
            "message": "Borrower deleted successfully",
            "id": borrower_id,
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail=(
                "This borrower cannot be deleted because they have "
                "related records. Deactivate the borrower instead."
            ),
        )
