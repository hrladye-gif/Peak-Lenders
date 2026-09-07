from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.application import LoanApplication
from app.models.repayment import Repayment
from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.borrower import Borrower


def money(value):
    value = Decimal(str(value or 0))

    if value >= Decimal("1000000000"):
        return f"UGX {value / Decimal('1000000000'):.1f}B"

    if value >= Decimal("1000000"):
        return f"UGX {value / Decimal('1000000'):.1f}M"

    if value >= Decimal("1000"):
        return f"UGX {value / Decimal('1000'):.1f}K"

    return f"UGX {value:,.0f}"


def borrower_name(borrower):
    if not borrower:
        return "Borrower"

    full_name = " ".join(
        part
        for part in [
            getattr(borrower, "first_name", None),
            getattr(borrower, "last_name", None),
        ]
        if part
    ).strip()

    if full_name:
        return full_name

    return (
        getattr(borrower, "business_name", None)
        or "Borrower"
    )


def get_notification_time(value):
    if not value:
        return None

    return value.isoformat()


def get_notifications(
    db: Session,
    tenant_id: str,
):
    notifications = []

    # =========================================================
    # LOAN APPLICATIONS
    # =========================================================

    applications = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.tenant_id == tenant_id
        )
        .order_by(
            LoanApplication.updated_at.desc()
        )
        .limit(20)
        .all()
    )

    borrower_ids = {
        application.borrower_id
        for application in applications
        if application.borrower_id
    }

    borrowers = {}

    if borrower_ids:
        borrowers = {
            borrower.id: borrower
            for borrower in (
                db.query(Borrower)
                .filter(Borrower.id.in_(borrower_ids))
                .all()
            )
        }

    for application in applications:
        status = str(
            application.status or "PENDING"
        ).upper()

        name = borrower_name(
            borrowers.get(application.borrower_id)
        )

        amount = money(application.amount)

        event_time = (
            application.reviewed_at
            or application.submitted_at
            or application.updated_at
            or application.created_at
        )

        if status == "PENDING":
            title = "Loan Application Pending"
            message = (
                f"{name} submitted application "
                f"{application.application_number} "
                f"for {amount} and it is awaiting review."
            )
            notification_type = "warning"

        elif status == "APPROVED":
            title = "Loan Application Approved"
            message = (
                f"Application {application.application_number} "
                f"for {name} was approved for {amount}."
            )
            notification_type = "success"

        elif status == "REJECTED":
            title = "Loan Application Rejected"
            message = (
                f"Application {application.application_number} "
                f"for {name} was rejected."
            )
            notification_type = "error"

        else:
            title = "Loan Application Updated"
            message = (
                f"Application {application.application_number} "
                f"for {name} has been updated."
            )
            notification_type = "info"

        notifications.append(
            {
                "id": f"application-{application.id}",
                "type": notification_type,
                "title": title,
                "message": message,
                "time": get_notification_time(event_time),
                "read": False,
                "source": "loan_application",
                "source_id": application.id,
            }
        )

    # =========================================================
    # RECENT REPAYMENTS
    # =========================================================

    repayments = (
        db.query(Repayment)
        .join(
            Loan,
            Loan.id == Repayment.loan_id,
        )
        .filter(
            Loan.tenant_id == tenant_id
        )
        .order_by(
            Repayment.payment_date.desc(),
            Repayment.created_at.desc(),
        )
        .limit(20)
        .all()
    )

    loan_ids = {
        repayment.loan_id
        for repayment in repayments
        if repayment.loan_id
    }

    loans = {}

    if loan_ids:
        loans = {
            loan.id: loan
            for loan in (
                db.query(Loan)
                .filter(Loan.id.in_(loan_ids))
                .all()
            )
        }

    repayment_borrower_ids = {
        loan.borrower_id
        for loan in loans.values()
        if loan.borrower_id
    }

    repayment_borrowers = {}

    if repayment_borrower_ids:
        repayment_borrowers = {
            borrower.id: borrower
            for borrower in (
                db.query(Borrower)
                .filter(
                    Borrower.id.in_(repayment_borrower_ids)
                )
                .all()
            )
        }

    for repayment in repayments:
        loan = loans.get(repayment.loan_id)

        name = borrower_name(
            repayment_borrowers.get(
                loan.borrower_id
            )
            if loan
            else None
        )

        loan_number = (
            loan.loan_number
            if loan
            else repayment.loan_id
        )

        notifications.append(
            {
                "id": f"repayment-{repayment.id}",
                "type": "success",
                "title": "Loan Repayment Received",
                "message": (
                    f"{name} made a repayment of "
                    f"{money(repayment.total_paid)} "
                    f"for Loan #{loan_number}."
                ),
                "time": get_notification_time(
                    repayment.created_at
                ) or get_notification_time(
                    repayment.payment_date
                ),
                "read": False,
                "source": "repayment",
                "source_id": repayment.id,
            }
        )

    # =========================================================
    # OVERDUE SCHEDULES
    # =========================================================

    overdue_schedules = (
        db.query(LoanSchedule)
        .join(
            Loan,
            Loan.id == LoanSchedule.loan_id,
        )
        .filter(
            Loan.tenant_id == tenant_id,
            LoanSchedule.due_date < date.today(),
        )
        .limit(50)
        .all()
    )

    overdue_loan_ids = {
        schedule.loan_id
        for schedule in overdue_schedules
    }

    overdue_loans = {}

    if overdue_loan_ids:
        overdue_loans = {
            loan.id: loan
            for loan in (
                db.query(Loan)
                .filter(Loan.id.in_(overdue_loan_ids))
                .all()
            )
        }

    overdue_borrower_ids = {
        loan.borrower_id
        for loan in overdue_loans.values()
        if loan.borrower_id
    }

    overdue_borrowers = {}

    if overdue_borrower_ids:
        overdue_borrowers = {
            borrower.id: borrower
            for borrower in (
                db.query(Borrower)
                .filter(
                    Borrower.id.in_(overdue_borrower_ids)
                )
                .all()
            )
        }

    for schedule in overdue_schedules:
        loan = overdue_loans.get(schedule.loan_id)

        paid = Decimal(
            str(getattr(schedule, "total_paid", 0) or 0)
        )

        due = Decimal(
            str(schedule.total_due or 0)
        )

        balance = max(
            due - paid,
            Decimal("0"),
        )

        if balance <= 0:
            continue

        name = borrower_name(
            overdue_borrowers.get(
                loan.borrower_id
            )
            if loan
            else None
        )

        loan_number = (
            loan.loan_number
            if loan
            else schedule.loan_id
        )

        notifications.append(
            {
                "id": f"overdue-{schedule.id}",
                "type": "warning",
                "title": "Loan Installment Overdue",
                "message": (
                    f"{name} has an overdue installment "
                    f"of {money(balance)} for "
                    f"Loan #{loan_number}."
                ),
                "time": get_notification_time(
                    schedule.due_date
                ),
                "read": False,
                "source": "loan_schedule",
                "source_id": schedule.id,
            }
        )

    # =========================================================
    # SORT
    # =========================================================

    notifications.sort(
        key=lambda item: item.get("time") or "",
        reverse=True,
    )

    return notifications[:50]
