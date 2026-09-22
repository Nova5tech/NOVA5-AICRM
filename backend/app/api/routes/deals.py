from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Deal, Company, Lead
from app.schemas.domain import DealOut, DealCreate

router = APIRouter(prefix="/deals", tags=["Sales Pipeline & Deals"])

@router.get("", response_model=List[DealOut])
async def list_deals(stage: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Deal)
    if stage:
        stmt = stmt.where(Deal.stage == stage)
    stmt = stmt.order_by(Deal.value.desc())
    
    res = await db.execute(stmt)
    deals = res.scalars().all()
    
    for d in deals:
        if d.company_id:
            comp_res = await db.execute(select(Company).where(Company.id == d.company_id))
            d.company = comp_res.scalars().first()
            
    return deals

@router.get("/{deal_id}", response_model=DealOut)
async def get_deal(deal_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = res.scalars().first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal.company_id:
        comp_res = await db.execute(select(Company).where(Company.id == deal.company_id))
        deal.company = comp_res.scalars().first()
        
    return deal

@router.patch("/{deal_id}/stage")
async def update_deal_stage(deal_id: str, stage: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = res.scalars().first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    deal.stage = stage
    deal.days_in_stage = 1
    deal.updated_at = datetime.utcnow()
    
    # Recalculate probability and AI risk
    if stage == "Won":
        deal.probability = 100
        deal.ai_risk_level = "Low"
        deal.ai_risk_reasons = ["Deal successfully closed and won."]
    elif stage == "Proposal":
        deal.probability = 75
    elif stage == "Demo":
        deal.probability = 50
    elif stage == "Qualified":
        deal.probability = 35
        
    await db.commit()
    await db.refresh(deal)
    return {"status": "success", "deal_id": deal.id, "new_stage": deal.stage, "probability": deal.probability}
