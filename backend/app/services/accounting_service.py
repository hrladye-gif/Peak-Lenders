from datetime import date

from sqlalchemy.orm import Session

from app.models.journal_entry import JournalEntry

from app.models.journal_line import JournalLine



def create_journal_entry(
    db: Session,
    tenant_id: str,
    reference_no: str,
    description: str,
    lines: list
):

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

            debit=line.get(
                "debit",
                0
            ),

            credit=line.get(
                "credit",
                0
            )

        )


        db.add(journal_line)


    db.commit()

    db.refresh(entry)


    return entry
