from app.db.database import SessionLocal

import app.models

from app.models.account import Account
from app.models.tenant import Tenant


def seed():
    db = SessionLocal()

    try:
        tenant = db.query(Tenant).order_by(Tenant.created_at.asc()).first()

        if not tenant:
            raise Exception("No tenant found")

        accounts = [
            {
                "account_code": "1000",
                "account_name": "Cash",
                "account_type": "ASSET",
            },
            {
                "account_code": "1100",
                "account_name": "Loan Portfolio",
                "account_type": "ASSET",
            },
            {
                "account_code": "4000",
                "account_name": "Interest Income",
                "account_type": "INCOME",
            },
            {
                "account_code": "5000",
                "account_name": "Operating Expenses",
                "account_type": "EXPENSE",
            },
        ]

        for item in accounts:
            exists = (
                db.query(Account)
                .filter(
                    Account.tenant_id == tenant.id,
                    Account.account_code == item["account_code"],
                )
                .first()
            )

            if not exists:
                db.add(
                    Account(
                        tenant_id=tenant.id,
                        account_code=item["account_code"],
                        account_name=item["account_name"],
                        account_type=item["account_type"],
                    )
                )

        db.commit()

        print(
            f"Accounts seeded successfully for tenant "
            f"{tenant.code} ({tenant.name})"
        )

    finally:
        db.close()


if __name__ == "__main__":
    seed()
