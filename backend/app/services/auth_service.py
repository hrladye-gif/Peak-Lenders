from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(user_data):
    return {
        "message": "registration service ready"
    }


def authenticate_user(
    email,
    password
):
    return {
        "email": email,
        "token": create_access_token(
            {
                "sub": email
            }
        )
    }
