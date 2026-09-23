from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from app.core.database import get_db
from app.models.domain import CustomerLead, VoiceCall
from app.schemas.domain import VoiceCallResponse
from app.ai.engine import AIEngine

router = APIRouter(prefix="/calling", tags=["AI Calling Agent"])

class InitiateCallRequest(BaseModel):
    customer_lead_id: str
    objective: str = "Lead Qualification"

@router.post("/initiate")
def initiate_ai_call(req: InitiateCallRequest, db: Session = Depends(get_db)):
    """
    Executes outbound AI voice call using CRM context:
    - Verifies eligibility & permissions
    - Generates context-driven call plan
    - Executes speech qualification conversation
    - Logs transcript, intent, sentiment, requirements & objections
    - Updates lead score and CRM record
    """
    lead = db.query(CustomerLead).filter(CustomerLead.id == req.customer_lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead.has_opted_out:
        raise HTTPException(status_code=400, detail="Customer has opted out of outbound automated calls.")

    # Execute AI Voice Call Simulation with lead context
    sim_result = AIEngine.simulate_ai_voice_call(
        lead_name=lead.name,
        company=lead.company or "Enterprise Organization",
        interest=lead.product_interest or "AI CRM Platform",
        current_score=lead.lead_score
    )

    call_id = f"call_{uuid.uuid4().hex[:8]}"
    voice_call = VoiceCall(
        id=call_id,
        customer_lead_id=lead.id,
        objective=req.objective,
        call_status="Completed",
        duration_sec=sim_result["duration_sec"],
        transcript=sim_result["transcript"],
        summary=sim_result["summary"],
        intent=sim_result["intent"],
        sentiment=sim_result["sentiment"],
        qualification_status=sim_result["qualification_status"],
        requirements_extracted=sim_result["requirements"],
        objections_raised=sim_result["objections"],
        recommended_next_step=sim_result["recommended_next_step"],
        lead_score_before=sim_result["lead_score_before"],
        lead_score_after=sim_result["lead_score_after"]
    )

    db.add(voice_call)

    # Update Customer Lead Record with call intelligence
    lead.lead_score = sim_result["lead_score_after"]
    lead.status = "Qualified" if sim_result["qualification_status"] == "Qualified" else lead.status
    lead.requirements = sim_result["requirements"]
    lead.objections = sim_result["objections"]
    lead.recommended_action = sim_result["recommended_next_step"]
    lead.intent = sim_result["intent"]
    lead.sentiment = sim_result["sentiment"]

    db.commit()

    return {
        "call_id": call_id,
        "customer_lead_id": lead.id,
        "lead_name": lead.name,
        "duration_sec": sim_result["duration_sec"],
        "qualification_status": sim_result["qualification_status"],
        "lead_score_before": sim_result["lead_score_before"],
        "lead_score_after": sim_result["lead_score_after"],
        "transcript": sim_result["transcript"],
        "summary": sim_result["summary"],
        "requirements_extracted": sim_result["requirements"],
        "recommended_next_step": sim_result["recommended_next_step"]
    }

@router.get("/history/{customer_lead_id}", response_model=List[VoiceCallResponse])
def get_call_history(customer_lead_id: str, db: Session = Depends(get_db)):
    return db.query(VoiceCall).filter(VoiceCall.customer_lead_id == customer_lead_id).order_by(VoiceCall.timestamp.desc()).all()
