from sqlalchemy.orm import Session

from app.models.branch import Branch


def create_branch(
    db: Session,
    data
):

    branch = Branch(
        tenant_id=data.tenant_id,
        name=data.name,
        code=data.code,
        address=data.address
    )

    db.add(branch)

    db.commit()

    db.refresh(branch)

    return branch


def get_branches(
    db: Session,
    tenant_id: str
):

    return db.query(Branch)\
        .filter(
            Branch.tenant_id == tenant_id
        )\
        .all()
