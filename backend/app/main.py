from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.seed_data import populate_seed_data

from app.api.routes.health import router as health_router
from app.api.routes.leads import router as leads_router
from app.api.routes.conversations import router as conversations_router
from app.api.routes.deals import router as deals_router
from app.api.routes.contacts import router as contacts_router
from app.api.routes.companies import router as companies_router
from app.api.routes.activities import router as activities_router
from app.api.routes.ai import router as ai_router
from app.api.routes.automations import router as automations_router
from app.api.routes.knowledge import router as knowledge_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.integrations import router as integrations_router
from app.api.routes.tickets import router as tickets_router
from app.api.routes.identity import router as identity_router
from app.api.routes.ai_governance import router as ai_governance_router
from app.api.routes.outreach import router as outreach_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Populate Seed Data
    async with AsyncSessionLocal() as session:
        await populate_seed_data(session)
        
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers under API v1
api_prefix = settings.API_V1_STR
app.include_router(health_router, prefix=api_prefix)
app.include_router(leads_router, prefix=api_prefix)
app.include_router(conversations_router, prefix=api_prefix)
app.include_router(deals_router, prefix=api_prefix)
app.include_router(contacts_router, prefix=api_prefix)
app.include_router(companies_router, prefix=api_prefix)
app.include_router(activities_router, prefix=api_prefix)
app.include_router(ai_router, prefix=api_prefix)
app.include_router(automations_router, prefix=api_prefix)
app.include_router(knowledge_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(integrations_router, prefix=api_prefix)
app.include_router(tickets_router, prefix=api_prefix)
app.include_router(identity_router, prefix=api_prefix)
app.include_router(ai_governance_router, prefix=api_prefix)
app.include_router(outreach_router, prefix=api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
