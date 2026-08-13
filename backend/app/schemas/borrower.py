from pydantic import BaseModel, ConfigDict
from typing import Optional

class BorrowerCreate(BaseModel):
    tenant_id: Optional[str] = None
    branch_id: Optional[str] = None
    borrower_type: str = "INDIVIDUAL"
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    business_name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    national_id: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None

class BorrowerResponse(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    business_name: Optional[str] = None
    phone: str
    email: Optional[str] = None
    national_id: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    borrower_type: Optional[str] = None
    tenant_id: Optional[str] = None
    branch_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
