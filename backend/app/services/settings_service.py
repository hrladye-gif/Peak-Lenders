from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.settings import TenantSettings


def get_settings(
    db: Session,
    tenant_id: str,
) -> TenantSettings | None:
    return db.scalar(
        select(TenantSettings).where(
            TenantSettings.tenant_id == tenant_id
        )
    )


def create_settings(
    db: Session,
    tenant_id: str,
    data,
) -> TenantSettings:
    settings = TenantSettings(
        tenant_id=tenant_id,
        org_name=data.org_name.strip(),
        currency=data.currency.strip().upper(),
        timezone=data.timezone.strip(),
        session_timeout_minutes=data.session_timeout_minutes,
        par_grace_period_days=data.par_grace_period_days,
        logo=data.logo,
    )

    db.add(settings)
    db.flush()

    return settings


def update_settings(
    db: Session,
    settings: TenantSettings,
    data,
) -> TenantSettings:
    updates = data.model_dump(exclude_unset=True)

    if "org_name" in updates and updates["org_name"] is not None:
        settings.org_name = updates["org_name"].strip()

    if "currency" in updates and updates["currency"] is not None:
        settings.currency = updates["currency"].strip().upper()

    if "timezone" in updates and updates["timezone"] is not None:
        settings.timezone = updates["timezone"].strip()

    if "session_timeout_minutes" in updates:
        settings.session_timeout_minutes = updates[
            "session_timeout_minutes"
        ]

    if "par_grace_period_days" in updates:
        settings.par_grace_period_days = updates[
            "par_grace_period_days"
        ]

    if "logo" in updates:
        settings.logo = updates["logo"]

    db.flush()

    return settings
