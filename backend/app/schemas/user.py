from pydantic import BaseModel, field_validator
from typing import Optional
import re

# Email validation regex pattern
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

class UserBase(BaseModel):
    email: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v:
            raise ValueError('Email cannot be empty')
        if not isinstance(v, str):
            raise ValueError('Email must be a string')
        if not EMAIL_PATTERN.match(v):
            raise ValueError('Invalid email format')
        return v.lower().strip()

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    streak: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
