from datetime import date

from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment
from app.models.borrower import Borrower
from app.models.branch import Branch


def get_collection_summary(
    db: Session,
    tenant_id: str,
):
    today = date.today()

    schedules = (
        db.query(LoanSchedule)
        .join(Loan, Loan.id == LoanSchedule.loan_id)
        .filter(
            Loan.tenant_id == tenant_id,
            LoanSchedule.due_date <= today,
        )
        .all()
    )

    total_due = sum(
        (x.total_due or 0 for x in schedules),
        0,
    )

    overdue = [
        x for x in schedules
        if (x.total_paid or 0) < (x.total_due or 0)
    ]

    overdue_amount = sum(
        ((x.total_due or 0) - (x.total_paid or 0) for x in overdue),
        0,
    )

    payments = (
        db.query(Repayment)
        .join(Loan, Loan.id == Repayment.loan_id)
        .filter(Loan.tenant_id == tenant_id)
        .all()
    )

    total_paid = sum(
        (x.total_paid or 0 for x in payments),
        0,
    )

    return {
        "total_due": float(total_due),
        "total_paid": float(total_paid),
        "overdue_amount": float(overdue_amount),
        "overdue_count": len(overdue),
    }


def get_collection_cases(
    db: Session,
    tenant_id: str,
):
    today = date.today()

    rows = (
        db.query(
            LoanSchedule,
            Loan,
            Borrower,
            Branch,
        )
        .join(Loan, Loan.id == LoanSchedule.loan_id)
        .join(Borrower, Borrower.id == Loan.borrower_id)
        .outerjoin(Branch, Branch.id == Loan.branch_id)
        .filter(
            Loan.tenant_id == tenant_id,
            LoanSchedule.due_date < today,
        )
        .order_by(LoanSchedule.due_date.asc())
        .all()
    )

    cases = []

    for schedule, loan, borrower, branch in rows:
        total_due = schedule.total_due or 0
        total_paid = getattr(schedule, "total_paid", 0) or 0
        arrears = total_due - total_paid

        if arrears <= 0:
            continue

        days = (today - schedule.due_date).days

        cases.append(
            {
                "id": f"COL-{schedule.id[:8]}",
                "loan_id": loan.id,
                "borrower_id": borrower.id,
                "loanNo": loan.loan_number,
                "borrower": (
                    f"{borrower.first_name or ''} "
                    f"{borrower.last_name or ''}"
                ).strip()
                or borrower.business_name
                or "Unknown",
                "phone": borrower.phone,
                "branch": branch.name if branch else None,
                "officer": None,
                "arrears": float(arrears),
                "days": days,
                "action": "Phone Call",
                "outcome": None,
                "nextVisit": None,
                "status": "Pending",
            }
        )

    return cases
