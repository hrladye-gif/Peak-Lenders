from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from dateutil.relativedelta import relativedelta


CENT = Decimal("0.01")


def money(value):
    return Decimal(str(value)).quantize(
        CENT,
        rounding=ROUND_HALF_UP,
    )


def generate_flat_schedule(
    principal: float,
    annual_interest_rate: float,
    term_months: int,
    disbursement_date: date,
):
    principal = Decimal(str(principal))
    rate = Decimal(str(annual_interest_rate))

    if principal <= 0:
        raise ValueError("Principal must be greater than zero.")

    if term_months <= 0:
        raise ValueError("Term must be greater than zero.")

    monthly_principal = money(
        principal / Decimal(term_months)
    )

    total_interest = principal * (
        rate / Decimal("100")
    )

    monthly_interest = money(
        total_interest / Decimal(term_months)
    )

    balance = principal
    principal_scheduled = Decimal("0.00")
    interest_scheduled = Decimal("0.00")

    schedule = []

    for installment in range(1, term_months + 1):

        due_date = (
            disbursement_date
            + relativedelta(months=installment)
        )

        # Final installment absorbs rounding differences.
        if installment == term_months:
            principal_due = money(
                principal - principal_scheduled
            )

            interest_due = money(
                total_interest - interest_scheduled
            )
        else:
            principal_due = monthly_principal
            interest_due = monthly_interest

        total_due = money(
            principal_due + interest_due
        )

        balance -= principal_due

        principal_scheduled += principal_due
        interest_scheduled += interest_due

        schedule.append(
            {
                "installment_no": installment,
                "due_date": due_date,
                "principal_due": principal_due,
                "interest_due": interest_due,
                "total_due": total_due,
                "balance_after": money(
                    max(balance, Decimal("0.00"))
                ),
            }
        )

    return schedule


def generate_declining_schedule(
    principal: float,
    annual_interest_rate: float,
    term_months: int,
    disbursement_date: date,
):
    principal = Decimal(str(principal))
    annual_rate = Decimal(str(annual_interest_rate))

    if principal <= 0:
        raise ValueError("Principal must be greater than zero.")

    if term_months <= 0:
        raise ValueError("Term must be greater than zero.")

    monthly_rate = (
        annual_rate
        / Decimal("12")
        / Decimal("100")
    )

    if monthly_rate == 0:
        payment = principal / Decimal(term_months)
    else:
        payment = (
            principal
            * monthly_rate
            * (1 + monthly_rate) ** term_months
        ) / (
            ((1 + monthly_rate) ** term_months) - 1
        )

    rounded_payment = money(payment)

    balance = principal
    principal_scheduled = Decimal("0.00")
    interest_scheduled = Decimal("0.00")

    schedule = []

    for installment in range(1, term_months + 1):

        due_date = (
            disbursement_date
            + relativedelta(months=installment)
        )

        if installment == term_months:
            # Force the final principal component to reconcile
            # exactly to the original loan principal.
            principal_component = money(
                principal - principal_scheduled
            )

            # Preserve the rounded installment payment where
            # possible, with the final installment absorbing
            # accumulated rounding.
            interest = money(
                rounded_payment - principal_component
            )

            if interest < Decimal("0.00"):
                interest = Decimal("0.00")
        else:
            interest = money(
                balance * monthly_rate
            )

            principal_component = money(
                rounded_payment - interest
            )

            # Never allow a rounded installment to exceed
            # the remaining principal.
            remaining_principal = money(
                principal - principal_scheduled
            )

            principal_component = min(
                principal_component,
                remaining_principal,
            )

        total_due = money(
            principal_component + interest
        )

        balance -= principal_component

        principal_scheduled += principal_component
        interest_scheduled += interest

        schedule.append(
            {
                "installment_no": installment,
                "due_date": due_date,
                "principal_due": principal_component,
                "interest_due": interest,
                "total_due": total_due,
                "balance_after": money(
                    max(balance, Decimal("0.00"))
                ),
            }
        )

    return schedule
