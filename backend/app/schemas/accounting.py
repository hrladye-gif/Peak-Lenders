from datetime import date
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class AccountCreate(BaseModel):
    account_code: str = Field(min_length=1, max_length=50)
    account_name: str = Field(min_length=1, max_length=255)
    account_type: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None


class AccountUpdate(BaseModel):
    account_code: str = Field(min_length=1, max_length=50)
    account_name: str = Field(min_length=1, max_length=255)
    account_type: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None


class AccountResponse(BaseModel):
    id: str
    account_code: str
    account_name: str
    account_type: str
    description: Optional[str] = None
    balance: Decimal
    status: str = "Active"

    class Config:
        from_attributes = True


class JournalLineCreate(BaseModel):
    account_id: str
    debit: Decimal = Decimal("0")
    credit: Decimal = Decimal("0")


class JournalEntryCreate(BaseModel):
    entry_date: date
    reference_no: Optional[str] = None
    description: Optional[str] = None
    source_module: str = "MANUAL"
    lines: List[JournalLineCreate]


class JournalLineResponse(BaseModel):
    id: str
    account_id: str
    account_code: str
    account_name: str
    debit: Decimal
    credit: Decimal


class JournalEntryResponse(BaseModel):
    id: str
    entry_date: date
    reference_no: Optional[str]
    description: Optional[str]
    source_module: Optional[str]
    lines: List[JournalLineResponse]


class LedgerResponse(BaseModel):
    id: str
    date: date
    journal_entry_id: str
    reference_no: Optional[str]
    gl_code: str
    gl_name: str
    description: Optional[str]
    debit: Decimal
    credit: Decimal
    running_balance: Decimal
