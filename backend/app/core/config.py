import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nova5 AI CRM"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration (using aiosqlite by default for seamless zero-setup execution)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./nova5_crm.db")
    
    # Secret Key for JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nova5_secret_key_super_secure_987654321")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI Engine Keys (Optional: works with simulated engine fallback if missing)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    class Config:
        case_sensitive = True

settings = Settings()
