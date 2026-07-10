from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.user import (
    UserLogin,
    UserCreate
)

from app.crud.user import (
    create_user,
    get_user_by_email
)

from app.api.dependencies import get_db

from app.services.auth_service import (
    authenticate_user
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return create_user(
        db,
        user,
        user.tenant_id
    )


@router.post("/login")
def login(
    user: UserLogin
):

    return authenticate_user(
        user.email,
        user.password
    )
