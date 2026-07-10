from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session


from app.api.dependencies import get_db


from app.services.risk_service import (
    calculate_portfolio_risk
)



router = APIRouter(
    prefix="/risk",
    tags=["Portfolio Risk"]
)



@router.get("/{tenant_id}")
def risk(
    tenant_id: str,
    db: Session = Depends(get_db)
):

    return calculate_portfolio_risk(
        db,
        tenant_id
    )
