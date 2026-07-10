from sqlalchemy.orm import Session

from app.models.loan_schedule import LoanSchedule

from app.models.loan import Loan

from app.services.schedule_generator import (
    generate_flat_schedule,
    generate_declining_schedule
)



def create_schedule(
    db: Session,
    loan_id: str
):

    loan = db.query(Loan)\
        .filter(
            Loan.id == loan_id
        )\
        .first()


    if not loan:
        raise Exception(
            "Loan not found"
        )


    if loan.interest_rate:

        schedule = generate_declining_schedule(
            loan.principal,
            loan.interest_rate,
            int(loan.term_months),
            loan.disbursement_date
        )


    records = []


    for item in schedule:

        record = LoanSchedule(

            loan_id=loan.id,

            installment_no=
                item["installment_no"],

            due_date=
                item["due_date"],

            principal_due=
                item["principal_due"],

            interest_due=
                item["interest_due"],

            total_due=
                item["total_due"],

            balance_after=
                item["balance_after"]

        )


        records.append(record)

        db.add(record)


    db.commit()


    return records
