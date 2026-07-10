from sqlalchemy.orm import Session

from app.models.loan import Loan

from app.services.loan_number import (
    generate_loan_number
)



def create_loan(
    db: Session,
    data
):

    loan = Loan(

        tenant_id=data.tenant_id,

        branch_id=data.branch_id,

        borrower_id=data.borrower_id,

        loan_product_id=data.loan_product_id,

        loan_number=generate_loan_number(),

        principal=data.principal,

        interest_rate=data.interest_rate,

        term_months=data.term_months,

        status="PENDING"
    )


    db.add(loan)

    db.commit()

    db.refresh(loan)

    return loan



def get_loans(
    db: Session,
    tenant_id: str
):

    return db.query(Loan)\
        .filter(
            Loan.tenant_id == tenant_id
        )\
        .all()
