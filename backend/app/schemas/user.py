from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):

    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str
    tenant_id: str


class UserLogin(BaseModel):

    email: EmailStr
    password: str


class UserResponse(BaseModel):

    id: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True
