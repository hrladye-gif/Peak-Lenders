from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.account import Account
from app.models.journal_entry import JournalEntry
from app.models.journal_line import JournalLine
from app.models.user import User
from app.schemas.accounting import (
    AccountCreate,
    AccountResponse,
    JournalEntryCreate,
    JournalEntryResponse,
    JournalLineResponse,
    LedgerResponse,
)

router = APIRouter(
    prefix="/accounting",
    tags=["Accounting"],
)


def calculate_account_balance(
    db: Session,
    account_id: str,
) -> Decimal:
    lines = (
        db.query(JournalLine)
        .filter(JournalLine.account_id == account_id)
        .all()
    )

    debit = sum(
        (Decimal(str(line.debit or 0)) for line in lines),
        Decimal("0"),
    )

    credit = sum(
        (Decimal(str(line.credit or 0)) for line in lines),
        Decimal("0"),
    )

    return debit - credit


@router.get(
    "/accounts",
    response_model=list[AccountResponse],
)
def list_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    accounts = (
        db.query(Account)
        .filter(Account.tenant_id == current_user.tenant_id)
        .order_by(Account.account_code)
        .all()
    )

    return [
        AccountResponse(
            id=account.id,
            account_code=account.account_code,
            account_name=account.account_name,
            account_type=account.account_type,
            balance=calculate_account_balance(db, account.id),
            status="Active",
        )
        for account in accounts
    ]


@router.post(
    "/accounts",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_account(
    data: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(Account)
        .filter(
            Account.tenant_id == current_user.tenant_id,
            Account.account_code == data.account_code,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="An account with this GL code already exists.",
        )

    account = Account(
        tenant_id=current_user.tenant_id,
        account_code=data.account_code,
        account_name=data.account_name,
        account_type=data.account_type,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return AccountResponse(
        id=account.id,
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        balance=Decimal("0"),
        status="Active",
    )


@router.get(
    "/journal",
    response_model=list[JournalEntryResponse],
)
def list_journal_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(JournalEntry)
        .filter(JournalEntry.tenant_id == current_user.tenant_id)
        .order_by(
            JournalEntry.entry_date.desc(),
            JournalEntry.created_at.desc(),
        )
        .all()
    )

    results = []

    for entry in entries:
        lines = []

        for line in entry.lines:
            account = (
                db.query(Account)
                .filter(
                    Account.id == line.account_id,
                    Account.tenant_id == current_user.tenant_id,
                )
                .first()
            )

            if not account:
                continue

            lines.append(
                JournalLineResponse(
                    id=line.id,
                    account_id=account.id,
                    account_code=account.account_code,
                    account_name=account.account_name,
                    debit=Decimal(str(line.debit or 0)),
                    credit=Decimal(str(line.credit or 0)),
                )
            )

        results.append(
            JournalEntryResponse(
                id=entry.id,
                entry_date=entry.entry_date,
                reference_no=entry.reference_no,
                description=entry.description,
                source_module=entry.source_module,
                lines=lines,
            )
        )

    return results


@router.post(
    "/journal",
    response_model=JournalEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_journal_entry(
    data: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not data.lines:
        raise HTTPException(
            status_code=400,
            detail="A journal entry must contain at least two lines.",
        )

    total_debit = sum(
        (line.debit for line in data.lines),
        Decimal("0"),
    )

    total_credit = sum(
        (line.credit for line in data.lines),
        Decimal("0"),
    )

    if total_debit != total_credit:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Journal entry is not balanced. "
                f"Debit={total_debit} Credit={total_credit}"
            ),
        )

    if total_debit <= 0:
        raise HTTPException(
            status_code=400,
            detail="Journal amount must be greater than zero.",
        )

    account_ids = [line.account_id for line in data.lines]

    accounts = (
        db.query(Account)
        .filter(
            Account.tenant_id == current_user.tenant_id,
            Account.id.in_(account_ids),
        )
        .all()
    )

    account_map = {account.id: account for account in accounts}

    if len(account_map) != len(set(account_ids)):
        raise HTTPException(
            status_code=400,
            detail="One or more GL accounts are invalid.",
        )

    for line in data.lines:
        if line.debit < 0 or line.credit < 0:
            raise HTTPException(
                status_code=400,
                detail="Debit and credit amounts cannot be negative.",
            )

        if line.debit > 0 and line.credit > 0:
            raise HTTPException(
                status_code=400,
                detail="A journal line cannot contain both debit and credit.",
            )

        if line.debit == 0 and line.credit == 0:
            raise HTTPException(
                status_code=400,
                detail="Every journal line must contain a debit or credit amount.",
            )

    entry = JournalEntry(
        tenant_id=current_user.tenant_id,
        entry_date=data.entry_date,
        reference_no=data.reference_no,
        description=data.description,
        source_module=data.source_module,
    )

    db.add(entry)
    db.flush()

    response_lines = []

    for line in data.lines:
        account = account_map[line.account_id]

        journal_line = JournalLine(
            journal_entry_id=entry.id,
            account_id=account.id,
            debit=line.debit,
            credit=line.credit,
        )

        db.add(journal_line)
        db.flush()

        response_lines.append(
            JournalLineResponse(
                id=journal_line.id,
                account_id=account.id,
                account_code=account.account_code,
                account_name=account.account_name,
                debit=line.debit,
                credit=line.credit,
            )
        )

    db.commit()
    db.refresh(entry)

    return JournalEntryResponse(
        id=entry.id,
        entry_date=entry.entry_date,
        reference_no=entry.reference_no,
        description=entry.description,
        source_module=entry.source_module,
        lines=response_lines,
    )


@router.get(
    "/ledger",
    response_model=list[LedgerResponse],
)
def general_ledger(
    account_id: str | None = Query(default=None),
    account_code: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(JournalLine)
        .join(
            JournalEntry,
            JournalEntry.id == JournalLine.journal_entry_id,
        )
        .join(
            Account,
            Account.id == JournalLine.account_id,
        )
        .filter(
            JournalEntry.tenant_id == current_user.tenant_id,
            Account.tenant_id == current_user.tenant_id,
        )
    )

    if account_id:
        query = query.filter(Account.id == account_id)

    if account_code:
        query = query.filter(Account.account_code == account_code)

    lines = (
        query
        .order_by(
            JournalEntry.entry_date,
            JournalEntry.created_at,
        )
        .all()
    )

    running_balance = Decimal("0")
    results = []

    for line in lines:
        debit = Decimal(str(line.debit or 0))
        credit = Decimal(str(line.credit or 0))

        running_balance += debit - credit

        entry = line.journal_entry
        account = line.account

        results.append(
            LedgerResponse(
                id=line.id,
                date=entry.entry_date,
                journal_entry_id=entry.id,
                reference_no=entry.reference_no,
                gl_code=account.account_code,
                gl_name=account.account_name,
                description=entry.description,
                debit=debit,
                credit=credit,
                running_balance=running_balance,
            )
        )

    return results
