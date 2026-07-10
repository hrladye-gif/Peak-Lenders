from datetime import datetime


def generate_loan_number():

    timestamp = datetime.now()

    return (
        f"LN-{timestamp.year}"
        f"{timestamp.month:02d}"
        f"{timestamp.day:02d}"
        f"-{timestamp.microsecond}"
    )
