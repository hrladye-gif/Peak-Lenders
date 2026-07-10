from pydantic import BaseModel


class BorrowerCreate(BaseModel):

    tenant_id: str
    branch_id: str | None = None

    borrower_type: str = "INDIVIDUAL"

    first_name: str | None = None
    last_name: str | None = None

    business_name: str | None = None

    phone: str
    email: str | None = None

    national_id: str | None = None

    gender: str | None = None

    address: str | None = None


class BorrowerResponse(BaseModel):

    id: str
    first_name: str | None
    last_name: str | None
    phone: str

    class Config:
        from_attributes = True
