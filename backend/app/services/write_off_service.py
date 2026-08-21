from datetime import date

from sqlalchemy.orm import Session

from app.models.write_off import WriteOff
from app.models.loan import Loan
from app.models.borrower import Borrower
from app.models.user import User
from app.models.audit_log import AuditLog
from app.models.account import Account

from app.services.accounting_service import create_journal_entry


def get_write_off_summary(
    db: Session,
    tenant_id: str,
):
    rows = (
        db.query(WriteOff)
        .filter(WriteOff.tenant_id == tenant_id)
        .all()
    )

    return {
        "total_cases": len(rows),
        "total_amount": float(
            sum((x.amount or 0 for x in rows), 0)
        ),
        "pending_cases": sum(
            1 for x in rows if x.status == "Pending"
        ),
        "approved_cases": sum(
            1 for x in rows if x.status == "Approved"
        ),
    }


def get_write_offs(
    db: Session,
    tenant_id: str,
):
    rows = (
        db.query(
            WriteOff,
            Loan,
            Borrower,
            User,
        )
        .join(Loan, Loan.id == WriteOff.loan_id)
        .outerjoin(Borrower, Borrower.id == WriteOff.borrower_id)
        .outerjoin(User, User.id == WriteOff.requested_by)
        .filter(WriteOff.tenant_id == tenant_id)
        .order_by(WriteOff.created_at.desc())
        .all()
    )

    results = []

    for write_off, loan, borrower, officer in rows:
        results.append(
            {
                "id": write_off.id,
                "loan": loan.loan_number,
                "borrower": (
                    f"{borrower.first_name or ''} "
                    f"{borrower.last_name or ''}"
                ).strip()
                or borrower.business_name
                or "Unknown",
                "amount": float(write_off.amount or 0),
                "reason": write_off.reason,
                "officer": (
                    f"{officer.first_name or ''} "
                    f"{officer.last_name or ''}"
                ).strip()
                if officer
                else None,
                "status": write_off.status,
                "date": (
                    write_off.write_off_date.isoformat()
                    if write_off.write_off_date
                    else write_off.created_at.date().isoformat()
                ),
            }
        )

    return results


def create_write_off(
    db: Session,
    tenant_id: str,
    user_id: str,
    loan_id: str,
    amount: float,
    reason: str,
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
        raise ValueError("Loan not found.")

    if loan.status == "WRITTEN_OFF":
        raise ValueError("Loan has already been written off.")

    if amount <= 0:
        raise ValueError("Write-off amount must be greater than zero.")

    if not reason.strip():
        raise ValueError("Write-off reason is required.")

    borrower = (
        db.query(Borrower)
        .filter(Borrower.id == loan.borrower_id)
        .first()
    )

    if not borrower:
        raise ValueError("Borrower not found.")

    existing = (
        db.query(WriteOff)
        .filter(
            WriteOff.loan_id == loan.id,
            WriteOff.tenant_id == tenant_id,
            WriteOff.status.in_(["Pending", "Approved"]),
        )
        .first()
    )

    if existing:
        raise ValueError(
            "This loan already has an active write-off case."
        )

    write_off = WriteOff(
        tenant_id=tenant_id,
        loan_id=loan.id,
        borrower_id=loan.borrower_id,
        requested_by=user_id,
        amount=amount,
        reason=reason.strip(),
        status="Pending",
    )

    db.add(write_off)

    db.add(
        AuditLog(
            entity_type="WriteOff",
            entity_id=write_off.id,
            action="CREATE",
            performed_by=user_id,
            details=f"Write-off request created for loan {loan.loan_number}",
        )
    )

    db.commit()
    db.refresh(write_off)

    return write_off


def approve_write_off(
    db: Session,
    tenant_id: str,
    write_off_id: str,
    user_id: str,
):
    write_off = (
        db.query(WriteOff)
        .filter(
            WriteOff.id == write_off_id,
            WriteOff.tenant_id == tenant_id,
        )
        .first()
    )

    if not write_off:
        raise ValueError("Write-off case not found.")

    if write_off.status != "Pending":
        raise ValueError(
            f"Write-off is already {write_off.status}."
        )

    loan = (
        db.query(Loan)
        .filter(
            Loan.id == write_off.loan_id,
            Loan.tenant_id == tenant_id,
        )
        .first()
    )

    if not loan:
        raise ValueError("Loan not found.")

    loan_account = (
        db.query(Account)
        .filter(
            Account.tenant_id == tenant_id,
            Account.account_code == "1100",
        )
        .first()
    )

    expense_account = (
        db.query(Account)
        .filter(
            Account.tenant_id == tenant_id,
            Account.account_code == "5000",
        )
        .first()
    )

    if not loan_account:
        raise ValueError(
            "Loan Portfolio account 1100 was not found."
        )

    if not expense_account:
        raise ValueError(
            "Operating Expenses account 5000 was not found."
        )

    reference = f"WRITE-OFF-{write_off.id}"

    create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=reference,
        description=f"Loan write-off for {loan.loan_number}",
        lines=[
            {
                "account_id": expense_account.id,
                "debit": float(write_off.amount),
                "credit": 0,
            },
            {
                "account_id": loan_account.id,
                "debit": 0,
                "credit": float(write_off.amount),
            },
        ],
    )

    loan.status = "WRITTEN_OFF"

    write_off.status = "Approved"
    write_off.approved_by = user_id
    write_off.write_off_date = date.today()

    db.add(
        AuditLog(
            entity_type="WriteOff",
            entity_id=write_off.id,
            action="APPROVE",
            performed_by=user_id,
            details=(
                f"Write-off approved for loan {loan.loan_number}; "
                f"amount={write_off.amount}; "
                f"journal={reference}"
            ),
        )
    )

    db.commit()
    db.refresh(write_off)

    return write_off
