from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.utils.ai_service import categorize_transaction
from sqlalchemy import func

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    trans_data: TransactionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Record a new financial transaction (Income or Expense).
    AI automatically categorizes it based on description.
    """
    category = categorize_transaction(trans_data.description)
    
    new_trans = Transaction(
        amount=trans_data.amount,
        type=trans_data.type,
        description=trans_data.description,
        category=category,
        owner_id=current_user.id
    )
    db.add(new_trans)
    db.commit()
    db.refresh(new_trans)
    return new_trans

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get all transactions for the current user.
    """
    return db.query(Transaction).filter(Transaction.owner_id == current_user.id).order_by(Transaction.created_at.desc()).all()

@router.get("/summary")
def get_finance_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total income, expense, and balance (Legacy: Assumes all in UZS now).
    """
    transactions = db.query(Transaction).filter(Transaction.owner_id == current_user.id).all()
    
    total_income = 0.0
    total_expense = 0.0
    
    for t in transactions:
        if t.type == "income":
            total_income += t.amount
        else:
            total_expense += t.amount
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": total_income - total_expense
    }
