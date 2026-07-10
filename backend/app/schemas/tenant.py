from pydantic import BaseModel


class TenantCreate(BaseModel):

    name: str
    code: str


class TenantResponse(BaseModel):

    id: str
    name: str
    code: str

    class Config:
        from_attributes = True
