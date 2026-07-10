from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.tenant import TenantCreate

from app.crud.tenant import create_tenant

from app.api.dependencies import get_db


router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"]
)


@router.post("/")
def create(
    tenant: TenantCreate,
    db: Session = Depends(get_db)
):

    return create_tenant(
        db,
        tenant
    )
