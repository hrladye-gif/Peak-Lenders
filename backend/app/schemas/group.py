from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class GroupCreate(BaseModel):
    name: str
    location: Optional[str] = None
    branch_id: Optional[str] = None


class GroupMemberCreate(BaseModel):
    borrower_id: str
    role: str = "MEMBER"


class BorrowerSummary(BaseModel):
    id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    business_name: Optional[str] = None
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GroupMemberResponse(BaseModel):
    id: str
    borrower_id: str
    role: str
    borrower: Optional[BorrowerSummary] = None

    model_config = ConfigDict(from_attributes=True)


class GroupResponse(BaseModel):
    id: str
    name: str
    location: Optional[str] = None
    status: str
    tenant_id: str
    branch_id: Optional[str] = None
    members: List[GroupMemberResponse] = []

    model_config = ConfigDict(from_attributes=True)
