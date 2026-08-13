from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from app.core.security import (
    create_access_token,
    verify_password,
    get_password_hash,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# Temporary authentication store.
# This will be replaced by the real database User/Tenant models
# once the rebuilt backend database layer is connected.
USERS_DB: dict[str, dict] = {}


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RegisterSchema(BaseModel):
    companyName: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    # Optional for future expansion.
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterSchema):
    email = str(user.email).lower().strip()
    company_name = user.companyName.strip()

    if email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    if not company_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company / Institution name is required.",
        )

    USERS_DB[email] = {
        "company_name": company_name,
        "first_name": user.first_name or "Admin",
        "last_name": user.last_name or "User",
        "email": email,
        "hashed_password": get_password_hash(user.password),
        "role": "admin",
        "is_active": True,
    }

    return {
        "message": "Institution registered successfully.",
        "user": {
            "companyName": company_name,
            "first_name": USERS_DB[email]["first_name"],
            "last_name": USERS_DB[email]["last_name"],
            "email": email,
            "role": "admin",
        },
    }


@router.post("/login")
def login(credentials: LoginSchema):
    email = str(credentials.email).lower().strip()

    user = USERS_DB.get(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    if not verify_password(
        credentials.password,
        user["hashed_password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(
        data={
            "sub": user["email"],
            "role": user["role"],
            "companyName": user["company_name"],
        }
    )

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": {
            "companyName": user["company_name"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "role": user["role"],
        },
    }
