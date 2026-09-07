from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    tenant_id: str,
    entity_type: str,
    entity_id: str,
    action: str,
    performed_by: str | None = None,
    details: str | None = None,
) -> AuditLog:
    log = AuditLog(
        tenant_id=tenant_id,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        performed_by=performed_by,
        details=details,
    )

    db.add(log)
    db.flush()

    return log
