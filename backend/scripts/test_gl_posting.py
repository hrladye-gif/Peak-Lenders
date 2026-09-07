from app.db.database import SessionLocal

import app.models

from app.models.tenant import Tenant
from app.models.account import Account

from app.services.general_ledger_service import post_journal_entry


db = SessionLocal()

try:
    tenant = db.query(Tenant).order_by(Tenant.created_at.asc()).first()

    if tenant is None:
        raise RuntimeError("No tenant exists in the database.")

    cash = db.query(Account).filter(
        Account.tenant_id == tenant.id,
        Account.account_code == "1000",
    ).first()

    interest = db.query(Account).filter(
        Account.tenant_id == tenant.id,
        Account.account_code == "4000",
    ).first()

    if cash is None:
        raise RuntimeError(
            f"Cash account 1000 does not exist for tenant {tenant.id}."
        )

    if interest is None:
        raise RuntimeError(
            f"Interest account 4000 does not exist for tenant {tenant.id}."
        )

    tenant_id = tenant.id
    cash_id = cash.id
    interest_id = interest.id

finally:
    db.close()


entry_id = post_journal_entry(
    tenant_id=tenant_id,
    reference_no="TEST-001",
    description="General Ledger Engine Test",
    source_module="TEST",
    lines=[
        {
            "account_id": cash_id,
            "debit": 100,
            "credit": 0,
        },
        {
            "account_id": interest_id,
            "debit": 0,
            "credit": 100,
        },
    ],
)

print("JOURNAL_ENTRY_ID:", entry_id)
print("GENERAL_LEDGER_TEST_SUCCESS")
