from pydantic import BaseModel


class BranchCreate(BaseModel):

    tenant_id: str
    name: str
    code: str
    address: str | None = None


class BranchResponse(BaseModel):

    id: str
    name: str
    code: str

    class Config:
        from_attributes = True
