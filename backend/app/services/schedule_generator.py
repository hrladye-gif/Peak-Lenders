from datetime import date
from decimal import Decimal
from dateutil.relativedelta import relativedelta


def generate_flat_schedule(
    principal: float,
    annual_interest_rate: float,
    term_months: int,
    disbursement_date: date
):
    principal = Decimal(str(principal))
    rate = Decimal(str(annual_interest_rate))

    monthly_principal = principal / term_months

    total_interest = principal * (rate / Decimal("100"))

    monthly_interest = total_interest / term_months

    balance = principal

    schedule = []

    for installment in range(1, term_months + 1):

        due_date = disbursement_date + relativedelta(months=installment)

        total_due = monthly_principal + monthly_interest

        balance -= monthly_principal

        schedule.append(
            {
                "installment_no": installment,
                "due_date": due_date,
                "principal_due": round(monthly_principal, 2),
                "interest_due": round(monthly_interest, 2),
                "total_due": round(total_due, 2),
                "balance_after": round(max(balance, 0), 2)
            }
        )

    return schedule


def generate_declining_schedule(
    principal: float,
    annual_interest_rate: float,
    term_months: int,
    disbursement_date: date
):
    principal = Decimal(str(principal))
    annual_rate = Decimal(str(annual_interest_rate))

    monthly_rate = annual_rate / Decimal("12") / Decimal("100")

    payment = (
        principal *
        monthly_rate *
        (1 + monthly_rate) ** term_months
    ) / (
        ((1 + monthly_rate) ** term_months) - 1
    )

    balance = principal

    schedule = []

    for installment in range(1, term_months + 1):

        interest = balance * monthly_rate

        principal_component = payment - interest

        balance -= principal_component

        due_date = disbursement_date + relativedelta(
            months=installment
        )

        schedule.append(
            {
                "installment_no": installment,
                "due_date": due_date,
                "principal_due": round(principal_component, 2),
                "interest_due": round(interest, 2),
                "total_due": round(payment, 2),
                "balance_after": round(max(balance, 0), 2)
            }
        )

    return schedule
