from decimal import Decimal, ROUND_HALF_UP


CENT = Decimal("0.01")


def money(value) -> Decimal:
    return Decimal(str(value or 0)).quantize(
        CENT,
        rounding=ROUND_HALF_UP,
    )


def allocate_payment(
    amount,
    penalty_due,
    interest_due,
    principal_due,
    total_due=None,
):
    amount = money(amount)
    penalty_due = money(penalty_due)
    interest_due = money(interest_due)
    principal_due = money(principal_due)

    if amount <= Decimal("0.00"):
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    if penalty_due < 0:
        raise ValueError("Penalty outstanding cannot be negative.")

    if interest_due < 0:
        raise ValueError("Interest outstanding cannot be negative.")

    if principal_due < 0:
        raise ValueError("Principal outstanding cannot be negative.")

    component_outstanding = money(
        penalty_due
        + interest_due
        + principal_due
    )

    if total_due is not None:
        total_due = money(total_due)

        if total_due < 0:
            raise ValueError("Total outstanding cannot be negative.")

        # The schedule's total must exactly equal its components.
        if total_due != component_outstanding:
            raise ValueError(
                "Schedule balance is inconsistent with its "
                "principal, interest, and penalty balances."
            )

        outstanding = total_due
    else:
        outstanding = component_outstanding

    if amount > outstanding:
        difference = money(amount - outstanding)

        raise ValueError(
            f"Payment amount exceeds outstanding balance "
            f"by {difference:.2f}."
        )

    remaining = amount

    penalty_paid = min(remaining, penalty_due)
    remaining = money(remaining - penalty_paid)

    interest_paid = min(remaining, interest_due)
    remaining = money(remaining - interest_paid)

    principal_paid = min(remaining, principal_due)
    remaining = money(remaining - principal_paid)

    total_paid = money(
        penalty_paid
        + interest_paid
        + principal_paid
    )

    # There must never be an unexplained remainder.
    if remaining != Decimal("0.00"):
        raise ValueError(
            f"Payment could not be fully allocated. "
            f"Unallocated amount: {remaining:.2f}."
        )

    return {
        "penalty_paid": penalty_paid,
        "interest_paid": interest_paid,
        "principal_paid": principal_paid,
        "total_paid": total_paid,
        "unallocated": remaining,
    }
