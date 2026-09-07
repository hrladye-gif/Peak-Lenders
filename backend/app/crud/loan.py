from datetime import date
from dateutil.relativedelta import relativedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.borrower import Borrower
from app.models.loan_product import LoanProduct
from app.models.loan_transaction import LoanTransaction
from app.models.loan_schedule import LoanSchedule

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
        loan_number=generate_loan_number(db),
        principal=data.principal,
        interest_rate=data.interest_rate,
        term_months=data.term_months,
        status="PENDING",
        disbursement_date=None,
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


def get_loan(
    db: Session,
    loan_id: str,
    tenant_id: str,
):
    return (
        db.query(Loan)
        .filter(
            Loan.id == loan_id,
            Loan.tenant_id == tenant_id,
        )
        .first()
    )


def update_loan(
    db: Session,
    loan: Loan,
    data,
):
    if loan.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PENDING loans can be edited.",
        )

    borrower_id = data.borrower_id or loan.borrower_id
    product_id = data.loan_product_id or loan.loan_product_id

    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == borrower_id,
            Borrower.tenant_id == loan.tenant_id,
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
            LoanProduct.id == product_id,
            LoanProduct.tenant_id == loan.tenant_id,
            LoanProduct.is_active == True,
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan product does not belong to this institution or is inactive.",
        )

    principal = (
        data.principal
        if data.principal is not None
        else float(loan.principal)
    )

    term_months = (
        data.term_months
        if data.term_months is not None
        else int(loan.term_months)
    )

    if principal < float(product.min_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan amount is below the minimum allowed amount of {product.min_amount}.",
        )

    if principal > float(product.max_amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan amount exceeds the maximum allowed amount of {product.max_amount}.",
        )

    if term_months <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan term must be greater than zero.",
        )

    if term_months > product.max_term_months:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Loan term cannot exceed {product.max_term_months} months.",
        )

    loan.borrower_id = borrower_id
    loan.loan_product_id = product_id
    loan.principal = principal
    loan.interest_rate = (
        data.interest_rate
        if data.interest_rate is not None
        else loan.interest_rate
    )
    loan.term_months = term_months

    if data.maturity_date is not None:
        loan.maturity_date = data.maturity_date
    elif data.term_months is not None:
        base_date = loan.created_at.date() if loan.created_at else date.today()
        loan.maturity_date = base_date + relativedelta(months=term_months)

    db.commit()
    db.refresh(loan)

    return loan


def delete_loan(
    db: Session,
    loan: Loan,
):
    if loan.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PENDING loans can be deleted.",
        )

    has_transactions = (
        db.query(LoanTransaction.id)
        .filter(LoanTransaction.loan_id == loan.id)
        .first()
    )

    if has_transactions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan has financial transactions and cannot be deleted.",
        )

    has_schedules = (
        db.query(LoanSchedule.id)
        .filter(LoanSchedule.loan_id == loan.id)
        .first()
    )

    if has_schedules:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan has repayment schedules and cannot be deleted.",
        )

    db.delete(loan)
    db.commit()

    return {"message": "Loan deleted successfully.", "id": loan.id}
