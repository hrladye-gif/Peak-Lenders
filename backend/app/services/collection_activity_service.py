from sqlalchemy.orm import Session

from app.models.collection_activity import CollectionActivity


def create_collection_activity(
    db: Session,
    tenant_id: str,
    officer_id: str | None,
    data,
):
    activity = CollectionActivity(
        tenant_id=tenant_id,
        loan_id=data.loan_id,
        borrower_id=data.borrower_id,
        officer_id=officer_id,
        action=data.action,
        outcome=data.outcome,
        notes=data.notes,
        next_visit=data.next_visit,
        status=data.status,
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


def get_collection_activities(
    db: Session,
    tenant_id: str,
    loan_id: str,
):
    return (
        db.query(CollectionActivity)
        .filter(
            CollectionActivity.tenant_id == tenant_id,
            CollectionActivity.loan_id == loan_id,
        )
        .order_by(CollectionActivity.created_at.desc())
        .all()
    )
