from datetime import date
from decimal import Decimal
from collections import defaultdict

from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule
from app.models.repayment import Repayment
from app.models.branch import Branch
from app.models.audit_log import AuditLog
from app.models.user import User


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


def month_label(year, month):
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    return f"{months[month - 1]} {str(year)[2:]}"


def get_dashboard_summary(
    db: Session,
    tenant_id: str,
):
    today = date.today()

    # =========================================================
    # LOANS
    # =========================================================
    loans = (
        db.query(Loan)
        .filter(Loan.tenant_id == tenant_id)
        .all()
    )

    active_statuses = {"ACTIVE", "OVERDUE"}

    active_loans = [
        loan
        for loan in loans
        if str(loan.status or "").upper() in active_statuses
    ]

    total_portfolio = sum(
        (
            Decimal(str(loan.principal or 0))
            for loan in active_loans
        ),
        Decimal("0"),
    )

    total_disbursed = sum(
        (
            Decimal(str(loan.principal or 0))
            for loan in loans
            if str(loan.status or "").upper()
            in {"ACTIVE", "OVERDUE", "CLOSED", "COMPLETED"}
        ),
        Decimal("0"),
    )

    # =========================================================
    # REPAYMENTS
    # =========================================================
    loan_ids = [loan.id for loan in loans]

    repayments = []

    if loan_ids:
        repayments = (
            db.query(Repayment)
            .filter(Repayment.loan_id.in_(loan_ids))
            .all()
        )

    total_recovered = sum(
        (
            Decimal(str(payment.total_paid or 0))
            for payment in repayments
        ),
        Decimal("0"),
    )

    outstanding = max(
        total_disbursed - total_recovered,
        Decimal("0"),
    )

    # =========================================================
    # SCHEDULES
    # =========================================================
    schedules = []

    if loan_ids:
        schedules = (
            db.query(LoanSchedule)
            .filter(LoanSchedule.loan_id.in_(loan_ids))
            .all()
        )

    total_due = sum(
        (
            Decimal(str(item.total_due or 0))
            for item in schedules
        ),
        Decimal("0"),
    )

    total_paid_from_schedule = sum(
        (
            Decimal(str(payment.total_paid or 0))
            for payment in repayments
        ),
        Decimal("0"),
    )

    collection_rate = Decimal("0")

    if total_due > 0:
        collection_rate = (
            total_paid_from_schedule / total_due
        ) * Decimal("100")

    # =========================================================
    # RISK / PAR
    # =========================================================
    overdue_amount = Decimal("0")

    for item in schedules:
        if not item.due_date or item.due_date >= today:
            continue

        paid = sum(
            (
                Decimal(str(payment.total_paid or 0))
                for payment in repayments
                if payment.schedule_id == item.id
            ),
            Decimal("0"),
        )

        arrears = (
            Decimal(str(item.total_due or 0))
            - paid
        )

        if arrears > 0:
            overdue_amount += arrears

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

    # =========================================================
    # LOAN STATUS DISTRIBUTION
    # =========================================================
    status_counts = defaultdict(int)
    status_amounts = defaultdict(Decimal)

    for loan in loans:
        status = str(loan.status or "PENDING").upper()

        status_counts[status] += 1
        status_amounts[status] += Decimal(
            str(loan.principal or 0)
        )

    loan_status = []

    status_order = [
        "PENDING",
        "APPROVED",
        "ACTIVE",
        "OVERDUE",
        "CLOSED",
        "COMPLETED",
        "DEFAULTED",
        "REJECTED",
    ]

    for status in status_order:
        if status_counts.get(status, 0) > 0:
            loan_status.append(
                {
                    "status": status,
                    "count": status_counts[status],
                    "amount": float(status_amounts[status]),
                    "amountFormatted": money(
                        status_amounts[status]
                    ),
                }
            )

    # Include any unexpected statuses in the database.
    for status in sorted(status_counts.keys()):
        if status not in status_order:
            loan_status.append(
                {
                    "status": status,
                    "count": status_counts[status],
                    "amount": float(status_amounts[status]),
                    "amountFormatted": money(
                        status_amounts[status]
                    ),
                }
            )

    # =========================================================
    # BRANCH PERFORMANCE
    # =========================================================
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
                "amountValue": float(branch_amount),
                "activeLoans": len(branch_loans),
            }
        )

    branch_performance.sort(
        key=lambda x: x["amountValue"],
        reverse=True,
    )

    # =========================================================
    # 12-MONTH PORTFOLIO TREND
    # =========================================================
    monthly_disbursed = defaultdict(Decimal)
    monthly_recovered = defaultdict(Decimal)

    for loan in loans:
        if not loan.disbursement_date:
            continue

        if str(loan.status or "").upper() not in {
            "ACTIVE",
            "OVERDUE",
            "CLOSED",
            "COMPLETED",
        }:
            continue

        key = (
            loan.disbursement_date.year,
            loan.disbursement_date.month,
        )

        monthly_disbursed[key] += Decimal(
            str(loan.principal or 0)
        )

    for payment in repayments:
        if not payment.payment_date:
            continue

        key = (
            payment.payment_date.year,
            payment.payment_date.month,
        )

        monthly_recovered[key] += Decimal(
            str(payment.total_paid or 0)
        )

    # Generate the last 12 calendar months.
    trend = []

    year = today.year
    month = today.month

    months = []

    for _ in range(12):
        months.append((year, month))

        month -= 1

        if month == 0:
            month = 12
            year -= 1

    months.reverse()

    for year, month in months:
        key = (year, month)

        trend.append(
            {
                "month": month_label(year, month),
                "disbursed": float(
                    monthly_disbursed.get(
                        key,
                        Decimal("0"),
                    )
                ),
                "recovered": float(
                    monthly_recovered.get(
                        key,
                        Decimal("0"),
                    )
                ),
            }
        )

    # =========================================================
    # RECENT ACTIVITY
    # =========================================================
    audit_logs = (
        db.query(AuditLog)
        .outerjoin(
            User,
            AuditLog.performed_by == User.id,
        )
        .filter(
            AuditLog.entity_id.isnot(None),
            User.tenant_id == tenant_id,
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

    # =========================================================
    # FINAL RESPONSE
    # =========================================================
    return {
        # Numeric values are the source of truth.
        # Currency formatting is handled by the frontend
        # according to the institution's selected currency.
        "totalPortfolio": float(total_portfolio),
        "totalPortfolioFormatted": money(total_portfolio),
        "activeLoans": len(active_loans),
        "collectionRate": f"{collection_rate:.1f}%",
        "riskLevel": risk_level,
        "disbursed": float(total_disbursed),
        "disbursedFormatted": money(total_disbursed),
        "recovered": float(total_recovered),
        "recoveredFormatted": money(total_recovered),
        "outstanding": float(outstanding),
        "outstandingFormatted": money(outstanding),

        "branchPerformance": branch_performance,

        "loanStatus": loan_status,

        "portfolioTrend": trend,

        "recentActivity": recent_activity,

        "risk": {
            "portfolio_outstanding": float(total_portfolio),
            "overdue_amount": float(overdue_amount),
            "par_percentage": round(
                float(par_percentage),
                2,
            ),
        },
    }
