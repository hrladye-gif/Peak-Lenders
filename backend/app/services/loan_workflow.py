from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.account import Account
from app.models.loan_transaction import LoanTransaction
from decimal import Decimal

from app.services.accounting_service import create_journal_entry


def approve_loan(
    db: Session,
    loan_id: str,
):
    loan = (
        db.query(Loan)
        .filter(Loan.id == loan_id)
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
            detail=f"Loan cannot be approved from status {loan.status}.",
        )

    loan.status = "APPROVED"

    db.commit()
    db.refresh(loan)

    return loan


def disburse_loan(
    db: Session,
    loan_id: str,
):
    loan = (
        db.query(Loan)
        .filter(Loan.id == loan_id)
        .first()
    )

    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found.",
        )

    if loan.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan must be APPROVED before disbursement. Current status: {loan.status}.",
        )

    loan_account = (
        db.query(Account)
        .filter(
            Account.tenant_id == loan.tenant_id,
            Account.account_code == "1100",
        )
        .first()
    )

    cash_account = (
        db.query(Account)
        .filter(
            Account.tenant_id == loan.tenant_id,
            Account.account_code == "1000",
        )
        .first()
    )

    if not loan_account:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Loan Portfolio account (1100) is missing.",
        )

    if not cash_account:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cash account (1000) is missing.",
        )

    loan.status = "ACTIVE"
    loan.disbursement_date = date.today()

    create_journal_entry(
        db=db,
        tenant_id=loan.tenant_id,
        reference_no=loan.loan_number,
        description="Loan Disbursement",
        lines=[
            {
                "account_id": loan_account.id,
                "debit": loan.principal,
                "credit": 0,
            },
            {
                "account_id": cash_account.id,
                "debit": 0,
                "credit": loan.principal,
            },
        ],
    )

    transaction = LoanTransaction(
        loan_id=loan.id,
        transaction_type="DISBURSEMENT",
        principal_amount=Decimal(str(loan.principal)),
        interest_amount=Decimal("0.00"),
        penalty_amount=Decimal("0.00"),
        total_amount=Decimal(str(loan.principal)),
        notes="Loan disbursement",
    )

    db.add(transaction)

    db.commit()
    db.refresh(loan)

    return loan
