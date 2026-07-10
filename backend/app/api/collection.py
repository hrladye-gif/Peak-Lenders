from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db

from app.services.collection_service import (
    get_collection_summary
)


router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)



@router.get("/{tenant_id}")
def summary(
    tenant_id: str,
    db: Session = Depends(get_db)
):

    return get_collection_summary(
        db,
        tenant_id
    )
