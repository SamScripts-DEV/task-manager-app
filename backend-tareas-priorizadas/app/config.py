from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):

    DATABASE_URL: str = "postgresql://user:password@localhost:5432/tareas_db"

    JWT_SECRET: str = "your_secret_key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()
