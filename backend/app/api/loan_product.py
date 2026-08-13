from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.loan_product import (
    LoanProductCreate,
    LoanProductUpdate,
    LoanProductStatusUpdate,
)

from app.crud.loan_product import (
    create_loan_product,
    get_loan_products,
    get_loan_product,
    update_loan_product,
    update_loan_product_status,
)

from app.api.dependencies import get_db, get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/loan-products",
    tags=["Loan Products"],
)


@router.post("")
def create(
    product: LoanProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_loan_product(
        db=db,
        data=product,
        tenant_id=current_user.tenant_id,
    )


@router.get("")
def list_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_loan_products(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get("/{product_id}")
def detail(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = get_loan_product(
        db=db,
        product_id=product_id,
        tenant_id=current_user.tenant_id,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Loan product not found.",
        )

    return product


@router.put("/{product_id}")
def update(
    product_id: str,
    product: LoanProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_loan_product(
        db=db,
        product_id=product_id,
        tenant_id=current_user.tenant_id,
        data=product,
    )


@router.patch("/{product_id}/status")
def update_status(
    product_id: str,
    data: LoanProductStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_loan_product_status(
        db=db,
        product_id=product_id,
        tenant_id=current_user.tenant_id,
        is_active=data.is_active,
    )
