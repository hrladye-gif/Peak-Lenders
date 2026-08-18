from datetime import date

from sqlalchemy.orm import Session

from app.models.journal_entry import JournalEntry
from app.models.journal_line import JournalLine
from app.models.account import Account


def create_journal_entry(
    db: Session,
    tenant_id: str,
    reference_no: str,
    description: str,
    lines: list
):

    total_debit = sum(
        line.get("debit", 0)
        for line in lines
    )

    total_credit = sum(
        line.get("credit", 0)
        for line in lines
    )

    if total_debit != total_credit:
        raise ValueError(
            "Journal entry is not balanced"
        )


    entry = JournalEntry(
        tenant_id=tenant_id,
        entry_date=date.today(),
        reference_no=reference_no,
        description=description,
        source_module="LOANS"
    )


    db.add(entry)

    db.flush()


    for line in lines:

        journal_line = JournalLine(
            journal_entry_id=entry.id,
            account_id=line["account_id"],
            debit=line.get("debit", 0),
            credit=line.get("credit", 0)
        )

        db.add(journal_line)


    db.flush()

    return entry



def post_loan_disbursement(
    db: Session,
    tenant_id: str,
    loan_id: str,
    amount: float
):

    loan_account = db.query(Account).filter(
        Account.account_code == "1100",
        Account.tenant_id == tenant_id
    ).first()


    cash_account = db.query(Account).filter(
        Account.account_code == "1000",
        Account.tenant_id == tenant_id
    ).first()


    return create_journal_entry(
        db=db,
        tenant_id=tenant_id,
        reference_no=f"LOAN-DISBURSEMENT-{loan_id}",
        description="Loan disbursement",
        lines=[
            {
                "account_id": loan_account.id,
                "debit": amount,
                "credit": 0
            },
            {
                "account_id": cash_account.id,
                "debit": 0,
                "credit": amount
            }
        ]
    )