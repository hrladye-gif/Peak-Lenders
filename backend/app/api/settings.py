from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.settings import (
    TenantSettingsCreate,
    TenantSettingsResponse,
    TenantSettingsUpdate,
)
from app.services.settings_service import (
    create_settings,
    get_settings,
    update_settings,
)
from app.api.dependencies import require_permission
from app.services.audit_service import create_audit_log


router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


@router.get(
    "/",
    response_model=TenantSettingsResponse | None,
)
def read_settings(
    current_user: User = Depends(
        require_permission("settings.read")
    ),
    db: Session = Depends(get_db),
):
    return get_settings(db, current_user.tenant_id)


@router.post(
    "/",
    response_model=TenantSettingsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tenant_settings(
    payload: TenantSettingsCreate,
    current_user: User = Depends(
        require_permission("settings.manage")
    ),
    db: Session = Depends(get_db),
):
    existing = get_settings(db, current_user.tenant_id)

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Settings already exist for this institution.",
        )

    try:
        settings = create_settings(
            db,
            current_user.tenant_id,
            payload,
        )

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="TenantSettings",
            entity_id=settings.id,
            action="SETTINGS_CREATED",
            performed_by=current_user.id,
            details=(
                f"Created institution settings for {settings.org_name} "
                f"({settings.currency}, {settings.timezone})."
            ),
        )

        db.commit()
        db.refresh(settings)

        return settings

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Settings already exist for this institution.",
        )


@router.patch(
    "/",
    response_model=TenantSettingsResponse,
)
def update_tenant_settings(
    payload: TenantSettingsUpdate,
    current_user: User = Depends(
        require_permission("settings.manage")
    ),
    db: Session = Depends(get_db),
):
    settings = get_settings(db, current_user.tenant_id)

    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Settings have not been configured for this institution.",
        )

    changes = list(
        payload.model_dump(
            exclude_unset=True
        ).keys()
    )

    try:
        updated = update_settings(db, settings, payload)

        if changes:
            create_audit_log(
                db=db,
                tenant_id=current_user.tenant_id,
                entity_type="TenantSettings",
                entity_id=updated.id,
                action="SETTINGS_UPDATED",
                performed_by=current_user.id,
                details=(
                    "Updated institution settings fields: "
                    + ", ".join(changes)
                    + "."
                ),
            )

        db.commit()
        db.refresh(updated)

        return updated

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to update institution settings.",
        )
