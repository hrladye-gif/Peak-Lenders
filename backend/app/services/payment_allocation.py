from decimal import Decimal


def allocate_payment(
    amount,
    penalty_due,
    interest_due,
    principal_due
):

    remaining = Decimal(str(amount))


    penalty_paid = min(
        remaining,
        Decimal(str(penalty_due))
    )

    remaining -= penalty_paid


    interest_paid = min(
        remaining,
        Decimal(str(interest_due))
    )

    remaining -= interest_paid


    principal_paid = min(
        remaining,
        Decimal(str(principal_due))
    )


    return {

        "penalty_paid": penalty_paid,

        "interest_paid": interest_paid,

        "principal_paid": principal_paid,

        "total_paid":
            penalty_paid +
            interest_paid +
            principal_paid
    }
