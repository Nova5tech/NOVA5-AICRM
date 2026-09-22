from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Lead, Contact, Company
from app.schemas.domain import LeadOut, LeadCreate
from app.ai.engine import AILeadScorer

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("", response_model=List[LeadOut])
async def list_leads(
    status: Optional[str] = None,
    min_score: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Lead)
    if status:
        stmt = stmt.where(Lead.status == status)
    if min_score:
        stmt = stmt.where(Lead.lead_score >= min_score)
    stmt = stmt.order_by(Lead.lead_score.desc())
    
    res = await db.execute(stmt)
    leads = res.scalars().all()
    
    # Load contacts
    for l in leads:
        contact_res = await db.execute(select(Contact).where(Contact.id == l.contact_id))
        l.contact = contact_res.scalars().first()
        if l.contact and l.contact.company_id:
            comp_res = await db.execute(select(Company).where(Company.id == l.contact.company_id))
            l.contact.company = comp_res.scalars().first()
            
    return leads

@router.get("/{lead_id}", response_model=LeadOut)
async def get_lead(lead_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    contact_res = await db.execute(select(Contact).where(Contact.id == lead.contact_id))
    lead.contact = contact_res.scalars().first()
    if lead.contact and lead.contact.company_id:
        comp_res = await db.execute(select(Company).where(Company.id == lead.contact.company_id))
        lead.contact.company = comp_res.scalars().first()
        
    return lead

@router.post("/recalculate-score/{lead_id}")
async def recalculate_lead_score(lead_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = res.scalars().first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    scoring_result = AILeadScorer.score_lead(
        lead_title=lead.title,
        source=lead.source,
        conversation_text="pricing enterprise 100+ seats quote demo",
        company_size="500-1000"
    )
    
    lead.lead_score = scoring_result["score"]
    lead.confidence = scoring_result["confidence"]
    lead.score_breakdown = scoring_result["breakdown"]
    lead.score_explanation = scoring_result["explanation"]
    
    await db.commit()
    await db.refresh(lead)
    return {"status": "success", "lead_score": lead.lead_score, "explanation": lead.score_explanation}
