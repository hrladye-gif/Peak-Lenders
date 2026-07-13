from app.db.database import SessionLocal

import app.models

from app.models.account import Account
from app.models.tenant import Tenant


def seed():

    db = SessionLocal()

    tenant = db.query(Tenant).filter(
        Tenant.code == "DEMO"
    ).first()

    if not tenant:
        raise Exception("Default tenant not found")

    accounts = [
        {
            "tenant_id": tenant.id,
            "account_code": "1000",
            "account_name": "Cash",
            "account_type": "ASSET"
        },
        {
            "tenant_id": tenant.id,
            "account_code": "1100",
            "account_name": "Loan Portfolio",
            "account_type": "ASSET"
        },
        {
            "tenant_id": tenant.id,
            "account_code": "4000",
            "account_name": "Interest Income",
            "account_type": "INCOME"
        },
        {
            "tenant_id": tenant.id,
            "account_code": "5000",
            "account_name": "Operating Expenses",
            "account_type": "EXPENSE"
        }
    ]

    for item in accounts:

        exists = db.query(Account).filter(
            Account.tenant_id == tenant.id,
            Account.account_code == item["account_code"]
        ).first()

        if not exists:
            db.add(Account(**item))

    db.commit()
    db.close()

    print("Accounts seeded successfully")


if __name__ == "__main__":
    seed()
