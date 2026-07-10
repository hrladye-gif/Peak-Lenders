from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password


def create_user(
    db: Session,
    user_data,
    tenant_id: str
):

    user = User(
        tenant_id=tenant_id,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
        role=user_data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(
    db: Session,
    email: str
):

    return db.query(User)\
        .filter(User.email == email)\
        .first()
