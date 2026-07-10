from datetime import datetime

def generate_loan_number(sequence: int):
    year = datetime.now().year
    return f"LN-{year}-{sequence:06d}"
