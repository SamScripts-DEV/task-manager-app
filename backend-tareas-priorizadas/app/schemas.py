from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class userResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True



class TaskCreate (BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Title must be between 1 and 200 characters")
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    importance: Optional[int] = Field(None, ge=1, le=5)
    effort: Optional[int] = Field(None, ge=1, le=5)
    
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
    description: Optional[str]
    due_date: Optional[datetime]
    importance: int
    effort: int
    completed: bool
    priority_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


