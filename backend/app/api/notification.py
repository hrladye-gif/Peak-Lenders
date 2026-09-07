from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.notification_service import get_notifications


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_notifications(
        db=db,
        tenant_id=current_user.tenant_id,
    )
