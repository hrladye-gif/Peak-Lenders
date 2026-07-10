from sqlalchemy.orm import Session

from app.models.borrower import Borrower


def create_borrower(
    db: Session,
    data
):

    borrower = Borrower(
        tenant_id=data.tenant_id,
        branch_id=data.branch_id,

        borrower_type=data.borrower_type,

        first_name=data.first_name,
        last_name=data.last_name,

        business_name=data.business_name,

        phone=data.phone,
        email=data.email,

        national_id=data.national_id,

        gender=data.gender,

        address=data.address
    )


    db.add(borrower)

    db.commit()

    db.refresh(borrower)

    return borrower



def get_borrowers(
    db: Session,
    tenant_id: str
):

    return db.query(Borrower)\
        .filter(
            Borrower.tenant_id == tenant_id
        )\
        .all()
