from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment
from app.models.branch import Branch
from app.models.audit_log import AuditLog


def money(value):
    if value is None:
        value = Decimal("0")

    value = Decimal(str(value))

    if value >= Decimal("1000000000"):
        return f"UGX {value / Decimal('1000000000'):.1f}B"

    if value >= Decimal("1000000"):
        return f"UGX {value / Decimal('1000000'):.1f}M"

    if value >= Decimal("1000"):
        return f"UGX {value / Decimal('1000'):.1f}K"

    return f"UGX {value:,.0f}"


def get_dashboard_summary(
    db: Session,
    tenant_id: str,
):
    today = date.today()

    # ---------------------------------------------------------
    # LOANS
    # ---------------------------------------------------------
    loans = (
        db.query(Loan)
        .filter(Loan.tenant_id == tenant_id)
        .all()
    )

    active_loans = [
        loan
        for loan in loans
        if loan.status in ["ACTIVE", "OVERDUE"]
    ]

    total_portfolio = sum(
        (Decimal(str(loan.principal or 0)) for loan in active_loans),
        Decimal("0"),
    )

    total_disbursed = sum(
        (
            Decimal(str(loan.principal or 0))
            for loan in loans
            if loan.status in ["ACTIVE", "OVERDUE", "CLOSED", "COMPLETED"]
        ),
        Decimal("0"),
    )

    # ---------------------------------------------------------
    # REPAYMENTS
    # ---------------------------------------------------------
    loan_ids = [loan.id for loan in loans]

    repayments = []

    if loan_ids:
        repayments = (
            db.query(Repayment)
            .filter(Repayment.loan_id.in_(loan_ids))
            .all()
        )

    total_recovered = sum(
        (Decimal(str(payment.total_paid or 0)) for payment in repayments),
        Decimal("0"),
    )

    outstanding = max(
        total_disbursed - total_recovered,
        Decimal("0"),
    )

    # ---------------------------------------------------------
    # SCHEDULES / COLLECTION RATE
    # ---------------------------------------------------------
    schedules = []

    if loan_ids:
        schedules = (
            db.query(LoanSchedule)
            .filter(LoanSchedule.loan_id.in_(loan_ids))
            .all()
        )

    total_due = sum(
        (Decimal(str(item.total_due or 0)) for item in schedules),
        Decimal("0"),
    )

    total_paid_from_schedule = sum(
        (Decimal(str(item.total_paid or 0)) for item in schedules),
        Decimal("0"),
    )

    collection_rate = Decimal("0")

    if total_due > 0:
        collection_rate = (
            total_paid_from_schedule / total_due
        ) * Decimal("100")

    # ---------------------------------------------------------
    # PORTFOLIO RISK
    # ---------------------------------------------------------
    overdue_amount = Decimal("0")

    for item in schedules:
        if (
            item.due_date
            and item.due_date < today
            and Decimal(str(item.total_paid or 0))
            < Decimal(str(item.total_due or 0))
        ):
            overdue_amount += (
                Decimal(str(item.total_due or 0))
                - Decimal(str(item.total_paid or 0))
            )

    par_percentage = Decimal("0")

    if total_portfolio > 0:
        par_percentage = (
            overdue_amount / total_portfolio
        ) * Decimal("100")

    if par_percentage <= 5:
        risk_level = "Low"
    elif par_percentage <= 10:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # ---------------------------------------------------------
    # BRANCH PERFORMANCE
    # ---------------------------------------------------------
    branches = (
        db.query(Branch)
        .filter(Branch.tenant_id == tenant_id)
        .all()
    )

    branch_performance = []

    for branch in branches:
        branch_loans = [
            loan
            for loan in active_loans
            if loan.branch_id == branch.id
        ]

        branch_amount = sum(
            (
                Decimal(str(loan.principal or 0))
                for loan in branch_loans
            ),
            Decimal("0"),
        )

        branch_performance.append(
            {
                "name": branch.name,
                "amount": money(branch_amount),
            }
        )

    branch_performance.sort(
        key=lambda x: x["amount"],
        reverse=True,
    )

    # ---------------------------------------------------------
    # RECENT ACTIVITY
    # ---------------------------------------------------------
    audit_logs = (
        db.query(AuditLog)
        .filter(
            AuditLog.entity_id.isnot(None)
        )
        .order_by(
            AuditLog.event_time.desc()
        )
        .limit(10)
        .all()
    )

    recent_activity = []

    for log in audit_logs:
        recent_activity.append(
            {
                "id": log.id,
                "user": log.performed_by or "System",
                "action": (
                    log.action
                    or f"{log.entity_type} activity"
                ),
                "time": (
                    log.event_time.isoformat()
                    if log.event_time
                    else None
                ),
            }
        )

    return {
        "totalPortfolio": money(total_portfolio),
        "activeLoans": len(active_loans),
        "collectionRate": f"{collection_rate:.1f}%",
        "riskLevel": risk_level,
        "disbursed": money(total_disbursed),
        "recovered": money(total_recovered),
        "outstanding": money(outstanding),
        "branchPerformance": branch_performance,
        "recentActivity": recent_activity,
        "risk": {
            "portfolio_outstanding": float(total_portfolio),
            "overdue_amount": float(overdue_amount),
            "par_percentage": round(float(par_percentage), 2),
        },
    }
