from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.loan import Loan
from app.models.loan_schedule import LoanSchedule

from app.services.schedule_service import (
    create_schedule
)


router = APIRouter(
    prefix="/schedules",
    tags=["Loan Schedules"]
)


@router.get("/")
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(LoanSchedule, Loan)
        .join(
            Loan,
            Loan.id == LoanSchedule.loan_id,
        )
        .filter(
            Loan.tenant_id == current_user.tenant_id,
        )
        .order_by(
            LoanSchedule.due_date.asc(),
            LoanSchedule.installment_no.asc(),
        )
        .all()
    )

    return [
        {
            "id": schedule.id,
            "loan_id": loan.id,
            "loan_number": loan.loan_number,
            "installment_no": schedule.installment_no,
            "due_date": schedule.due_date,
            "principal_due": float(schedule.principal_due or 0),
            "interest_due": float(schedule.interest_due or 0),
            "total_due": float(schedule.total_due or 0),
            "balance_after": float(schedule.balance_after or 0),
            "status": schedule.status,
        }
        for schedule, loan in rows
    ]


@router.post("/{loan_id}")
def generate(
    loan_id: str,
    db: Session = Depends(get_db)
):

    return create_schedule(
        db,
        loan_id
    )
