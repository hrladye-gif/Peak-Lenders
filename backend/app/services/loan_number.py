from sqlalchemy.orm import Session

from app.models.loan import Loan


def generate_loan_number(db: Session) -> str:
    existing_numbers = (
        db.query(Loan.loan_number)
        .filter(Loan.loan_number.like("LN%"))
        .all()
    )

    highest_number = 0

    for (loan_number,) in existing_numbers:
        if not loan_number:
            continue

        value = loan_number[2:]

        if value.isdigit():
            highest_number = max(
                highest_number,
                int(value),
            )

    return f"LN{highest_number + 1:04d}"
