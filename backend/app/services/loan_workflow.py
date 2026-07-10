from datetime import date

from sqlalchemy.orm import Session

from app.models.loan import Loan

from app.services.accounting_service import (
    create_journal_entry
)



def approve_loan(
    db: Session,
    loan_id: str
):

    loan = db.query(Loan)\
        .filter(
            Loan.id == loan_id
        ).first()


    loan.status = "APPROVED"

    db.commit()

    return loan



def disburse_loan(
    db: Session,
    loan_id: str
):

    loan = db.query(Loan)\
        .filter(
            Loan.id == loan_id
        ).first()


    loan.status = "ACTIVE"

    loan.disbursement_date = date.today()


    create_journal_entry(

        db,

        loan.tenant_id,

        loan.loan_number,

        "Loan Disbursement",

        [

            {
                "account_id":"1100",
                "debit":loan.principal
            },

            {
                "account_id":"1000",
                "credit":loan.principal
            }

        ]

    )


    db.commit()


    return loan
