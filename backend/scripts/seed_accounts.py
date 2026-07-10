from app.db.database import SessionLocal

# Load every model relationship
import app.models

from app.models.account import Account


def seed():

    db = SessionLocal()


    accounts = [

        {
            "account_code": "1000",
            "account_name": "Cash",
            "account_type": "ASSET"
        },

        {
            "account_code": "1100",
            "account_name": "Loan Portfolio",
            "account_type": "ASSET"
        },

        {
            "account_code": "4000",
            "account_name": "Interest Income",
            "account_type": "INCOME"
        },

        {
            "account_code": "5000",
            "account_name": "Operating Expenses",
            "account_type": "EXPENSE"
        }

    ]


    for item in accounts:

        exists = db.query(Account).filter(
            Account.account_code == item["account_code"]
        ).first()


        if not exists:
            db.add(
                Account(**item)
            )


    db.commit()

    db.close()


if __name__ == "__main__":
    seed()
