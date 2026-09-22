from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health & Meta"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_engine": "Active (Local/OpenAI Hybrid)"
    }
