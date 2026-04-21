from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import (
    create_task, get_task_by_id, get_user_tasks_sorted, update_task, delete_task, mark_task_complete
)
from app.auth import get_current_user


router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("", response_model=list[TaskResponse])
def list_tasks(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_tasks_sorted(db, user_id)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_data: TaskCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = create_task(db, user_id, task_data)

    return task

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = get_task_by_id(db, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    task_id: int,
    task_data: TaskUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = update_task(db, task_id, user_id, task_data)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    task_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = delete_task(db, task_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return None

@router.patch("/{task_id}/complete", response_model=TaskResponse)
def complete_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    task = mark_task_complete(db, task_id, user_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task

