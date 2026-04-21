from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, computed_field
from app.priority import calculate_priority_score

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



class TaskCreate (BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Title must be between 1 and 200 characters")
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    importance: int = Field(default=3, ge=1, le=5, description="1-5, default 3")
    effort: int = Field(default=3, ge=1, le=5, description="1-5, default 3")
    
class TaskUpdate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Title must be between 1 and 200 characters")
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    importance: Optional[int] = Field(None, ge=1, le=5)
    effort: Optional[int] = Field(None, ge=1, le=5)
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    importance: int
    effort: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def priority_score(self) -> float:
        if self.due_date is None:
            return 0.0
        
        return calculate_priority_score(self.due_date, self.importance, self.effort)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


