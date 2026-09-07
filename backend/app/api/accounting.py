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
    AccountUpdate,
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
            description=account.description,
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
        description=data.description,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return AccountResponse(
        id=account.id,
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        description=account.description,
        balance=Decimal("0"),
        status="Active",
    )



@router.get(
    "/accounts/{account_id}",
    response_model=AccountResponse,
)
def get_account(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = (
        db.query(Account)
        .filter(
            Account.id == account_id,
            Account.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="GL account not found.",
        )

    return AccountResponse(
        id=account.id,
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        description=account.description,
        balance=calculate_account_balance(db, account.id),
        status="Active",
    )


@router.put(
    "/accounts/{account_id}",
    response_model=AccountResponse,
)
def update_account(
    account_id: str,
    data: AccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = (
        db.query(Account)
        .filter(
            Account.id == account_id,
            Account.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="GL account not found.",
        )

    duplicate = (
        db.query(Account)
        .filter(
            Account.tenant_id == current_user.tenant_id,
            Account.account_code == data.account_code,
            Account.id != account_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Another account already uses this GL code.",
        )

    account.account_code = data.account_code
    account.account_name = data.account_name
    account.account_type = data.account_type
    account.description = data.description

    db.commit()
    db.refresh(account)

    return AccountResponse(
        id=account.id,
        account_code=account.account_code,
        account_name=account.account_name,
        account_type=account.account_type,
        description=account.description,
        balance=calculate_account_balance(db, account.id),
        status="Active",
    )


@router.delete(
    "/accounts/{account_id}",
)
def delete_account(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = (
        db.query(Account)
        .filter(
            Account.id == account_id,
            Account.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="GL account not found.",
        )

    used = (
        db.query(JournalLine)
        .filter(JournalLine.account_id == account_id)
        .first()
    )

    if used:
        raise HTTPException(
            status_code=409,
            detail="This account has journal transactions and cannot be deleted.",
        )

    db.delete(account)
    db.commit()

    return {
        "message": "GL account deleted successfully.",
        "id": account_id,
    }


@router.get(
    "/accounts/{account_id}/transactions",
    response_model=list[LedgerResponse],
)
def account_transactions(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = (
        db.query(Account)
        .filter(
            Account.id == account_id,
            Account.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="GL account not found.",
        )

    lines = (
        db.query(JournalLine)
        .join(
            JournalEntry,
            JournalEntry.id == JournalLine.journal_entry_id,
        )
        .filter(
            JournalEntry.tenant_id == current_user.tenant_id,
            JournalLine.account_id == account_id,
        )
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


@router.get("/reports/trial-balance")
def trial_balance_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    accounts = (
        db.query(Account)
        .filter(Account.tenant_id == current_user.tenant_id)
        .order_by(Account.account_code)
        .all()
    )

    results = []
    total_debit = Decimal("0")
    total_credit = Decimal("0")

    for account in accounts:
        lines = (
            db.query(JournalLine)
            .join(
                JournalEntry,
                JournalEntry.id == JournalLine.journal_entry_id,
            )
            .filter(
                JournalEntry.tenant_id == current_user.tenant_id,
                JournalLine.account_id == account.id,
            )
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

        total_debit += debit
        total_credit += credit

        results.append({
            "id": account.id,
            "code": account.account_code,
            "account": account.account_name,
            "account_type": account.account_type,
            "debit": debit,
            "credit": credit,
        })

    return {
        "accounts": results,
        "total_debit": total_debit,
        "total_credit": total_credit,
        "balanced": total_debit == total_credit,
    }


@router.get("/reports/par-aging")
def par_aging_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from datetime import date
    from app.models.loan import Loan
    from app.models.loan_schedule import LoanSchedule
    from app.models.repayment import Repayment
    from app.models.borrower import Borrower
    from app.models.loan_product import LoanProduct

    today = date.today()

    schedules = (
        db.query(LoanSchedule)
        .join(Loan, Loan.id == LoanSchedule.loan_id)
        .filter(
            Loan.tenant_id == current_user.tenant_id,
            Loan.status.in_(["ACTIVE", "OVERDUE"]),
            LoanSchedule.due_date < today,
            LoanSchedule.status != "PAID",
        )
        .all()
    )

    rows = []
    total_outstanding = Decimal("0")
    total_overdue = Decimal("0")

    for schedule in schedules:
        loan = db.query(Loan).filter(
            Loan.id == schedule.loan_id
        ).first()

        if not loan:
            continue

        paid_principal = db.query(
            func.coalesce(
                func.sum(Repayment.principal_paid),
                0,
            )
        ).filter(
            Repayment.schedule_id == schedule.id,
            Repayment.loan_id == loan.id,
        ).scalar()

        paid_principal = Decimal(
            str(paid_principal or 0)
        )

        principal_due = Decimal(
            str(schedule.principal_due or 0)
        )

        overdue = max(
            principal_due - paid_principal,
            Decimal("0"),
        )

        if overdue <= 0:
            continue

        days_overdue = max(
            (today - schedule.due_date).days,
            0,
        )

        if days_overdue <= 30:
            band = "PAR 1-30"
        elif days_overdue <= 60:
            band = "PAR 31-60"
        elif days_overdue <= 90:
            band = "PAR 61-90"
        else:
            band = "PAR 90+"

        total_overdue += overdue

        borrower = db.query(Borrower).filter(
            Borrower.id == loan.borrower_id,
            Borrower.tenant_id == current_user.tenant_id,
        ).first()

        product = db.query(LoanProduct).filter(
            LoanProduct.id == loan.loan_product_id,
            LoanProduct.tenant_id == current_user.tenant_id,
        ).first()

        borrower_name = (
            borrower.business_name
            if borrower and borrower.business_name
            else " ".join(
                part for part in [
                    borrower.first_name if borrower else None,
                    borrower.last_name if borrower else None,
                ]
                if part
            )
            if borrower
            else "Unknown borrower"
        )

        rows.append({
            "loan_id": loan.loan_number,
            "schedule_id": schedule.id,
            "borrower_name": borrower_name,
            "product_name": product.name if product else "Unknown product",
            "loan_officer": "Not assigned",
            "due_date": schedule.due_date,
            "outstanding": overdue,
            "overdue": overdue,
            "days_overdue": days_overdue,
            "band": band,
            "status": loan.status,
        })

    portfolio_outstanding = db.query(
        func.coalesce(
            func.sum(LoanSchedule.principal_due),
            0,
        )
    ).join(
        Loan,
        Loan.id == LoanSchedule.loan_id,
    ).filter(
        Loan.tenant_id == current_user.tenant_id,
        Loan.status.in_(["ACTIVE", "OVERDUE"]),
        LoanSchedule.status != "PAID",
    ).scalar()

    portfolio_outstanding = Decimal(
        str(portfolio_outstanding or 0)
    )

    total_outstanding = portfolio_outstanding

    total_active_loans = db.query(
        func.count(Loan.id)
    ).filter(
        Loan.tenant_id == current_user.tenant_id,
        Loan.status.in_(["ACTIVE", "OVERDUE"]),
    ).scalar() or 0

    par30_overdue = sum(
        (
            row["overdue"]
            for row in rows
            if row["days_overdue"] > 30
        ),
        Decimal("0"),
    )

    par30_percentage = (
        par30_overdue / total_outstanding * 100
        if total_outstanding > 0
        else Decimal("0")
    )

    provision_account = db.query(Account).filter(
        Account.tenant_id == current_user.tenant_id,
        Account.account_code == "5100",
    ).first()

    recorded_provision = (
        calculate_account_balance(
            db,
            provision_account.id,
        )
        if provision_account
        else Decimal("0")
    )

    aging_totals = {
        "Current": max(
            total_outstanding - total_overdue,
            Decimal("0"),
        ),
        "PAR 1-30": sum(
            (
                row["overdue"]
                for row in rows
                if row["band"] == "PAR 1-30"
            ),
            Decimal("0"),
        ),
        "PAR 31-60": sum(
            (
                row["overdue"]
                for row in rows
                if row["band"] == "PAR 31-60"
            ),
            Decimal("0"),
        ),
        "PAR 61-90": sum(
            (
                row["overdue"]
                for row in rows
                if row["band"] == "PAR 61-90"
            ),
            Decimal("0"),
        ),
        "PAR 90+": sum(
            (
                row["overdue"]
                for row in rows
                if row["band"] == "PAR 90+"
            ),
            Decimal("0"),
        ),
    }

    return {
        "total_outstanding": total_outstanding,
        "total_overdue": total_overdue,
        "par_percentage": par30_percentage,
        "par30_overdue": par30_overdue,
        "par30_percentage": par30_percentage,
        "recorded_provision": recorded_provision,
        "total_loans": total_active_loans,
        "aging_totals": aging_totals,
        "loans": rows,
    }


@router.get("/reports/financial-statements")
def financial_statements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    accounts = (
        db.query(Account)
        .filter(Account.tenant_id == current_user.tenant_id)
        .all()
    )

    result = {
        "assets": [],
        "liabilities": [],
        "equity": [],
        "income": [],
        "expenses": [],
    }

    totals = {
        "assets": Decimal("0"),
        "liabilities": Decimal("0"),
        "equity": Decimal("0"),
        "income": Decimal("0"),
        "expenses": Decimal("0"),
    }

    for account in accounts:
        raw_balance = calculate_account_balance(
            db,
            account.id,
        )

        key = str(
            account.account_type or ""
        ).lower()

        # Assets and expenses normally carry debit balances.
        # Liabilities, equity, and income normally carry
        # credit balances.
        if key in {"liabilities", "equity", "income"}:
            balance = -raw_balance
        else:
            balance = raw_balance

        item = {
            "code": account.account_code,
            "name": account.account_name,
            "amount": balance,
        }

        if key in result:
            result[key].append(item)
            totals[key] += balance

    result["totals"] = totals

    result["net_income"] = (
        totals["income"] - totals["expenses"]
    )

    result["total_assets"] = totals["assets"]
    result["total_liabilities_equity"] = (
        totals["liabilities"]
        + totals["equity"]
        + result["net_income"]
    )

    return result
