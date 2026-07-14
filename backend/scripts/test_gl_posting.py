from app.db.database import SessionLocal

import app.models

from app.models.tenant import Tenant
from app.models.account import Account

from app.services.general_ledger_service import post_journal_entry


db = SessionLocal()

tenant = db.query(Tenant).filter(
    Tenant.code == "DEMO"
).first()

cash = db.query(Account).filter(
    Account.tenant_id == tenant.id,
    Account.account_code == "1000"
).first()

interest = db.query(Account).filter(
    Account.tenant_id == tenant.id,
    Account.account_code == "4000"
).first()

db.close()

entry_id = post_journal_entry(
    tenant_id=tenant.id,
    reference_no="TEST-001",
    description="General Ledger Engine Test",
    source_module="TEST",
    lines=[
        {
            "account_id": cash.id,
            "debit": 100,
            "credit": 0
        },
        {
            "account_id": interest.id,
            "debit": 0,
            "credit": 100
        }
    ]
)

print("JOURNAL_ENTRY_ID:", entry_id)
print("GENERAL_LEDGER_TEST_SUCCESS")
