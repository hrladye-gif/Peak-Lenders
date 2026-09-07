from decimal import Decimal
from datetime import date

from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.journal_entry import JournalEntry
from app.models.journal_line import JournalLine


def _decimal(value):
    return Decimal(str(value or 0))


def get_account(
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
        raise ValueError(
            f"Accounting account {account_code} does not exist "
            f"for tenant {tenant_id}."
        )

    return account


def get_cash_account_code(payment_method=None):
    """
    Resolve the GL asset account receiving/returning funds.

    1000 = Cash on Hand
    1200 = Mobile Money
    1300 = Bank Account
    """
    method = str(payment_method or "CASH").strip().upper()

    if method in {
        "MOBILE",
        "MOBILE_MONEY",
        "MOBILE MONEY",
        "MOMO",
        "MTN",
        "AIRTEL",
    }:
        return "1200"

    if method in {
        "BANK",
        "BANK_TRANSFER",
        "BANK TRANSFER",
        "TRANSFER",
        "WIRE",
    }:
        return "1300"

    return "1000"


def create_journal_entry(
    db: Session,
    tenant_id: str,
    reference_no: str,
    description: str,
    lines: list,
    source_module: str = "SYSTEM",
    entry_date=None,
):
    total_debit = sum(
        (_decimal(line.get("debit")) for line in lines),
        Decimal("0"),
    )

    total_credit = sum(
        (_decimal(line.get("credit")) for line in lines),
        Decimal("0"),
    )

    if len(lines) < 2:
        raise ValueError(
            "Journal entry must contain at least two lines."
        )

    if total_debit <= 0 and total_credit <= 0:
        raise ValueError("Journal entry cannot be empty.")

    if total_debit != total_credit:
        raise ValueError(
            f"Journal entry is not balanced. "
            f"Debit={total_debit} Credit={total_credit}"
        )

    for line in lines:
        debit = _decimal(line.get("debit"))
        credit = _decimal(line.get("credit"))

        if debit < 0 or credit < 0:
            raise ValueError(
                "Debit and credit amounts cannot be negative."
            )

        if debit > 0 and credit > 0:
            raise ValueError(
                "A journal line cannot contain both debit and credit."
            )

        if debit == 0 and credit == 0:
            raise ValueError(
                "Every journal line must contain a debit or credit amount."
            )

    entry = JournalEntry(
        tenant_id=tenant_id,
        entry_date=entry_date or date.today(),
        reference_no=reference_no,
        description=description,
        source_module=source_module,
    )

    db.add(entry)
    db.flush()

    for line in lines:
        journal_line = JournalLine(
            journal_entry_id=entry.id,
            account_id=line["account_id"],
            debit=_decimal(line.get("debit")),
            credit=_decimal(line.get("credit")),
        )

        db.add(journal_line)

    db.flush()

    return entry


def post_loan_disbursement(
    db: Session,
    tenant_id: str,
    loan_id: str,
    amount,
    payment_method=None,
    reference_no=None,
):
    amount = _decimal(amount)

    if amount <= 0:
        raise ValueError("Loan disbursement must be greater than zero.")

    loan_account = get_account(db, tenant_id, "1100")
    cash_account = get_account(
        db,
        tenant_id,
        get_cash_account_code(payment_method),
    )

    return create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=reference_no or f"LOAN-DISBURSEMENT-{loan_id}",
        description="Loan disbursement",
        source_module="LOANS",
        lines=[
            {
                "account_id": loan_account.id,
                "debit": amount,
                "credit": 0,
            },
            {
                "account_id": cash_account.id,
                "debit": 0,
                "credit": amount,
            },
        ],
    )


def post_loan_repayment(
    db: Session,
    tenant_id: str,
    loan_id: str,
    principal,
    interest,
    penalty,
    payment_method=None,
    reference_no=None,
):
    principal = _decimal(principal)
    interest = _decimal(interest)
    penalty = _decimal(penalty)

    total = principal + interest + penalty

    if total <= 0:
        raise ValueError(
            "Repayment amount must be greater than zero."
        )

    cash_account = get_account(
        db,
        tenant_id,
        get_cash_account_code(payment_method),
    )

    lines = [
        {
            "account_id": cash_account.id,
            "debit": total,
            "credit": 0,
        }
    ]

    if principal > 0:
        loan_account = get_account(
            db,
            tenant_id,
            "1100",
        )

        lines.append({
            "account_id": loan_account.id,
            "debit": 0,
            "credit": principal,
        })

    if interest > 0:
        interest_account = get_account(
            db,
            tenant_id,
            "4000",
        )

        lines.append({
            "account_id": interest_account.id,
            "debit": 0,
            "credit": interest,
        })

    if penalty > 0:
        penalty_account = get_account(
            db,
            tenant_id,
            "4200",
        )

        lines.append({
            "account_id": penalty_account.id,
            "debit": 0,
            "credit": penalty,
        })

    return create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=reference_no or f"LOAN-REPAYMENT-{loan_id}",
        description="Loan repayment",
        source_module="REPAYMENTS",
        lines=lines,
    )


def post_savings_deposit(
    db: Session,
    tenant_id: str,
    savings_account_id: str,
    amount,
    payment_method=None,
    reference_no=None,
):
    amount = _decimal(amount)

    if amount <= 0:
        raise ValueError(
            "Savings deposit must be greater than zero."
        )

    cash_account = get_account(
        db,
        tenant_id,
        get_cash_account_code(payment_method),
    )

    savings_account = get_account(
        db,
        tenant_id,
        "2000",
    )

    return create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=(
            reference_no
            or f"SAVINGS-DEPOSIT-{savings_account_id}"
        ),
        description="Savings deposit",
        source_module="SAVINGS",
        lines=[
            {
                "account_id": cash_account.id,
                "debit": amount,
                "credit": 0,
            },
            {
                "account_id": savings_account.id,
                "debit": 0,
                "credit": amount,
            },
        ],
    )


def post_savings_withdrawal(
    db: Session,
    tenant_id: str,
    savings_account_id: str,
    amount,
    payment_method=None,
    reference_no=None,
):
    amount = _decimal(amount)

    if amount <= 0:
        raise ValueError(
            "Savings withdrawal must be greater than zero."
        )

    cash_account = get_account(
        db,
        tenant_id,
        get_cash_account_code(payment_method),
    )

    savings_account = get_account(
        db,
        tenant_id,
        "2000",
    )

    return create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=(
            reference_no
            or f"SAVINGS-WITHDRAWAL-{savings_account_id}"
        ),
        description="Savings withdrawal",
        source_module="SAVINGS",
        lines=[
            {
                "account_id": savings_account.id,
                "debit": amount,
                "credit": 0,
            },
            {
                "account_id": cash_account.id,
                "debit": 0,
                "credit": amount,
            },
        ],
    )
