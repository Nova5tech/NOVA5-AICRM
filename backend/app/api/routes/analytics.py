from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.domain import Lead, Deal, Task, Conversation
from app.schemas.domain import OverviewMetrics

router = APIRouter(prefix="/analytics", tags=["Executive Business Analytics"])

@router.get("/overview", response_model=OverviewMetrics)
async def get_overview_metrics(db: AsyncSession = Depends(get_db)):
    leads_res = await db.execute(select(func.count(Lead.id)))
    total_leads = leads_res.scalar() or 0

    qual_res = await db.execute(select(func.count(Lead.id)).where(Lead.status == "Qualified"))
    qualified_leads = qual_res.scalar() or 0

    deals_res = await db.execute(select(Deal))
    deals = deals_res.scalars().all()
    
    active_deals = len([d for d in deals if d.stage not in ["Won", "Lost"]])
    pipeline_val = sum(d.value for d in deals if d.stage not in ["Won", "Lost"])
    won_rev = sum(d.value for d in deals if d.stage == "Won")

    tasks_res = await db.execute(select(func.count(Task.id)).where(Task.status == "Pending"))
    open_tasks = tasks_res.scalar() or 0

    return OverviewMetrics(
        total_leads=total_leads,
        qualified_leads=qualified_leads,
        conversion_rate=round((qualified_leads / max(1, total_leads)) * 100, 1),
        active_deals=active_deals,
        pipeline_value=pipeline_val,
        won_revenue=won_rev,
        open_tasks=open_tasks,
        avg_response_time_min=8
    )

@router.get("/channel-performance")
async def get_channel_performance(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Conversation.channel, func.count(Conversation.id)).group_by(Conversation.channel))
    rows = res.all()
    total = sum(r[1] for r in rows) or 1
    
    performance = []
    for ch, cnt in rows:
        performance.append({
            "channel": ch.capitalize(),
            "conversations": cnt,
            "percentage": round((cnt / total) * 100, 1)
        })
    return performance
