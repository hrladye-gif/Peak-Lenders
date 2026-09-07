from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment
from app.models.borrower import Borrower
from app.models.branch import Branch


def _money(value):
    return Decimal(str(value or 0))


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
            Loan.status.notin_(["WRITTEN_OFF"]),
        )
        .all()
    )

    total_due = Decimal("0.00")
    overdue_amount = Decimal("0.00")
    overdue_count = 0

    for schedule in schedules:
        due = _money(schedule.total_due)

        total_due += due

        if schedule.due_date < today:
            # repayment_service already reduces schedule.total_due
            # after every payment. Do not subtract historical
            # repayments a second time here.
            arrears = due

            if arrears > 0:
                overdue_amount += arrears
                overdue_count += 1

    payments = (
        db.query(Repayment)
        .join(Loan, Loan.id == Repayment.loan_id)
        .filter(
            Loan.tenant_id == tenant_id,
            Repayment.payment_date <= today,
        )
        .all()
    )

    total_paid = sum(
        (_money(x.total_paid) for x in payments),
        Decimal("0.00"),
    )

    return {
        "total_due": float(total_due),
        "total_paid": float(total_paid),
        "overdue_amount": float(overdue_amount),
        "overdue_count": overdue_count,
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
            Loan.status.notin_(["WRITTEN_OFF"]),
        )
        .order_by(
            LoanSchedule.due_date.asc(),
            LoanSchedule.installment_no.asc(),
        )
        .all()
    )

    cases = []

    for schedule, loan, borrower, branch in rows:
        # repayment_service keeps schedule.total_due as the
        # remaining amount after payments. Historical repayments
        # must not be subtracted again.
        arrears = _money(schedule.total_due)

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
