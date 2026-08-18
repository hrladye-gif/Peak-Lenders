from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment
from app.models.loan_transaction import LoanTransaction


def process_repayment(
    db: Session,
    data,
):
    amount = Decimal(str(data.amount))

    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repayment amount must be greater than zero.",
        )

    loan = (
        db.query(Loan)
        .filter(Loan.id == data.loan_id)
        .first()
    )

    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found.",
        )

    schedule = (
        db.query(LoanSchedule)
        .filter(
            LoanSchedule.loan_id == loan.id,
            LoanSchedule.status == "PENDING",
        )
        .order_by(
            LoanSchedule.due_date.asc(),
            LoanSchedule.installment_no.asc(),
        )
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan has no outstanding repayment schedule.",
        )

    interest_due = Decimal(str(schedule.interest_due or 0))
    principal_due = Decimal(str(schedule.principal_due or 0))

    remaining = amount

    interest_paid = min(
        remaining,
        interest_due,
    )

    remaining -= interest_paid

    principal_paid = min(
        remaining,
        principal_due,
    )

    remaining -= principal_paid

    total_paid = (
        interest_paid +
        principal_paid
    )

    if total_paid <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment could not be allocated.",
        )

    new_interest_due = interest_due - interest_paid
    new_principal_due = principal_due - principal_paid

    schedule.interest_due = new_interest_due
    schedule.principal_due = new_principal_due

    schedule.total_due = (
        new_interest_due +
        new_principal_due
    )

    if schedule.total_due <= Decimal("0.01"):
        schedule.total_due = Decimal("0.00")
        schedule.status = "PAID"

    repayment = Repayment(
        loan_id=loan.id,
        schedule_id=schedule.id,
        payment_date=data.payment_date,
        principal_paid=principal_paid,
        interest_paid=interest_paid,
        penalty_paid=Decimal("0.00"),
        total_paid=total_paid,
        payment_method=data.payment_method,
        reference_no=data.reference_no,
    )

    transaction = LoanTransaction(
        loan_id=loan.id,
        transaction_type="REPAYMENT",
        principal_amount=principal_paid,
        interest_amount=interest_paid,
        penalty_amount=Decimal("0.00"),
        total_amount=total_paid,
        notes=f"Repayment for installment {schedule.installment_no}",
    )

    db.add(repayment)
    db.add(transaction)

    db.commit()

    db.refresh(repayment)

    return {
        "id": repayment.id,
        "loan_id": repayment.loan_id,
        "schedule_id": repayment.schedule_id,
        "payment_date": repayment.payment_date,
        "principal_paid": float(repayment.principal_paid),
        "interest_paid": float(repayment.interest_paid),
        "penalty_paid": float(repayment.penalty_paid),
        "total_paid": float(repayment.total_paid),
        "payment_method": repayment.payment_method,
        "reference_no": repayment.reference_no,
        "installment_no": schedule.installment_no,
        "schedule_status": schedule.status,
        "remaining_schedule_balance": float(schedule.total_due),
    }
