from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    amount: float
    currency: str
    type: str
    description: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    category: str
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
