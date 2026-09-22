from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import AIInsight, Lead, Deal, Conversation
from app.schemas.domain import CopilotQueryRequest, CopilotQueryResponse
from app.ai.engine import AICRMToolAgent

router = APIRouter(prefix="/ai", tags=["AI Copilot & Intelligence Feed"])

@router.get("/insights")
async def list_ai_insights(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AIInsight).order_by(AIInsight.impact_score.desc()))
    insights = res.scalars().all()
    return insights

@router.post("/copilot", response_model=CopilotQueryResponse)
async def query_copilot(req: CopilotQueryRequest, db: AsyncSession = Depends(get_db)):
    # Gather DB context
    leads_res = await db.execute(select(Lead))
    deals_res = await db.execute(select(Deal))
    convs_res = await db.execute(select(Conversation))

    leads = [l.__dict__ for l in leads_res.scalars().all()]
    deals = [d.__dict__ for d in deals_res.scalars().all()]
    convs = [c.__dict__ for c in convs_res.scalars().all()]

    db_context = {
        "leads": leads,
        "deals": deals,
        "conversations": convs
    }

    result = AICRMToolAgent.process_query(req.query, db_context)
    return CopilotQueryResponse(
        answer=result["answer"],
        tool_calls=result["tool_calls"],
        data=result["data"]
    )
