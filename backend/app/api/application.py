from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationStatusUpdate,
)
from app.crud.application import (
    create_application,
    get_applications,
    get_application,
    update_application_status,
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.post("")
def create(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_application(
        db,
        application,
        current_user.tenant_id,
        current_user.branch_id,
    )


@router.get("")
def list_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_applications(
        db,
        current_user.tenant_id,
    )


@router.patch("/{application_id}/status")
def change_status(
    application_id: str,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    status = data.status.upper()

    if status not in {"APPROVED", "REJECTED", "PENDING"}:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status.",
        )

    application = get_application(
        db,
        application_id,
        current_user.tenant_id,
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Loan application not found.",
        )

    return update_application_status(
        db,
        application,
        status,
        current_user.id,
    )
