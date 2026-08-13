import re
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.tenant import Tenant
from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


def _generate_tenant_code(company_name: str) -> str:
    base = re.sub(r"[^A-Za-z0-9]", "", company_name).upper()

    if not base:
        base = "TENANT"

    base = base[:12]

    return f"{base}-{uuid4().hex[:6].upper()}"


def register_account(
    db: Session,
    company_name: str,
    first_name: str,
    last_name: str,
    email: str,
    password: str,
):
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    tenant = Tenant(
        name=company_name.strip(),
        code=_generate_tenant_code(company_name),
    )

    db.add(tenant)
    db.flush()

    user = User(
        tenant_id=tenant.id,
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        role="admin",
        is_active=True,
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(tenant)
        db.refresh(user)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to create the account because the institution or email already exists.",
        )

    return {
        "message": "Institution registered successfully.",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
        },
        "tenant": {
            "id": tenant.id,
            "name": tenant.name,
            "code": tenant.code,
        },
    }


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email.lower().strip())
        .first()
    )

    if not user or not verify_password(
        password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive. Please contact your administrator.",
        )

    access_token = create_access_token(
        {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id,
        }
    )

    return {
        "token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id,
            "company_name": user.tenant.name if user.tenant else None,
        },
    }
