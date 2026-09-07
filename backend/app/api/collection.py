from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.collection_service import (
    get_collection_summary,
    get_collection_cases,
)
from app.services.collection_activity_service import (
    create_collection_activity,
    get_collection_activities,
)
from app.schemas.collection import CollectionActivityCreate


router = APIRouter(
    prefix="/collections",
    tags=["Collections"],
)


def _verify_tenant(
    tenant_id: str,
    current_user: User,
):
    if str(tenant_id) != str(current_user.tenant_id):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this tenant's collections.",
        )


@router.get("/summary/{tenant_id}")
def summary(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_tenant(tenant_id, current_user)

    return get_collection_summary(
        db,
        current_user.tenant_id,
    )


@router.get("/{tenant_id}")
def cases(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_tenant(tenant_id, current_user)

    return get_collection_cases(
        db,
        current_user.tenant_id,
    )


@router.post("/{tenant_id}/activities")
def create_activity(
    tenant_id: str,
    data: CollectionActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_tenant(tenant_id, current_user)

    try:
        return create_collection_activity(
            db,
            current_user.tenant_id,
            current_user.id,
            data,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.get("/{tenant_id}/activities/{loan_id}")
def activities(
    tenant_id: str,
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_tenant(tenant_id, current_user)

    try:
        return get_collection_activities(
            db,
            current_user.tenant_id,
            loan_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )
