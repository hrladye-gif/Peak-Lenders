from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="SACCO & Loan Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comprehensive in-memory database matching your exact sidebar subpages
db = {
    "dashboard": {"totalPortfolio": 45000000, "activeBorrowers": 1240, "totalSavings": 32000000},
    "notifications": [{"id": "1", "message": "New loan application submitted by Robert Musoke", "read": False}],
    "activity_feed": [{"id": "1", "action": "Deposit received", "amount": 250000, "time": "10 mins ago"}],
    "borrowers": [{"id": "1", "name": "Robert Musoke", "type": "Individual", "phone": "+256700000000"}],
    "groups": [{"id": "1", "name": "Kampala Traders Group", "membersCount": 15}],
    "loan_applications": [{"id": "1", "applicant": "Sarah Nalwanga", "amount": 2000000, "status": "Pending"}],
    "loans": [
        {
            "id": "1",
            "loanId": "LN-8801",
            "borrowerName": "Robert Musoke",
            "principal": 5000000,
            "remainingBalance": 2100000,
            "issueDate": "2026-07-01",
            "dueDate": "2027-01-01",
            "status": "Active",
            "interestType": "Reducing Balance",
            "interestRate": 5
        }
    ],
    "repayments": [{"id": "1", "loanId": "LN-8801", "amountPaid": 1000000, "date": "2026-08-01"}],
    "collections": [{"id": "1", "loanId": "LN-8750", "overdueDays": 14, "amountDue": 450000}],
    "write_offs": [],
    "savings_products": [{"id": "1", "name": "Regular Savings", "interestRate": 3.5}],
    "accounts": [{"id": "1", "accountNumber": "SAV-9901", "holder": "Robert Musoke", "balance": 1500000}],
    "deposits": [{"id": "1", "accountNumber": "SAV-9901", "amount": 300000, "date": "2026-08-05"}],
    "withdrawals": [{"id": "1", "accountNumber": "SAV-9901", "amount": 100000, "date": "2026-08-06"}],
    "chart_of_accounts": [{"code": "1000", "name": "Cash and Cash Equivalents", "type": "Asset"}],
    "journal_entries": [{"id": "1", "entry": "JE-001", "description": "Loan disbursement", "amount": 5000000}],
    "general_ledger": [{"id": "1", "account": "1000", "debit": 0, "credit": 5000000}],
    "par_aging": [{"bracket": "1-30 Days", "amount": 1200000}],
    "financial_statements": ["Balance Sheet", "Income Statement", "Cash Flow Statement"],
    "users_roles": [{"id": "1", "name": "Admin User", "role": "Administrator"}],
    "branches": [{"id": "1", "name": "Main Branch - Kampala"}],
    "settings": {"currency": "UGX", "organizationName": "Peak Lenders SACCO"}
}

@app.get("/api/{section}")
def get_section_data(section: str):
    if section in db:
        return db[section]
    raise HTTPException(status_code=404, detail=f"Section '{section}' not found")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "modules": list(db.keys())}
