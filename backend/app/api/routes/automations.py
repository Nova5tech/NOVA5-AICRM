from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Automation
from app.schemas.domain import AutomationOut, AutomationCreate
from app.automation.engine import AutomationEngine

router = APIRouter(prefix="/automations", tags=["Workflow Automation"])

@router.get("", response_model=List[AutomationOut])
async def list_automations(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Automation).order_by(Automation.created_at.desc()))
    return res.scalars().all()

@router.post("", response_model=AutomationOut)
async def create_automation(rule: AutomationCreate, db: AsyncSession = Depends(get_db)):
    new_rule = Automation(
        id=f"aut_{uuid.uuid4().hex[:8]}",
        name=rule.name,
        trigger=rule.trigger,
        conditions=rule.conditions,
        actions=rule.actions,
        is_active=True,
        total_runs=0
    )
    db.add(new_rule)
    await db.commit()
    await db.refresh(new_rule)
    return new_rule

@router.post("/{automation_id}/trigger-test")
async def trigger_automation_test(automation_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Automation).where(Automation.id == automation_id))
    rule = res.scalars().first()
    if not rule:
        raise HTTPException(status_code=404, detail="Automation not found")

    mock_event = {
        "event_type": rule.trigger,
        "lead_score": 85,
        "sentiment": "Negative",
        "stage": "Proposal"
    }

    logs = AutomationEngine.execute_actions(rule.actions, mock_event)
    rule.total_runs += 1
    await db.commit()

    return {"status": "executed", "rule_id": rule.id, "logs": logs, "total_runs": rule.total_runs}
