from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Integration
from app.schemas.domain import IntegrationOut

router = APIRouter(prefix="/integrations", tags=["Integrations Marketplace"])

@router.get("", response_model=List[IntegrationOut])
async def list_integrations(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Integration))
    return res.scalars().all()

@router.post("/{integration_id}/toggle")
async def toggle_integration(integration_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Integration).where(Integration.id == integration_id))
    item = res.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Integration not found")

    if item.status == "Connected":
        item.status = "Disconnected"
        item.last_sync = None
    else:
        item.status = "Connected"
        item.last_sync = "Just now"

    await db.commit()
    await db.refresh(item)
    return item
