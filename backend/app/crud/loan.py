from datetime import date
from dateutil.relativedelta import relativedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.borrower import Borrower
from app.models.loan_product import LoanProduct

from app.services.loan_number import generate_loan_number


def create_loan(
    db: Session,
    data,
):
    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == data.borrower_id,
            Borrower.tenant_id == data.tenant_id,
        )
        .first()
    )

    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrower does not belong to this institution.",
        )

    product = (
        db.query(LoanProduct)
        .filter(
            LoanProduct.id == data.loan_product_id,
            LoanProduct.tenant_id == data.tenant_id,
            LoanProduct.is_active == True,
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan product does not belong to this institution or is inactive.",
        )

    if data.principal < float(product.min_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan amount is below the minimum allowed amount of {product.min_amount}.",
        )

    if data.principal > float(product.max_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan amount exceeds the maximum allowed amount of {product.max_amount}.",
        )

    if data.term_months > product.max_term_months:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan term cannot exceed {product.max_term_months} months.",
        )

    issue_date = data.disbursement_date or date.today()

    due_date = (
        data.maturity_date
        if data.maturity_date
        else issue_date + relativedelta(months=data.term_months)
    )

    loan = Loan(
        tenant_id=data.tenant_id,
        branch_id=data.branch_id,
        borrower_id=data.borrower_id,
        loan_product_id=data.loan_product_id,
        loan_number=generate_loan_number(),
        principal=data.principal,
        interest_rate=data.interest_rate,
        term_months=data.term_months,
        status="PENDING",
        disbursement_date=issue_date,
        maturity_date=due_date,
    )

    db.add(loan)
    db.commit()
    db.refresh(loan)

    return loan


def get_loans(
    db: Session,
    tenant_id: str,
):
    return (
        db.query(Loan)
        .filter(
            Loan.tenant_id == tenant_id
        )
        .order_by(Loan.created_at.desc())
        .all()
    )
