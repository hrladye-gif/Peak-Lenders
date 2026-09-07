from sqlalchemy.orm import Session

from app.models.loan_schedule import LoanSchedule
from app.models.loan import Loan
from app.models.loan_product import LoanProduct

from app.services.schedule_generator import (
    generate_flat_schedule,
    generate_declining_schedule,
)


def create_schedule(
    db: Session,
    loan_id: str,
):
    loan = (
        db.query(Loan)
        .filter(Loan.id == loan_id)
        .first()
    )

    if not loan:
        raise Exception("Loan not found")

    existing = (
        db.query(LoanSchedule)
        .filter(
            LoanSchedule.loan_id == loan.id
        )
        .order_by(
            LoanSchedule.installment_no.asc()
        )
        .all()
    )

    if existing:
        return existing

    product = (
        db.query(LoanProduct)
        .filter(
            LoanProduct.id == loan.loan_product_id,
            LoanProduct.tenant_id == loan.tenant_id,
        )
        .first()
    )

    interest_method = (
        product.interest_method.upper()
        if product and product.interest_method
        else "DECLINING"
    )

    if interest_method in (
        "FLAT",
        "FLAT_RATE",
        "FLAT RATE",
    ):
        schedule = generate_flat_schedule(
            loan.principal,
            loan.interest_rate,
            int(loan.term_months),
            loan.disbursement_date,
        )

    else:
        schedule = generate_declining_schedule(
            loan.principal,
            loan.interest_rate,
            int(loan.term_months),
            loan.disbursement_date,
        )

    records = []

    for item in schedule:
        record = LoanSchedule(
            loan_id=loan.id,
            installment_no=item["installment_no"],
            due_date=item["due_date"],
            principal_due=item["principal_due"],
            interest_due=item["interest_due"],
            total_due=item["total_due"],
            balance_after=item["balance_after"],
            status="PENDING",
        )

        records.append(record)
        db.add(record)

    db.flush()

    return records
