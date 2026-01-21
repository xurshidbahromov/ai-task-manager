from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: Optional[bool] = False
    priority: Optional[str] = "Medium"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

from datetime import datetime

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    priority: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
