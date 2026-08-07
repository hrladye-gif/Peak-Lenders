from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.security import create_access_token, verify_password, get_password_hash

router = APIRouter()

# In-memory user database
USERS_DB = {}

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class RegisterSchema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Optional[str] = "admin"

@router.post("/register")
def register(user: RegisterSchema):
    if user.email in USERS_DB:
        raise HTTPException(
            status_code=400, 
            detail="User with this email already exists"
        )
    
    USERS_DB[user.email] = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "role": user.role,
    }
    
    return {
        "message": "User registered successfully",
        "user": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/login")
def login(credentials: LoginSchema):
    user = USERS_DB.get(credentials.email)
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Create JWT Token
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    
    # Returning 'token' directly to match response.data.token in frontend
    return {
        "token": access_token,
        "token_type": "bearer",
        "user": {
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "role": user["role"]
        }
    }
