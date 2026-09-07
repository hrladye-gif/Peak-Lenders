from datetime import date
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_transaction import LoanTransaction
from app.services.accounting_service import post_loan_disbursement
from app.services.schedule_service import create_schedule


def approve_loan(
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

    if loan.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only PENDING loans can be approved. Current status: {loan.status}.",
        )

    loan.status = "APPROVED"

    db.commit()
    db.refresh(loan)

    return loan


def disburse_loan(
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

    if loan.status == "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan has already been disbursed.",
        )

    if loan.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only APPROVED loans can be disbursed. Current status: {loan.status}.",
        )

    try:
        amount = Decimal(str(loan.principal))

        post_loan_disbursement(
            db=db,
            tenant_id=loan.tenant_id,
            loan_id=loan.id,
            amount=amount,
            reference_no=loan.loan_number,
        )

        transaction = LoanTransaction(
            loan_id=loan.id,
            transaction_type="DISBURSEMENT",
            principal_amount=amount,
            interest_amount=Decimal("0.00"),
            penalty_amount=Decimal("0.00"),
            total_amount=amount,
            notes="Loan disbursement",
        )

        db.add(transaction)

        # Actual disbursement date is recorded only here.
        loan.disbursement_date = date.today()

        create_schedule(
            db=db,
            loan_id=loan.id,
        )

        loan.status = "ACTIVE"

        db.commit()
        db.refresh(loan)

        return loan

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise
