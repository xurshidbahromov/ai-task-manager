from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Create a new task. Protected: Requires valid JWT.
    The task is automatically linked to the authenticated user.
    """
    new_task = Task(**task_data.model_dump(), owner_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for the authenticated user only.
    Sorted by newest first.
    """
    return db.query(Task).filter(Task.owner_id == current_user.id).order_by(Task.created_at.desc()).all()

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific task by ID.
    Access Control: Checks if the task exists AND if it belongs to the current user.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
    return task

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int, 
    task_update: TaskUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Update a task.
    Access Control: Only owners can update their own tasks.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Delete a task.
    Access Control: Only owners can delete their own tasks.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or access denied")
    
    db.delete(task)
    db.commit()
    return None
