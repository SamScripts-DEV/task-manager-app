from datetime import datetime, timedelta
from typing import List
from app.models import Task


def calculate_priority_score(
        due_date: datetime | None,
        importance: int,
        effort: int
) -> float:
    
    score = 0.0

    if due_date:
        days_until = (due_date - datetime.utcnow()).days

        if days_until < 0:
            score += 40
        elif days_until == 1:
            score += 35
        elif days_until <= 3:
            score += 25
        elif days_until >= 7:
            score += 15
        elif days_until <= 14:
            score += 5


    score += importance * 6
    score += (6-effort) * 4


    return min(100.0, max(0.0, score))


def sort_tasks_by_priority(tasks: List[Task]) -> List[Task]:
    def get_priority(task: Task) -> float:
        return calculate_priority_score(task.due_date, task.importance, task.effort)
    
    return sorted(tasks, key=get_priority, reverse=True)

