from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan_product import LoanProduct


def _validate_product(data):
    if not data.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan product name is required.",
        )

    if not data.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan product code is required.",
        )

    if data.min_amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum loan amount must be greater than zero.",
        )

    if data.max_amount < data.min_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum loan amount cannot be below minimum loan amount.",
        )

    if data.max_term_months <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum term must be greater than zero.",
        )

    if data.interest_rate < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interest rate cannot be negative.",
        )


def create_loan_product(
    db: Session,
    data,
    tenant_id: str,
):
    _validate_product(data)

    code = data.code.strip().upper()

    existing = (
        db.query(LoanProduct)
        .filter(
            LoanProduct.tenant_id == tenant_id,
            LoanProduct.code == code,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A loan product with this code already exists.",
        )

    product = LoanProduct(
        tenant_id=tenant_id,
        name=data.name.strip(),
        code=code,
        interest_method=data.interest_method.upper(),
        repayment_frequency=data.repayment_frequency.upper(),
        interest_rate=data.interest_rate,
        min_amount=data.min_amount,
        max_amount=data.max_amount,
        max_term_months=data.max_term_months,
        is_active=True,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def get_loan_products(
    db: Session,
    tenant_id: str,
):
    return (
        db.query(LoanProduct)
        .filter(
            LoanProduct.tenant_id == tenant_id,
        )
        .order_by(LoanProduct.created_at.desc())
        .all()
    )


def get_loan_product(
    db: Session,
    product_id: str,
    tenant_id: str,
):
    return (
        db.query(LoanProduct)
        .filter(
            LoanProduct.id == product_id,
            LoanProduct.tenant_id == tenant_id,
        )
        .first()
    )


def update_loan_product(
    db: Session,
    product_id: str,
    tenant_id: str,
    data,
):
    _validate_product(data)

    product = get_loan_product(
        db=db,
        product_id=product_id,
        tenant_id=tenant_id,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan product not found.",
        )

    code = data.code.strip().upper()

    existing = (
        db.query(LoanProduct)
        .filter(
            LoanProduct.tenant_id == tenant_id,
            LoanProduct.code == code,
            LoanProduct.id != product_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A loan product with this code already exists.",
        )

    product.name = data.name.strip()
    product.code = code
    product.interest_method = data.interest_method.upper()
    product.repayment_frequency = data.repayment_frequency.upper()
    product.interest_rate = data.interest_rate
    product.min_amount = data.min_amount
    product.max_amount = data.max_amount
    product.max_term_months = data.max_term_months

    db.commit()
    db.refresh(product)

    return product


def update_loan_product_status(
    db: Session,
    product_id: str,
    tenant_id: str,
    is_active: bool,
):
    product = get_loan_product(
        db=db,
        product_id=product_id,
        tenant_id=tenant_id,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan product not found.",
        )

    product.is_active = is_active

    db.commit()
    db.refresh(product)

    return product
