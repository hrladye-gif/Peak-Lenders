from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.savings_product import SavingsProduct
from app.models.savings_account import SavingsAccount
from app.models.savings_transaction import SavingsTransaction
from app.models.borrower import Borrower

router = APIRouter(prefix="/savings", tags=["Savings & Deposits"])

# --- Schemas ---
class SavingsProductCreate(BaseModel):
    name: str
    code: str
    interest_rate: float = 0
    minimum_balance: float = 0
    is_active: bool = True

class SavingsAccountCreate(BaseModel):
    borrower_id: str
    product_id: str
    account_number: str
    initial_deposit: float = 0

class SavingsTransactionCreate(BaseModel):
    savings_account_id: str
    amount: float
    reference_no: Optional[str] = None

# --- Endpoints ---

@router.get("/products")
def list_savings_products(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(SavingsProduct).filter(SavingsProduct.tenant_id == current_user.tenant_id).all()

@router.post("/products", status_code=status.HTTP_201_CREATED)
def create_savings_product(data: SavingsProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = SavingsProduct(
        tenant_id=current_user.tenant_id,
        name=data.name,
        code=data.code,
        interest_rate=data.interest_rate,
        minimum_balance=data.minimum_balance,
        is_active=data.is_active
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/accounts")
def list_savings_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    accounts = db.query(SavingsAccount).filter(SavingsAccount.tenant_id == current_user.tenant_id).all()
    results = []
    for acc in accounts:
        borrower = db.query(Borrower).filter(Borrower.id == acc.borrower_id).first()
        product = db.query(SavingsProduct).filter(SavingsProduct.id == acc.product_id).first()
        results.append({
            "id": acc.id,
            "account_number": acc.account_number,
            "borrower_name": f"{borrower.first_name} {borrower.last_name}" if borrower else "Unknown",
            "product_name": product.name if product else "Unknown",
            "current_balance": float(acc.current_balance or 0),
            "status": acc.status
        })
    return results

@router.post("/accounts", status_code=status.HTTP_201_CREATED)
def create_savings_account(data: SavingsAccountCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = SavingsAccount(
        tenant_id=current_user.tenant_id,
        borrower_id=data.borrower_id,
        product_id=data.product_id,
        account_number=data.account_number,
        current_balance=data.initial_deposit,
        status="ACTIVE"
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    
    if data.initial_deposit > 0:
        tx = SavingsTransaction(
            savings_account_id=account.id,
            transaction_type="DEPOSIT",
            amount=data.initial_deposit,
            reference_no="INIT-DEP"
        )
        db.add(tx)
        db.commit()
        
    return account

@router.get("/transactions")
def list_transactions(tx_type: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(SavingsTransaction).join(SavingsAccount, SavingsAccount.id == SavingsTransaction.savings_account_id).filter(SavingsAccount.tenant_id == current_user.tenant_id)
    if tx_type:
        query = query.filter(SavingsTransaction.transaction_type == tx_type)
    return query.order_by(SavingsTransaction.transaction_time.desc()).all()

@router.post("/deposits", status_code=status.HTTP_201_CREATED)
def create_deposit(data: SavingsTransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = db.query(SavingsAccount).filter(SavingsAccount.id == data.savings_account_id, SavingsAccount.tenant_id == current_user.tenant_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Savings account not found.")
    
    account.current_balance = float(account.current_balance or 0) + data.amount
    tx = SavingsTransaction(
        savings_account_id=account.id,
        transaction_type="DEPOSIT",
        amount=data.amount,
        reference_no=data.reference_no
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.post("/withdrawals", status_code=status.HTTP_201_CREATED)
def create_withdrawal(data: SavingsTransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    account = db.query(SavingsAccount).filter(SavingsAccount.id == data.savings_account_id, SavingsAccount.tenant_id == current_user.tenant_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Savings account not found.")
    
    if float(account.current_balance or 0) < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds for withdrawal.")
    
    account.current_balance = float(account.current_balance or 0) - data.amount
    tx = SavingsTransaction(
        savings_account_id=account.id,
        transaction_type="WITHDRAWAL",
        amount=data.amount,
        reference_no=data.reference_no
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx
