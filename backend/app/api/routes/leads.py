from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.domain import CustomerLead, ChannelInteraction
from app.schemas.domain import CustomerLeadResponse, CustomerLeadCreate
from app.ai.engine import AIEngine

router = APIRouter(prefix="/leads", tags=["AI Lead Generation"])

@router.get("", response_model=List[CustomerLeadResponse])
def list_leads(
    status: Optional[str] = None,
    min_score: Optional[int] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns AI-generated & qualified customer leads with explainable lead scores.
    """
    query = db.query(CustomerLead)
    if status:
        query = query.filter(CustomerLead.status == status)
    if min_score:
        query = query.filter(CustomerLead.lead_score >= min_score)
    if source:
        query = query.filter(CustomerLead.source_channel == source)

    return query.order_by(CustomerLead.lead_score.desc()).all()

@router.get("/{lead_id}", response_model=CustomerLeadResponse)
def get_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = db.query(CustomerLead).filter(CustomerLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.post("/recalculate-score/{lead_id}")
def recalculate_lead_score(lead_id: str, db: Session = Depends(get_db)):
    """
    Recalculates the explainable AI Lead Score using interaction context.
    """
    lead = db.query(CustomerLead).filter(CustomerLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    interactions_count = db.query(ChannelInteraction).filter(ChannelInteraction.customer_lead_id == lead_id).count()

    score_result = AIEngine.calculate_explainable_score(
        intent=lead.intent,
        has_email=bool(lead.email),
        has_phone=bool(lead.phone),
        has_company=bool(lead.company),
        has_demo_request=(lead.intent == "Demo Request"),
        interactions_count=interactions_count
    )

    lead.lead_score = score_result["score"]
    lead.confidence_score = score_result["confidence"]
    lead.score_breakdown = score_result["breakdown"]
    lead.score_explanation = score_result["explanation"]
    lead.recommended_action = score_result["recommended_action"]

    if lead.lead_score >= 80:
        lead.is_ready_for_call = True

    db.commit()
    db.refresh(lead)

    return {
        "id": lead.id,
        "new_score": lead.lead_score,
        "score_breakdown": lead.score_breakdown,
        "explanation": lead.score_explanation,
        "recommended_action": lead.recommended_action
    }

@router.patch("/{lead_id}/status")
def update_lead_status(lead_id: str, status: str = Query(...), db: Session = Depends(get_db)):
    lead = db.query(CustomerLead).filter(CustomerLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.status = status
    db.commit()
    return {"id": lead_id, "status": status}
