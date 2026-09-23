from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import Base, engine, SessionLocal
from app.core.seed_data import seed_database
from app.api.routes import dashboard, leads, chat, calling, channels, integrations

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Nova5 AI CRM — Customer Acquisition & Engagement Platform API",
    description="Focused 5-Capability AI Customer Intelligence & Engagement API",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Focused API Routers
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(calling.router, prefix="/api/v1")
app.include_router(channels.router, prefix="/api/v1")
app.include_router(integrations.router, prefix="/api/v1")

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "Nova5 AI CRM",
        "capabilities": ["AI Dashboard", "AI Lead Generation", "AI Chatbot", "AI Calling Agent", "Omnichannel Integration Layer"]
    }
