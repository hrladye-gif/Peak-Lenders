from datetime import date

from sqlalchemy.orm import Session

from app.models.loan_schedule import LoanSchedule

from app.models.repayment import Repayment



def get_collection_summary(
    db: Session,
    tenant_id: str
):

    today = date.today()


    schedules = db.query(
        LoanSchedule
    ).filter(
        LoanSchedule.due_date <= today
    ).all()


    total_due = sum(
        x.total_due
        for x in schedules
    )


    overdue = [
        x for x in schedules
        if x.total_paid < x.total_due
    ]


    overdue_amount = sum(
        x.total_due - x.total_paid
        for x in overdue
    )


    payments = db.query(
        Repayment
    ).all()


    total_paid = sum(
        x.total_paid
        for x in payments
    )


    return {

        "total_due": total_due,

        "total_paid": total_paid,

        "overdue_amount": overdue_amount,

        "overdue_count": len(overdue)

    }
