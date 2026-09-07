from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.user import User


def get_activity_feed(
    db: Session,
    tenant_id: str,
    limit: int = 50,
):
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.tenant_id == tenant_id)
        .order_by(AuditLog.event_time.desc())
        .limit(limit)
        .all()
    )

    activities = []

    for log in logs:
        user = (
            db.query(User)
            .filter(
                User.id == log.performed_by,
                User.tenant_id == tenant_id,
            )
            .first()
            if log.performed_by
            else None
        )

        activities.append(
            {
                "id": log.id,
                "user": user.full_name if user and user.full_name else (
                    user.email if user else "System"
                ),
                "action": log.action or "ACTIVITY",
                "entityType": log.entity_type,
                "entityId": log.entity_id,
                "details": log.details,
                "branch": None,
                "time": log.event_time.isoformat() if log.event_time else None,
            }
        )

    return activities
