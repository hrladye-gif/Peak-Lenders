from datetime import datetime

from sqlalchemy.orm import Session

from app.models.repayment import Repayment

from app.models.loan_transaction import LoanTransaction

from app.services.payment_allocation import (
    allocate_payment
)



def process_repayment(
    db: Session,
    data
):

    allocation = allocate_payment(
        data.amount,
        0,
        0,
        data.amount
    )


    repayment = Repayment(

        loan_id=data.loan_id,

        payment_date=datetime.strptime(
            data.payment_date,
            "%Y-%m-%d"
        ),

        principal_paid=
            allocation["principal_paid"],

        interest_paid=
            allocation["interest_paid"],

        penalty_paid=
            allocation["penalty_paid"],

        total_paid=
            allocation["total_paid"],

        payment_method=
            data.payment_method,

        reference_no=
            data.reference_no
    )


    transaction = LoanTransaction(

        loan_id=data.loan_id,

        transaction_type="REPAYMENT",

        principal_amount=
            allocation["principal_paid"],

        interest_amount=
            allocation["interest_paid"],

        penalty_amount=
            allocation["penalty_paid"],

        total_amount=
            allocation["total_paid"],

        notes="Repayment allocation"

    )


    db.add(repayment)

    db.add(transaction)

    db.commit()

    db.refresh(repayment)


    return repayment
