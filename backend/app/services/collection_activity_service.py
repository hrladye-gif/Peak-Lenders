from sqlalchemy.orm import Session

from app.models.collection_activity import CollectionActivity
from app.models.loan import Loan
from app.models.borrower import Borrower


def create_collection_activity(
    db: Session,
    tenant_id: str,
    officer_id: str | None,
    data,
):
    loan = (
        db.query(Loan)
        .filter(
            Loan.id == data.loan_id,
            Loan.tenant_id == tenant_id,
        )
        .first()
    )

    if not loan:
        raise ValueError("Loan not found.")

    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == data.borrower_id,
            Borrower.tenant_id == tenant_id,
        )
        .first()
    )

    if not borrower:
        raise ValueError("Borrower not found.")

    if borrower.id != loan.borrower_id:
        raise ValueError(
            "Borrower does not belong to the selected loan."
        )

    activity = CollectionActivity(
        tenant_id=tenant_id,
        loan_id=loan.id,
        borrower_id=borrower.id,
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
    loan = (
        db.query(Loan)
        .filter(
            Loan.id == loan_id,
            Loan.tenant_id == tenant_id,
        )
        .first()
    )

    if not loan:
        raise ValueError("Loan not found.")

    return (
        db.query(CollectionActivity)
        .filter(
            CollectionActivity.tenant_id == tenant_id,
            CollectionActivity.loan_id == loan.id,
        )
        .order_by(CollectionActivity.created_at.desc())
        .all()
    )
