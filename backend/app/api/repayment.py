from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.repayment import Repayment
from app.models.loan import Loan
from app.models.borrower import Borrower
from app.models.loan_schedule import LoanSchedule
from app.schemas.repayment import RepaymentCreate
from app.services.repayment_service import process_repayment


router = APIRouter(
    prefix="/repayments",
    tags=["Repayments"],
)


@router.post("/")
def create_payment(
    payment: RepaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = (
        db.query(Loan)
        .filter(
            Loan.id == payment.loan_id,
            Loan.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if not loan:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Loan not found.",
        )

    return process_repayment(
        db=db,
        data=payment,
        tenant_id=current_user.tenant_id,
        received_by=current_user.id,
    )


@router.get("/")
def list_repayments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(
            Repayment,
            Loan,
            Borrower,
            LoanSchedule,
        )
        .join(
            Loan,
            Repayment.loan_id == Loan.id,
        )
        .join(
            Borrower,
            Loan.borrower_id == Borrower.id,
        )
        .outerjoin(
            LoanSchedule,
            Repayment.schedule_id == LoanSchedule.id,
        )
        .filter(
            Loan.tenant_id == current_user.tenant_id,
        )
        .order_by(
            Repayment.payment_date.desc(),
            Repayment.created_at.desc(),
        )
        .all()
    )

    result = []

    for repayment, loan, borrower, schedule in rows:
        borrower_name = (
            f"{borrower.first_name or ''} "
            f"{borrower.last_name or ''}"
        ).strip()

        if borrower.business_name:
            borrower_name = borrower.business_name

        result.append({
            "id": repayment.id,
            "loan_id": loan.id,
            "loan_number": loan.loan_number,
            "borrower_id": borrower.id,
            "borrower": borrower_name,
            "phone": borrower.phone,
            "payment_date": repayment.payment_date,
            "amount": float(repayment.total_paid),
            "principal_paid": float(repayment.principal_paid),
            "interest_paid": float(repayment.interest_paid),
            "penalty_paid": float(repayment.penalty_paid),
            "method": repayment.payment_method,
            "reference": repayment.reference_no,
            "schedule_id": repayment.schedule_id,
            "installment_no": (
                schedule.installment_no
                if schedule
                else None
            ),
            "status": "Posted",
        })

    return result
