from decimal import Decimal
from datetime import date

from app.db.database import SessionLocal

from app.models.journal_entry import JournalEntry
from app.models.journal_line import JournalLine


def post_journal_entry(
    tenant_id: str,
    reference_no: str,
    description: str,
    source_module: str,
    lines: list
):
    total_debit = Decimal("0")
    total_credit = Decimal("0")

    for line in lines:
        total_debit += Decimal(str(line.get("debit", 0)))
        total_credit += Decimal(str(line.get("credit", 0)))

    if total_debit != total_credit:
        raise ValueError(
            f"Journal not balanced. Debit={total_debit} Credit={total_credit}"
        )

    db = SessionLocal()

    try:

        entry = JournalEntry(
            tenant_id=tenant_id,
            entry_date=date.today(),
            reference_no=reference_no,
            description=description,
            source_module=source_module
        )

        db.add(entry)
        db.flush()

        for line in lines:

            db.add(
                JournalLine(
                    journal_entry_id=entry.id,
                    account_id=line["account_id"],
                    debit=line.get("debit", 0),
                    credit=line.get("credit", 0)
                )
            )

        db.commit()
        db.refresh(entry)

        return entry.id

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()
