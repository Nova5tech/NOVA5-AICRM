from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.domain import AILog, ApprovalTask
from app.schemas.domain import AILogOut, ApprovalTaskOut

router = APIRouter(prefix="/ai-governance", tags=["AI Governance, Observability & Approvals"])

@router.get("/logs", response_model=List[AILogOut])
async def list_ai_logs(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AILog).order_by(AILog.timestamp.desc()))
    return res.scalars().all()

@router.get("/metrics")
async def get_ai_governance_metrics(db: AsyncSession = Depends(get_db)):
    total_calls_res = await db.execute(select(func.count(AILog.id)))
    total_calls = total_calls_res.scalar() or 0

    total_cost_res = await db.execute(select(func.sum(AILog.cost_usd)))
    total_cost = total_cost_res.scalar() or 0.0

    avg_latency_res = await db.execute(select(func.avg(AILog.latency_ms)))
    avg_latency = avg_latency_res.scalar() or 0

    return {
        "total_ai_operations": total_calls,
        "total_cost_usd": round(total_cost, 4),
        "avg_latency_ms": round(avg_latency, 1),
        "primary_model": "gpt-4o-mini / gemini-1.5-flash",
        "active_human_approvals_pending": 2
    }

@router.get("/approvals", response_model=List[ApprovalTaskOut])
async def list_pending_approvals(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ApprovalTask).order_by(ApprovalTask.created_at.desc()))
    return res.scalars().all()

@router.post("/approvals/{task_id}/respond")
async def respond_to_approval(task_id: str, action: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ApprovalTask).where(ApprovalTask.id == task_id))
    task = res.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Approval task not found")

    if action in ["Approved", "Rejected"]:
        task.status = action
        await db.commit()
        return {"status": "success", "task_id": task.id, "new_status": task.status}
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'Approved' or 'Rejected'")
