from sqlalchemy.orm import Session

from app.models.tenant import Tenant


def create_tenant(
    db: Session,
    data
):

    tenant = Tenant(
        name=data.name,
        code=data.code
    )

    db.add(tenant)

    db.commit()

    db.refresh(tenant)

    return tenant


def get_tenant_by_code(
    db: Session,
    code: str
):

    return db.query(Tenant)\
        .filter(
            Tenant.code == code
        )\
        .first()
