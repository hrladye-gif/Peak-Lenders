from pydantic import BaseModel


class BranchCreate(BaseModel):
    tenant_id: str
    name: str
    code: str
    address: str | None = None


class BranchUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    address: str | None = None


class BranchResponse(BaseModel):
    id: str
    name: str
    code: str
    address: str | None = None
    is_active: bool

    class Config:
        from_attributes = True
