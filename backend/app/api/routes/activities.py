from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Activity, Task
from app.schemas.domain import ActivityOut, TaskOut

router = APIRouter(prefix="/activities", tags=["Activities & Tasks"])

@router.get("/timeline", response_model=List[ActivityOut])
async def get_activity_timeline(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Activity).order_by(Activity.timestamp.desc()))
    return res.scalars().all()

@router.get("/tasks", response_model=List[TaskOut])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Task).order_by(Task.created_at.desc()))
    return res.scalars().all()
