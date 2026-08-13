from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import (
    AccountRegister,
    UserLogin,
)

from app.api.dependencies import (
    get_db,
    get_current_user,
)

from app.services.auth_service import (
    register_account,
    authenticate_user,
)

from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: AccountRegister,
    db: Session = Depends(get_db),
):
    return register_account(
        db=db,
        company_name=user.company_name,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=user.password,
    )


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    return authenticate_user(
        db=db,
        email=user.email,
        password=user.password,
    )


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "role": current_user.role,
        "tenant_id": current_user.tenant_id,
        "branch_id": current_user.branch_id,
        "company_name": (
            current_user.tenant.name
            if current_user.tenant
            else None
        ),
        "is_active": current_user.is_active,
    }
