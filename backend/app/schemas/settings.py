from pydantic import BaseModel, Field


class TenantSettingsCreate(BaseModel):
    org_name: str = Field(min_length=1, max_length=255)
    currency: str = Field(min_length=3, max_length=10)
    timezone: str = Field(min_length=1, max_length=100)
    session_timeout_minutes: int = Field(default=30, ge=5, le=480)
    par_grace_period_days: int = Field(default=3, ge=0, le=365)
    logo: str | None = None


class TenantSettingsUpdate(BaseModel):
    org_name: str | None = Field(default=None, min_length=1, max_length=255)
    currency: str | None = Field(default=None, min_length=3, max_length=10)
    timezone: str | None = Field(default=None, min_length=1, max_length=100)
    session_timeout_minutes: int | None = Field(default=None, ge=5, le=480)
    par_grace_period_days: int | None = Field(default=None, ge=0, le=365)
    logo: str | None = None


class TenantSettingsResponse(BaseModel):
    id: str | None = None
    tenant_id: str
    org_name: str
    currency: str
    timezone: str
    session_timeout_minutes: int
    par_grace_period_days: int
    logo: str | None = None

    class Config:
        from_attributes = True
