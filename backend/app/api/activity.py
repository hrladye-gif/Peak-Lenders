from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db, require_permission
from app.models.user import User
from app.services.activity_service import get_activity_feed

router = APIRouter(prefix="/activity", tags=["Activity"])


@router.get("")
def list_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: None = Depends(require_permission("audit.read")),
):
    return get_activity_feed(
        db=db,
        tenant_id=current_user.tenant_id,
    )
