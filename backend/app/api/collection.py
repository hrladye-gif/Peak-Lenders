from fastapi import APIRouter, Depends

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
from app.schemas.collection import (
    CollectionActivityCreate,
)


router = APIRouter(
    prefix="/collections",
    tags=["Collections"],
)


@router.get("/summary/{tenant_id}")
def summary(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_collection_summary(
        db,
        tenant_id,
    )


@router.get("/{tenant_id}")
def cases(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_collection_cases(
        db,
        tenant_id,
    )


@router.post("/{tenant_id}/activities")
def create_activity(
    tenant_id: str,
    data: CollectionActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_collection_activity(
        db,
        tenant_id,
        current_user.id,
        data,
    )


@router.get("/{tenant_id}/activities/{loan_id}")
def activities(
    tenant_id: str,
    loan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_collection_activities(
        db,
        tenant_id,
        loan_id,
    )
