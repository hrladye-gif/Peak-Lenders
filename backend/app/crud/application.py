from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.application import LoanApplication
from app.services.application_number import generate_application_number


def create_application(
    db: Session,
    data,
    tenant_id: str,
    branch_id: str | None = None,
):
    application = LoanApplication(
        tenant_id=tenant_id,
        branch_id=data.branch_id or branch_id,
        borrower_id=data.borrower_id,
        loan_product_id=data.loan_product_id,
        application_number=generate_application_number(),
        amount=data.amount,
        term_months=data.term_months,
        purpose=data.purpose,
        status="PENDING",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_applications(
    db: Session,
    tenant_id: str,
):
    return (
        db.query(LoanApplication)
        .filter(
            LoanApplication.tenant_id == tenant_id
        )
        .order_by(
            LoanApplication.submitted_at.desc()
        )
        .all()
    )


def get_application(
    db: Session,
    application_id: str,
    tenant_id: str,
):
    return (
        db.query(LoanApplication)
        .filter(
            LoanApplication.id == application_id,
            LoanApplication.tenant_id == tenant_id,
        )
        .first()
    )


def update_application_status(
    db: Session,
    application: LoanApplication,
    status: str,
    reviewed_by: str,
):
    application.status = status
    application.reviewed_by = reviewed_by
    application.reviewed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(application)

    return application
