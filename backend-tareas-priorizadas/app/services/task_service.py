from sqlalchemy.orm import Session
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate
from datetime import datetime


def create_task(db: Session, user_id: int, task_data: TaskCreate) -> Task:

    db_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date,
        importance=task_data.importance,
        effort=task_data.effort
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task_by_id(db: Session, task_id: int, user_id: int) -> Task | None:
    return db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()


def get_user_tasks(db: Session, user_id: int) -> list[Task]:
    return db.query(Task).filter(Task.user_id ==user_id).all()

def get_user_tasks_sorted(db: Session, user_id: int) -> list[Task]:
    from app.priority import sort_tasks_by_priority
    tasks = get_user_tasks(db, user_id)
    return sort_tasks_by_priority(tasks)


def update_task(db: Session, task_id: int, user_id: int, task_data: TaskUpdate) -> Task | None:
    db_task = get_task_by_id(db, task_id, user_id)
    if not db_task:
        return None
    
    
    if task_data.title is not None:
        db_task.title = task_data.title
    if task_data.description is not None:
        db_task.description = task_data.description
    if task_data.due_date is not None:
        db_task.due_date = task_data.due_date
    if task_data.importance is not None:
        db_task.importance = task_data.importance
    if task_data.effort is not None:
        db_task.effort = task_data.effort
    if task_data.completed is not None:
        db_task.completed = task_data.completed

    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, user_id: int) -> bool:
    db_task = get_task_by_id(db, task_id, user_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True

def mark_task_complete(db: Session, task_id: int, user_id: int) -> Task | None:
    db_task = get_task_by_id(db, task_id, user_id)
    if not db_task:
        return None
    
    db_task.completed = True
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task


 
