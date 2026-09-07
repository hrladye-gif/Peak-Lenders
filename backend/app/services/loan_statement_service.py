from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.borrower import Borrower
from app.models.loan_product import LoanProduct
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment


def get_loan_statement(
    db: Session,
    loan_id: str,
    tenant_id: str,
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found.",
        )

    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == loan.borrower_id,
            Borrower.tenant_id == tenant_id,
        )
        .first()
    )

    product = (
        db.query(LoanProduct)
        .filter(
            LoanProduct.id == loan.loan_product_id,
            LoanProduct.tenant_id == tenant_id,
        )
        .first()
    )

    schedules = (
        db.query(LoanSchedule)
        .filter(
            LoanSchedule.loan_id == loan.id,
        )
        .order_by(
            LoanSchedule.installment_no.asc()
        )
        .all()
    )

    repayments = (
        db.query(Repayment)
        .filter(
            Repayment.loan_id == loan.id,
        )
        .order_by(
            Repayment.payment_date.asc(),
            Repayment.created_at.asc(),
        )
        .all()
    )

    borrower_name = "Unknown Borrower"

    if borrower:
        borrower_name = (
            borrower.business_name
            or (
                f"{borrower.first_name or ''} "
                f"{borrower.last_name or ''}"
            ).strip()
            or "Unknown Borrower"
        )

    repayment_by_schedule = {}

    for repayment in repayments:
        if repayment.schedule_id:
            repayment_by_schedule.setdefault(
                repayment.schedule_id,
                {
                    "principal": Decimal("0.00"),
                    "interest": Decimal("0.00"),
                    "penalty": Decimal("0.00"),
                    "total": Decimal("0.00"),
                },
            )

            repayment_by_schedule[
                repayment.schedule_id
            ]["principal"] += Decimal(
                str(repayment.principal_paid or 0)
            )

            repayment_by_schedule[
                repayment.schedule_id
            ]["interest"] += Decimal(
                str(repayment.interest_paid or 0)
            )

            repayment_by_schedule[
                repayment.schedule_id
            ]["penalty"] += Decimal(
                str(repayment.penalty_paid or 0)
            )

            repayment_by_schedule[
                repayment.schedule_id
            ]["total"] += Decimal(
                str(repayment.total_paid or 0)
            )

    performance = []

    opening_balance = Decimal(
        str(loan.principal or 0)
    )

    total_principal_paid = Decimal("0.00")
    total_interest_paid = Decimal("0.00")
    total_penalty_paid = Decimal("0.00")
    total_payments = Decimal("0.00")
    total_interest_scheduled = Decimal("0.00")

    for schedule in schedules:
        allocation = repayment_by_schedule.get(
            schedule.id,
            {
                "principal": Decimal("0.00"),
                "interest": Decimal("0.00"),
                "penalty": Decimal("0.00"),
                "total": Decimal("0.00"),
            },
        )

        principal_due = Decimal(
            str(schedule.principal_due or 0)
        )

        interest_due = Decimal(
            str(schedule.interest_due or 0)
        )

        principal_paid = allocation["principal"]
        interest_paid = allocation["interest"]
        penalty_paid = allocation["penalty"]
        payment_made = allocation["total"]

        total_interest_scheduled += interest_due

        total_principal_paid += principal_paid
        total_interest_paid += interest_paid
        total_penalty_paid += penalty_paid
        total_payments += payment_made

        # Actual outstanding principal after payments.
        ending_balance = (
            opening_balance - principal_paid
        )

        if ending_balance < Decimal("0.00"):
            ending_balance = Decimal("0.00")

        # If no payment has yet been made, preserve the
        # contractual schedule balance as the expected balance.
        scheduled_balance = Decimal(
            str(schedule.balance_after or 0)
        )

        if payment_made == Decimal("0.00"):
            displayed_balance = scheduled_balance
        else:
            displayed_balance = ending_balance

        performance.append(
            {
                "month": schedule.due_date.strftime("%b %Y"),
                "installmentNo": schedule.installment_no,
                "dueDate": schedule.due_date,
                "beginningBalance": float(
                    opening_balance
                ),
                "principalDue": float(
                    principal_due
                ),
                "interestDue": float(
                    interest_due
                ),
                "principalPaid": float(
                    principal_paid
                ),
                "interestPaid": float(
                    interest_paid
                ),
                "interestAccrued": float(
                    interest_due
                ),
                "penalty": float(
                    penalty_paid
                ),
                "paymentMade": float(
                    payment_made
                ),
                "endingBalance": float(
                    displayed_balance
                ),
                "status": schedule.status,
            }
        )

        opening_balance = displayed_balance

    # Fallback when a loan has no generated schedule yet.
    if not schedules:
        performance = []

    actual_remaining_principal = (
        Decimal(str(loan.principal or 0))
        - total_principal_paid
    )

    if actual_remaining_principal < Decimal("0.00"):
        actual_remaining_principal = Decimal("0.00")

    total_scheduled = sum(
        (
            Decimal(str(schedule.total_due or 0))
            for schedule in schedules
        ),
        Decimal("0.00"),
    )

    total_outstanding_schedule = sum(
        (
            Decimal(str(schedule.total_due or 0))
            for schedule in schedules
            if schedule.status != "PAID"
        ),
        Decimal("0.00"),
    )

    return {
        "id": loan.id,
        "loanId": loan.loan_number,
        "borrowerId": loan.borrower_id,
        "borrowerName": borrower_name,
        "principal": float(loan.principal or 0),
        "remainingBalance": float(
            actual_remaining_principal
        ),
        "issueDate": loan.disbursement_date,
        "dueDate": loan.maturity_date,
        "status": loan.status,
        "interestType": (
            product.interest_method
            if product
            else "Reducing Balance"
        ),
        "interestRate": float(
            loan.interest_rate or 0
        ),
        "termMonths": int(
            loan.term_months or 0
        ),
        "repaymentFrequency": (
            product.repayment_frequency
            if product
            else "MONTHLY"
        ),
        "totalScheduled": float(total_scheduled),
        "totalOutstanding": float(
            total_outstanding_schedule
        ),
        "totalPrincipalPaid": float(
            total_principal_paid
        ),
        "totalInterestPaid": float(
            total_interest_paid
        ),
        "totalInterestScheduled": float(
            total_interest_scheduled
        ),
        "totalPenaltyPaid": float(
            total_penalty_paid
        ),
        "totalPayments": float(
            total_payments
        ),
        "performance": performance,
    }
