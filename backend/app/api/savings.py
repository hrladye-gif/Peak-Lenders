from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional
import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.user import User
from app.models.borrower import Borrower
from app.models.branch import Branch
from app.models.account import Account
from app.models.audit_log import AuditLog

from app.models.savings_product import SavingsProduct
from app.models.savings_account import SavingsAccount
from app.models.savings_transaction import SavingsTransaction

from app.services.accounting_service import (
    post_savings_deposit,
    post_savings_withdrawal,
)


router = APIRouter(
    prefix="/savings",
    tags=["Savings & Deposits"],
)


CENT = Decimal("0.01")

ALLOWED_PRODUCT_TYPES = {
    "VOLUNTARY",
    "COMPULSORY",
    "FIXED",
    "NOTICE",
    "CURRENT",
}

ALLOWED_INTEREST_FREQUENCIES = {
    "NONE",
    "DAILY",
    "MONTHLY",
    "QUARTERLY",
    "ANNUALLY",
}

ALLOWED_ACCOUNT_TYPES = {
    "VOLUNTARY_SAVINGS",
    "COMPULSORY_SHARE",
    "FIXED_DEPOSIT",
    "NOTICE_SAVINGS",
    "CURRENT_ACCOUNT",
}

ALLOWED_PAYMENT_METHODS = {
    "CASH",
    "MTN",
    "AIRTEL",
    "MOBILE_MONEY",
    "BANK",
    "BANK_TRANSFER",
}

ALLOWED_ACCOUNT_STATUSES = {
    "ACTIVE",
    "CLOSED",
    "SUSPENDED",
}


def _money(value) -> Decimal:
    return Decimal(str(value or 0)).quantize(
        CENT,
        rounding=ROUND_HALF_UP,
    )


def _clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None

    value = str(value).strip()

    return value or None


def _require_admin(current_user: User):
    if str(current_user.role or "").lower() not in {
        "admin",
        "administrator",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )


def _normalise_payment_method(value: Optional[str]) -> str:
    method = str(value or "CASH").strip().upper()

    aliases = {
        "CASH TELLER": "CASH",
        "MTN MOBILE MONEY": "MTN",
        "MTN MOBILE MONEY PAYOUT": "MTN",
        "AIRTEL MONEY": "AIRTEL",
        "AIRTEL MONEY PAYOUT": "AIRTEL",
        "BANK TRANSFER": "BANK",
    }

    method = aliases.get(method, method)

    if method == "MOBILE_MONEY":
        method = "MTN"

    if method == "BANK_TRANSFER":
        method = "BANK"

    if method not in {
        "CASH",
        "MTN",
        "AIRTEL",
        "BANK",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid payment method. "
                "Use CASH, MTN, AIRTEL, or BANK."
            ),
        )

    return method


def _effective_opening_minimum(product: SavingsProduct) -> Decimal:
    configured = _money(product.opening_minimum_balance)

    # Existing products may have been created before the new field existed.
    if configured == Decimal("0.00"):
        return _money(product.minimum_balance)

    return configured


def _generate_account_number() -> str:
    return f"SAV-{uuid.uuid4().hex[:12].upper()}"


def _get_account_id(
    db: Session,
    tenant_id: str,
    account_code: str,
):
    account = (
        db.query(Account)
        .filter(
            Account.tenant_id == tenant_id,
            Account.account_code == account_code,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"Required accounting account "
                f"{account_code} is missing."
            ),
        )

    return account.id


def _write_audit(
    db: Session,
    entity_type: str,
    entity_id: str,
    action: str,
    performed_by: Optional[str],
    details: dict,
):
    db.add(
        AuditLog(
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            performed_by=performed_by,
            details=json.dumps(details, default=str),
        )
    )


def _get_product(
    db: Session,
    product_id: str,
    current_user: User,
):
    product = (
        db.query(SavingsProduct)
        .filter(
            SavingsProduct.id == product_id,
            SavingsProduct.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings product not found.",
        )

    return product


def _get_account(
    db: Session,
    account_id: str,
    current_user: User,
    *,
    for_update: bool = False,
):
    query = (
        db.query(SavingsAccount)
        .filter(
            SavingsAccount.id == account_id,
            SavingsAccount.tenant_id == current_user.tenant_id,
        )
    )

    if for_update:
        query = query.with_for_update()

    account = query.first()

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings account not found.",
        )

    return account


def _get_transaction(
    db: Session,
    transaction_id: str,
    current_user: User,
):
    transaction = (
        db.query(SavingsTransaction)
        .join(
            SavingsAccount,
            SavingsAccount.id
            == SavingsTransaction.savings_account_id,
        )
        .filter(
            SavingsTransaction.id == transaction_id,
            SavingsAccount.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings transaction not found.",
        )

    return transaction


# ============================================================
# SCHEMAS
# ============================================================

class SavingsProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    code: str = Field(min_length=1, max_length=100)
    interest_rate: Decimal = Decimal("0.00")
    minimum_balance: Decimal = Decimal("0.00")

    product_type: str = "VOLUNTARY"
    interest_frequency: str = "NONE"

    opening_minimum_balance: Optional[Decimal] = None
    withdrawal_minimum_balance: Decimal = Decimal("0.00")

    allow_withdrawals: bool = True
    allow_deposits: bool = True

    is_active: bool = True


class SavingsProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    interest_rate: Optional[Decimal] = None
    minimum_balance: Optional[Decimal] = None

    product_type: Optional[str] = None
    interest_frequency: Optional[str] = None

    opening_minimum_balance: Optional[Decimal] = None
    withdrawal_minimum_balance: Optional[Decimal] = None

    allow_withdrawals: Optional[bool] = None
    allow_deposits: Optional[bool] = None


class SavingsAccountCreate(BaseModel):
    borrower_id: str
    product_id: str

    # Kept optional for backward compatibility.
    account_number: Optional[str] = None

    account_type: str = "VOLUNTARY_SAVINGS"
    initial_deposit: Decimal = Decimal("0.00")
    payment_method: str = "CASH"

    opening_date: Optional[date] = None
    branch_id: Optional[str] = None
    notes: Optional[str] = None


class SavingsAccountClose(BaseModel):
    closure_reason: str = Field(min_length=1, max_length=500)


class SavingsTransactionCreate(BaseModel):
    savings_account_id: str
    amount: Decimal

    payment_method: str = "CASH"
    reference_no: Optional[str] = None
    effective_date: Optional[date] = None
    notes: Optional[str] = None


class SavingsTransactionReverse(BaseModel):
    reversal_reason: str = Field(min_length=1, max_length=1000)
    reference_no: Optional[str] = None


# ============================================================
# PRODUCTS
# ============================================================

@router.get("/products")
def list_savings_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    products = (
        db.query(SavingsProduct)
        .filter(
            SavingsProduct.tenant_id == current_user.tenant_id
        )
        .order_by(SavingsProduct.name.asc())
        .all()
    )

    return [
        {
            "id": product.id,
            "name": product.name,
            "code": product.code,
            "interest_rate": str(
                _money(product.interest_rate)
            ),
            "minimum_balance": str(
                _money(product.minimum_balance)
            ),
            "opening_minimum_balance": str(
                _effective_opening_minimum(product)
            ),
            "withdrawal_minimum_balance": str(
                _money(product.withdrawal_minimum_balance)
            ),
            "product_type": product.product_type,
            "interest_frequency": product.interest_frequency,
            "allow_withdrawals": bool(
                product.allow_withdrawals
            ),
            "allow_deposits": bool(
                product.allow_deposits
            ),
            "is_active": bool(product.is_active),
        }
        for product in products
    ]


@router.post(
    "/products",
    status_code=status.HTTP_201_CREATED,
)
def create_savings_product(
    data: SavingsProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    name = _clean_text(data.name)
    code = _clean_text(data.code)

    if not name or not code:
        raise HTTPException(
            status_code=400,
            detail="Product name and code are required.",
        )

    product_type = str(data.product_type).strip().upper()
    interest_frequency = (
        str(data.interest_frequency).strip().upper()
    )

    if product_type not in ALLOWED_PRODUCT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid savings product type.",
        )

    if interest_frequency not in ALLOWED_INTEREST_FREQUENCIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid interest frequency.",
        )

    interest_rate = _money(data.interest_rate)
    minimum_balance = _money(data.minimum_balance)

    opening_minimum = (
        minimum_balance
        if data.opening_minimum_balance is None
        else _money(data.opening_minimum_balance)
    )

    withdrawal_minimum = _money(
        data.withdrawal_minimum_balance
    )

    if interest_rate < 0:
        raise HTTPException(
            status_code=400,
            detail="Interest rate cannot be negative.",
        )

    if minimum_balance < 0:
        raise HTTPException(
            status_code=400,
            detail="Minimum balance cannot be negative.",
        )

    if opening_minimum < 0 or withdrawal_minimum < 0:
        raise HTTPException(
            status_code=400,
            detail="Minimum balances cannot be negative.",
        )

    existing = (
        db.query(SavingsProduct)
        .filter(
            SavingsProduct.tenant_id == current_user.tenant_id,
            SavingsProduct.code == code,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Savings product code already exists.",
        )

    product = SavingsProduct(
        tenant_id=current_user.tenant_id,
        name=name,
        code=code,
        interest_rate=interest_rate,
        minimum_balance=minimum_balance,
        opening_minimum_balance=opening_minimum,
        withdrawal_minimum_balance=withdrawal_minimum,
        product_type=product_type,
        interest_frequency=interest_frequency,
        allow_withdrawals=data.allow_withdrawals,
        allow_deposits=data.allow_deposits,
        is_active=data.is_active,
    )

    db.add(product)

    try:
        # Flush assigns the product ID without committing the transaction.
        # The product and its audit record are therefore committed atomically.
        db.flush()

        _write_audit(
            db,
            "SavingsProduct",
            product.id,
            "CREATE",
            current_user.id,
            {
                "code": product.code,
                "name": product.name,
            },
        )

        db.commit()
        db.refresh(product)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Savings product code already exists.",
        )

    except Exception:
        db.rollback()
        raise

    return product


@router.put("/products/{product_id}")
def update_savings_product(
    product_id: str,
    data: SavingsProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    product = _get_product(
        db,
        product_id,
        current_user,
    )

    if data.name is not None:
        product.name = _clean_text(data.name)

    if data.interest_rate is not None:
        value = _money(data.interest_rate)

        if value < 0:
            raise HTTPException(
                status_code=400,
                detail="Interest rate cannot be negative.",
            )

        product.interest_rate = value

    if data.minimum_balance is not None:
        value = _money(data.minimum_balance)

        if value < 0:
            raise HTTPException(
                status_code=400,
                detail="Minimum balance cannot be negative.",
            )

        product.minimum_balance = value

        if data.opening_minimum_balance is None:
            product.opening_minimum_balance = value

    if data.product_type is not None:
        value = str(data.product_type).strip().upper()

        if value not in ALLOWED_PRODUCT_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Invalid savings product type.",
            )

        product.product_type = value

    if data.interest_frequency is not None:
        value = str(
            data.interest_frequency
        ).strip().upper()

        if value not in ALLOWED_INTEREST_FREQUENCIES:
            raise HTTPException(
                status_code=400,
                detail="Invalid interest frequency.",
            )

        product.interest_frequency = value

    if data.opening_minimum_balance is not None:
        value = _money(data.opening_minimum_balance)

        if value < 0:
            raise HTTPException(
                status_code=400,
                detail="Opening minimum balance cannot be negative.",
            )

        product.opening_minimum_balance = value

    if data.withdrawal_minimum_balance is not None:
        value = _money(data.withdrawal_minimum_balance)

        if value < 0:
            raise HTTPException(
                status_code=400,
                detail="Withdrawal minimum balance cannot be negative.",
            )

        product.withdrawal_minimum_balance = value

    if data.allow_withdrawals is not None:
        product.allow_withdrawals = data.allow_withdrawals

    if data.allow_deposits is not None:
        product.allow_deposits = data.allow_deposits

    _write_audit(
        db,
        "SavingsProduct",
        product.id,
        "UPDATE",
        current_user.id,
        {
            "code": product.code,
        },
    )

    try:
        db.commit()
        db.refresh(product)
    except Exception:
        db.rollback()
        raise

    return product


@router.post("/products/{product_id}/deactivate")
def deactivate_savings_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    product = _get_product(
        db,
        product_id,
        current_user,
    )

    product.is_active = False

    _write_audit(
        db,
        "SavingsProduct",
        product.id,
        "DEACTIVATE",
        current_user.id,
        {
            "code": product.code,
        },
    )

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "status": "deactivated",
        "product_id": product.id,
    }


# ============================================================
# ACCOUNTS
# ============================================================

@router.get("/accounts")
def list_savings_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(
            SavingsAccount,
            Borrower,
            SavingsProduct,
        )
        .join(
            Borrower,
            Borrower.id == SavingsAccount.borrower_id,
        )
        .join(
            SavingsProduct,
            SavingsProduct.id == SavingsAccount.product_id,
        )
        .filter(
            SavingsAccount.tenant_id
            == current_user.tenant_id,
        )
        .order_by(
            SavingsAccount.created_at.desc()
        )
        .all()
    )

    results = []

    for account, borrower, product in rows:
        borrower_name = "Unknown"

        if borrower:
            if borrower.business_name:
                borrower_name = borrower.business_name
            else:
                borrower_name = (
                    f"{borrower.first_name} "
                    f"{borrower.last_name}"
                ).strip()

        results.append(
            {
                "id": account.id,
                "account_number": account.account_number,
                "borrower_id": account.borrower_id,
                "borrower_name": borrower_name,
                "product_id": account.product_id,
                "product_name": product.name,
                "product_code": product.code,
                "account_type": account.account_type,
                "current_balance": str(
                    _money(account.current_balance)
                ),
                "status": account.status,
                "opening_date": (
                    account.opening_date.isoformat()
                    if account.opening_date
                    else None
                ),
                "closing_date": (
                    account.closing_date.isoformat()
                    if account.closing_date
                    else None
                ),
                "closure_reason": account.closure_reason,
                "last_transaction_at": (
                    account.last_transaction_at.isoformat()
                    if account.last_transaction_at
                    else None
                ),
                "branch_id": account.branch_id,
            }
        )

    return results


@router.post(
    "/accounts",
    status_code=status.HTTP_201_CREATED,
)
def create_savings_account(
    data: SavingsAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    initial_deposit = _money(data.initial_deposit)

    if initial_deposit < 0:
        raise HTTPException(
            status_code=400,
            detail="Initial deposit cannot be negative.",
        )

    account_type = str(
        data.account_type
    ).strip().upper()

    if account_type not in ALLOWED_ACCOUNT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid savings account type.",
        )

    payment_method = _normalise_payment_method(
        data.payment_method
    )

    borrower = (
        db.query(Borrower)
        .filter(
            Borrower.id == data.borrower_id,
            Borrower.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not borrower:
        raise HTTPException(
            status_code=404,
            detail="Borrower not found.",
        )

    product = _get_product(
        db,
        data.product_id,
        current_user,
    )

    if not product.is_active:
        raise HTTPException(
            status_code=400,
            detail="Savings product is inactive.",
        )

    if not product.allow_deposits and initial_deposit > 0:
        raise HTTPException(
            status_code=400,
            detail="This savings product does not allow deposits.",
        )

    minimum_balance = _effective_opening_minimum(
        product
    )

    if initial_deposit < minimum_balance:
        raise HTTPException(
            status_code=400,
            detail=(
                "Initial deposit must be at least "
                f"{minimum_balance:.2f}."
            ),
        )

    opening_date = (
        data.opening_date
        or date.today()
    )

    if opening_date > date.today():
        raise HTTPException(
            status_code=400,
            detail="Opening date cannot be in the future.",
        )

    branch_id = data.branch_id or current_user.branch_id

    if branch_id:
        branch = (
            db.query(Branch)
            .filter(
                Branch.id == branch_id,
                Branch.tenant_id
                == current_user.tenant_id,
            )
            .first()
        )

        if not branch:
            raise HTTPException(
                status_code=404,
                detail="Branch not found.",
            )

    requested_account_number = _clean_text(
        data.account_number
    )

    if requested_account_number:
        existing = (
            db.query(SavingsAccount)
            .filter(
                SavingsAccount.account_number
                == requested_account_number
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Savings account number already exists.",
            )

        account_number = requested_account_number
    else:
        account_number = _generate_account_number()

    account = SavingsAccount(
        tenant_id=current_user.tenant_id,
        borrower_id=borrower.id,
        product_id=product.id,
        account_number=account_number,
        current_balance=initial_deposit,
        status="ACTIVE",
        account_type=account_type,
        opening_date=opening_date,
        created_by=current_user.id,
        branch_id=branch_id,
    )

    db.add(account)
    db.flush()

    try:
        if initial_deposit > 0:
            reference = f"SAVINGS-OPEN-{account.id}"

            tx = SavingsTransaction(
                savings_account_id=account.id,
                transaction_type="DEPOSIT",
                amount=initial_deposit,
                reference_no=reference,
                payment_method=payment_method,
                effective_date=opening_date,
                initiated_by=current_user.id,
                notes=_clean_text(data.notes),
            )

            db.add(tx)

            post_savings_deposit(
                db=db,
                tenant_id=current_user.tenant_id,
                savings_account_id=account.id,
                amount=initial_deposit,
                payment_method=payment_method,
                reference_no=reference,
            )

            account.last_transaction_at = (
                tx.transaction_time
            )

        _write_audit(
            db,
            "SavingsAccount",
            account.id,
            "OPEN",
            current_user.id,
            {
                "account_number": account.account_number,
                "borrower_id": borrower.id,
                "product_id": product.id,
                "initial_deposit": str(initial_deposit),
            },
        )

        db.commit()
        db.refresh(account)

    except IntegrityError:
        db.rollback()

        # UUID account numbers are generated server-side and
        # collisions are exceptionally unlikely, but safely retry
        # by asking the client to retry rather than risking data loss.
        raise HTTPException(
            status_code=409,
            detail="Savings account number conflict. Please retry.",
        )

    except Exception:
        db.rollback()
        raise

    return account


@router.post("/accounts/{account_id}/close")
def close_savings_account(
    account_id: str,
    data: SavingsAccountClose,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    account = _get_account(
        db,
        account_id,
        current_user,
        for_update=True,
    )

    if account.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="Only active savings accounts can be closed.",
        )

    balance = _money(account.current_balance)

    if balance != Decimal("0.00"):
        raise HTTPException(
            status_code=400,
            detail=(
                "Savings account must have a zero balance "
                "before it can be closed."
            ),
        )

    account.status = "CLOSED"
    account.closing_date = date.today()
    account.closure_reason = _clean_text(
        data.closure_reason
    )
    account.closed_by = current_user.id

    _write_audit(
        db,
        "SavingsAccount",
        account.id,
        "CLOSE",
        current_user.id,
        {
            "account_number": account.account_number,
            "reason": account.closure_reason,
        },
    )

    try:
        db.commit()
        db.refresh(account)
    except Exception:
        db.rollback()
        raise

    return account


# ============================================================
# TRANSACTIONS
# ============================================================

@router.get("/transactions")
def list_transactions(
    tx_type: Optional[str] = None,
    account_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(SavingsTransaction)
        .join(
            SavingsAccount,
            SavingsAccount.id
            == SavingsTransaction.savings_account_id,
        )
        .filter(
            SavingsAccount.tenant_id
            == current_user.tenant_id
        )
    )

    if tx_type:
        query = query.filter(
            SavingsTransaction.transaction_type
            == str(tx_type).strip().upper()
        )

    if account_id:
        query = query.filter(
            SavingsTransaction.savings_account_id
            == account_id
        )

    transactions = (
        query
        .order_by(
            SavingsTransaction.transaction_time.desc()
        )
        .all()
    )

    return [
        {
            "id": tx.id,
            "savings_account_id": tx.savings_account_id,
            "transaction_type": tx.transaction_type,
            "amount": str(_money(tx.amount)),
            "reference_no": tx.reference_no,
            "transaction_time": (
                tx.transaction_time.isoformat()
                if tx.transaction_time
                else None
            ),
            "payment_method": tx.payment_method,
            "effective_date": (
                tx.effective_date.isoformat()
                if tx.effective_date
                else None
            ),
            "initiated_by": tx.initiated_by,
            "reversed_transaction_id": (
                tx.reversed_transaction_id
            ),
            "reversal_reason": tx.reversal_reason,
            "notes": tx.notes,
        }
        for tx in transactions
    ]


# ============================================================
# DEPOSITS
# ============================================================

@router.post(
    "/deposits",
    status_code=status.HTTP_201_CREATED,
)
def create_deposit(
    data: SavingsTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    amount = _money(data.amount)

    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Deposit amount must be greater than zero.",
        )

    payment_method = _normalise_payment_method(
        data.payment_method
    )

    account = _get_account(
        db,
        data.savings_account_id,
        current_user,
        for_update=True,
    )

    if account.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="Savings account is not active.",
        )

    product = _get_product(
        db,
        account.product_id,
        current_user,
    )

    if not product.allow_deposits:
        raise HTTPException(
            status_code=400,
            detail="This savings product does not allow deposits.",
        )

    effective_date = (
        data.effective_date
        or date.today()
    )

    if effective_date > date.today():
        raise HTTPException(
            status_code=400,
            detail="Effective date cannot be in the future.",
        )

    reference = _clean_text(data.reference_no)

    if not reference:
        reference = (
            f"DEP-{uuid.uuid4().hex[:16].upper()}"
        )

    existing = (
        db.query(SavingsTransaction)
        .filter(
            SavingsTransaction.reference_no == reference
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Transaction reference already exists.",
        )

    current_balance = _money(
        account.current_balance
    )

    new_balance = current_balance + amount

    account.current_balance = new_balance
    account.last_transaction_at = None

    tx = SavingsTransaction(
        savings_account_id=account.id,
        transaction_type="DEPOSIT",
        amount=amount,
        reference_no=reference,
        payment_method=payment_method,
        effective_date=effective_date,
        initiated_by=current_user.id,
        notes=_clean_text(data.notes),
    )

    db.add(tx)
    db.flush()

    post_savings_deposit(
        db=db,
        tenant_id=current_user.tenant_id,
        savings_account_id=account.id,
        amount=amount,
        payment_method=payment_method,
        reference_no=reference,
    )

    _write_audit(
        db,
        "SavingsTransaction",
        tx.id,
        "DEPOSIT",
        current_user.id,
        {
            "account_id": account.id,
            "amount": str(amount),
            "payment_method": payment_method,
            "reference_no": reference,
        },
    )

    try:
        db.flush()
        account.last_transaction_at = tx.transaction_time
        db.commit()
        db.refresh(tx)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Transaction reference already exists.",
        )

    except Exception:
        db.rollback()
        raise

    return tx


# ============================================================
# WITHDRAWALS
# ============================================================

@router.post(
    "/withdrawals",
    status_code=status.HTTP_201_CREATED,
)
def create_withdrawal(
    data: SavingsTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    amount = _money(data.amount)

    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Withdrawal amount must be greater than zero.",
        )

    payment_method = _normalise_payment_method(
        data.payment_method
    )

    account = _get_account(
        db,
        data.savings_account_id,
        current_user,
        for_update=True,
    )

    if account.status != "ACTIVE":
        raise HTTPException(
            status_code=400,
            detail="Savings account is not active.",
        )

    product = _get_product(
        db,
        account.product_id,
        current_user,
    )

    if not product.allow_withdrawals:
        raise HTTPException(
            status_code=400,
            detail=(
                "This savings product does not allow withdrawals."
            ),
        )

    current_balance = _money(
        account.current_balance
    )

    if current_balance < amount:
        raise HTTPException(
            status_code=400,
            detail=(
                "Insufficient funds for withdrawal. "
                f"Available balance: {current_balance:.2f}"
            ),
        )

    remaining_balance = (
        current_balance - amount
    )

    withdrawal_minimum = _money(
        product.withdrawal_minimum_balance
    )

    if remaining_balance < withdrawal_minimum:
        raise HTTPException(
            status_code=400,
            detail=(
                "Withdrawal would reduce the account below "
                f"the required minimum balance of "
                f"{withdrawal_minimum:.2f}."
            ),
        )

    effective_date = (
        data.effective_date
        or date.today()
    )

    if effective_date > date.today():
        raise HTTPException(
            status_code=400,
            detail="Effective date cannot be in the future.",
        )

    reference = _clean_text(data.reference_no)

    if not reference:
        reference = (
            f"WDR-{uuid.uuid4().hex[:16].upper()}"
        )

    existing = (
        db.query(SavingsTransaction)
        .filter(
            SavingsTransaction.reference_no == reference
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Transaction reference already exists.",
        )

    account.current_balance = remaining_balance
    account.last_transaction_at = None

    tx = SavingsTransaction(
        savings_account_id=account.id,
        transaction_type="WITHDRAWAL",
        amount=amount,
        reference_no=reference,
        payment_method=payment_method,
        effective_date=effective_date,
        initiated_by=current_user.id,
        notes=_clean_text(data.notes),
    )

    db.add(tx)
    db.flush()

    post_savings_withdrawal(
        db=db,
        tenant_id=current_user.tenant_id,
        savings_account_id=account.id,
        amount=amount,
        payment_method=payment_method,
        reference_no=reference,
    )

    _write_audit(
        db,
        "SavingsTransaction",
        tx.id,
        "WITHDRAWAL",
        current_user.id,
        {
            "account_id": account.id,
            "amount": str(amount),
            "payment_method": payment_method,
            "reference_no": reference,
        },
    )

    try:
        db.flush()
        account.last_transaction_at = tx.transaction_time
        db.commit()
        db.refresh(tx)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Transaction reference already exists.",
        )

    except Exception:
        db.rollback()
        raise

    return tx


# ============================================================
# TRANSACTION REVERSAL
# ============================================================

@router.post(
    "/transactions/{transaction_id}/reverse",
    status_code=status.HTTP_201_CREATED,
)
def reverse_transaction(
    transaction_id: str,
    data: SavingsTransactionReverse,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    original = _get_transaction(
        db,
        transaction_id,
        current_user,
    )

    account = _get_account(
        db,
        original.savings_account_id,
        current_user,
        for_update=True,
    )

    if original.transaction_type not in {
        "DEPOSIT",
        "WITHDRAWAL",
    }:
        raise HTTPException(
            status_code=400,
            detail="Only deposits and withdrawals can be reversed.",
        )

    already_reversed = (
        db.query(SavingsTransaction)
        .filter(
            SavingsTransaction.reversed_transaction_id
            == original.id
        )
        .first()
    )

    if already_reversed:
        raise HTTPException(
            status_code=409,
            detail="This transaction has already been reversed.",
        )

    amount = _money(original.amount)
    current_balance = _money(account.current_balance)

    if original.transaction_type == "DEPOSIT":
        new_balance = current_balance - amount

        if new_balance < 0:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Transaction cannot be reversed because "
                    "the account no longer has sufficient funds."
                ),
            )

        reversal_type = "WITHDRAWAL"

    else:
        new_balance = current_balance + amount
        reversal_type = "DEPOSIT"

    product = _get_product(
        db,
        account.product_id,
        current_user,
    )

    if reversal_type == "WITHDRAWAL":
        minimum = _money(
            product.withdrawal_minimum_balance
        )

        if new_balance < minimum:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Reversal would reduce the account below "
                    f"the required minimum balance of "
                    f"{minimum:.2f}."
                ),
            )

    reference = _clean_text(data.reference_no)

    if not reference:
        reference = (
            f"REV-{original.id[:12].upper()}"
        )

    existing = (
        db.query(SavingsTransaction)
        .filter(
            SavingsTransaction.reference_no == reference
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Reversal reference already exists.",
        )

    account.current_balance = new_balance

    reversal = SavingsTransaction(
        savings_account_id=account.id,
        transaction_type=reversal_type,
        amount=amount,
        reference_no=reference,
        payment_method=original.payment_method,
        effective_date=date.today(),
        initiated_by=current_user.id,
        reversed_transaction_id=original.id,
        reversal_reason=_clean_text(
            data.reversal_reason
        ),
        notes=(
            f"Reversal of transaction "
            f"{original.reference_no or original.id}"
        ),
    )

    db.add(reversal)
    db.flush()

    # Keep the account's transaction timestamp consistent with
    # normal deposits and withdrawals.
    account.last_transaction_at = reversal.transaction_time

    if reversal_type == "DEPOSIT":
        post_savings_deposit(
            db=db,
            tenant_id=current_user.tenant_id,
            savings_account_id=account.id,
            amount=amount,
            payment_method=original.payment_method,
            reference_no=reference,
        )
    else:
        post_savings_withdrawal(
            db=db,
            tenant_id=current_user.tenant_id,
            savings_account_id=account.id,
            amount=amount,
            payment_method=original.payment_method,
            reference_no=reference,
        )

    _write_audit(
        db,
        "SavingsTransaction",
        reversal.id,
        "REVERSE",
        current_user.id,
        {
            "original_transaction_id": original.id,
            "original_reference": original.reference_no,
            "reversal_reference": reference,
            "amount": str(amount),
            "reason": data.reversal_reason,
        },
    )

    try:
        db.commit()
        db.refresh(reversal)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Reversal reference already exists.",
        )

    except Exception:
        db.rollback()
        raise

    return reversal
