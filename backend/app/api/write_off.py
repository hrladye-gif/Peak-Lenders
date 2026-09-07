from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User

from app.schemas.write_off import WriteOffCreate

from app.services.write_off_service import (
    get_write_off_summary,
    get_write_offs,
    create_write_off,
    approve_write_off,
)


router = APIRouter(
    prefix="/write-offs",
    tags=["Write-Offs"],
)


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_write_off_summary(
        db,
        current_user.tenant_id,
    )


@router.get("/")
def list_write_offs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_write_offs(
        db,
        current_user.tenant_id,
    )


@router.post("/")
def create(
    data: WriteOffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_write_off(
            db=db,
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            loan_id=data.loan_id,
            amount=data.amount,
            reason=data.reason,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post("/{write_off_id}/approve")
def approve(
    write_off_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.lower() not in {"admin", "administrator"}:
        raise HTTPException(
            status_code=403,
            detail="Administrator access required to approve write-offs.",
        )

    try:
        return approve_write_off(
            db=db,
            tenant_id=current_user.tenant_id,
            write_off_id=write_off_id,
            user_id=current_user.id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
