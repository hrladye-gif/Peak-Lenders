from datetime import date


from sqlalchemy.orm import Session


from app.models.loan import Loan

from app.models.loan_schedule import LoanSchedule



def calculate_portfolio_risk(
    db: Session,
    tenant_id: str
):

    today = date.today()


    loans = db.query(
        Loan
    ).filter(
        Loan.tenant_id == tenant_id
    ).all()


    outstanding = sum(
        loan.principal
        for loan in loans
        if loan.status in [
            "ACTIVE",
            "OVERDUE"
        ]
    )


    schedules = db.query(
        LoanSchedule
    ).join(
        Loan
    ).filter(
        Loan.tenant_id == tenant_id
    ).all()



    overdue = [

        item for item in schedules

        if item.due_date < today

        and item.total_paid < item.total_due

    ]


    overdue_amount = sum(

        item.total_due - item.total_paid

        for item in overdue

    )


    par = 0


    if outstanding > 0:

        par = (
            overdue_amount /
            outstanding
        ) * 100



    return {

        "portfolio_outstanding": outstanding,

        "overdue_amount": overdue_amount,

        "par_percentage": round(par,2),

        "overdue_loans": len(overdue)

    }
