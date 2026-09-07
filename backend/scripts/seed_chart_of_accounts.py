from app.db.database import SessionLocal
from app.models.account import Account
from app.models.tenant import Tenant


DEFAULT_ACCOUNTS = [
    # ASSETS
    ("1000", "Cash on Hand", "Asset"),
    ("1100", "Loans Receivable", "Asset"),
    ("1200", "Mobile Money", "Asset"),
    ("1300", "Bank Account", "Asset"),
    ("1400", "Interest Receivable", "Asset"),

    # LIABILITIES
    ("2000", "Customer Savings", "Liability"),
    ("2100", "Other Payables", "Liability"),

    # EQUITY
    ("3000", "Institutional Capital", "Equity"),
    ("3100", "Retained Earnings", "Equity"),

    # INCOME
    ("4000", "Interest Income", "Income"),
    ("4100", "Fees & Commissions", "Income"),
    ("4200", "Penalty Income", "Income"),
    ("4300", "Other Income", "Income"),

    # EXPENSES
    ("5000", "Operating Expenses", "Expense"),
    ("5100", "Loan Loss Provision", "Expense"),
    ("5200", "Loan Write-off Expense", "Expense"),
]


def main():
    db = SessionLocal()

    try:
        tenants = db.query(Tenant).all()

        print("\n==========================================")
        print("      PEAK LENDERS CHART OF ACCOUNTS")
        print("==========================================")

        for tenant in tenants:
            print(f"\nTenant: {getattr(tenant, 'name', tenant.id)}")
            print(f"ID: {tenant.id}")

            created = 0
            existing = 0

            for code, name, account_type in DEFAULT_ACCOUNTS:
                account = (
                    db.query(Account)
                    .filter(
                        Account.tenant_id == tenant.id,
                        Account.account_code == code,
                    )
                    .first()
                )

                if account:
                    existing += 1
                    print(f"  EXISTS   {code}  {account.account_name}")
                    continue

                account = Account(
                    tenant_id=tenant.id,
                    account_code=code,
                    account_name=name,
                    account_type=account_type,
                )

                db.add(account)
                created += 1

                print(f"  CREATED  {code}  {name}")

            db.flush()

            print(
                f"  --> {created} created, "
                f"{existing} already existed"
            )

        db.commit()

        print("\n==========================================")
        print("CHART OF ACCOUNTS SEEDING COMPLETE")
        print("==========================================")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()
