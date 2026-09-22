from typing import List, Optional
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Campaign, ConsentRecord, VoiceCallResult, Contact, Lead, Activity, Task
from app.schemas.domain import CampaignOut, CampaignCreate, ConsentRecordOut, VoiceCallResultOut, SimulateVoiceCallRequest

router = APIRouter(prefix="/outreach", tags=["AI Outreach Agent & Voice Calls"])

@router.get("/campaigns", response_model=List[CampaignOut])
async def list_campaigns(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Campaign).order_by(Campaign.created_at.desc()))
    return res.scalars().all()

@router.post("/campaigns", response_model=CampaignOut)
async def create_campaign(camp: CampaignCreate, db: AsyncSession = Depends(get_db)):
    new_camp = Campaign(
        id=f"cmpg_{uuid.uuid4().hex[:8]}",
        name=camp.name,
        audience_filter=camp.audience_filter,
        sequence_steps=camp.sequence_steps,
        max_contacts=camp.max_contacts,
        status="Active",
        total_engaged=0,
        total_qualified=0,
        meetings_booked=0
    )
    db.add(new_camp)
    await db.commit()
    await db.refresh(new_camp)
    return new_camp

@router.post("/voice-call/simulate", response_model=VoiceCallResultOut)
async def simulate_outbound_voice_call(req: SimulateVoiceCallRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Contact).where(Contact.id == req.contact_id))
    contact = res.scalars().first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # Consent Check (TRAI / DND Safety Validator)
    c_res = await db.execute(select(ConsentRecord).where(ConsentRecord.contact_id == req.contact_id))
    consent = c_res.scalars().first()
    if consent and consent.consent_status in ["OptedOut", "DND"]:
        raise HTTPException(status_code=403, detail="Outreach blocked: Contact has Opted Out or registered on TRAI DND list.")

    # Generate Simulated Outbound Voice Dialog Transcript & Results
    transcript = [
        {"speaker": "AI Voice Agent", "text": f"Hello {contact.first_name}! This is Nova5 AI calling on behalf of Aether Dynamics. I noticed your interest in our Enterprise RAG solution. Do you have 2 minutes to discuss your seating requirements?"},
        {"speaker": contact.first_name, "text": "Hi! Yes, we are evaluating AI CRM options for 150 licenses, but we need custom ERP integration."},
        {"speaker": "AI Voice Agent", "text": "Understood! Nova5 AI CRM features pre-built REST connectors and custom vector space isolation for ERP systems. Would a 20-minute live technical walkthrough tomorrow at 11 AM work for your engineering team?"},
        {"speaker": contact.first_name, "text": "That sounds great. Please send the calendar invite."},
        {"speaker": "AI Voice Agent", "text": "Wonderful! The calendar invitation and technical architecture packet have been sent. Have a great day!"}
    ]

    call_result = VoiceCallResult(
        id=f"vcall_{uuid.uuid4().hex[:8]}",
        contact_id=contact.id,
        campaign_id=req.campaign_id,
        call_status="Completed",
        duration_sec=112,
        transcript=transcript,
        summary=f"AI Voice Agent conducted 112s outbound call with {contact.first_name}. Confirmed high purchase intent for 150 enterprise seats and ERP integration.",
        intent="High Purchase Intent",
        sentiment="Positive",
        qualification_status="Qualified",
        requirements="150 Enterprise Licenses, ERP REST Integration",
        objections="Technical ERP compatibility confirmation requested",
        recommended_next_action="Schedule 20-min live technical architecture demo",
        lead_score_before=88,
        lead_score_after=95,
        escalated_to_human=False
    )
    db.add(call_result)

    # Update Lead Score if Lead exists
    lead_res = await db.execute(select(Lead).where(Lead.contact_id == contact.id))
    lead = lead_res.scalars().first()
    if lead:
        lead.lead_score = 95
        lead.next_best_action = "Schedule 20-min live technical architecture demo"

    # Create Activity Log on Customer Timeline
    activity = Activity(
        id=f"act_{uuid.uuid4().hex[:8]}",
        type="Voice Call",
        title=f"Outbound AI Voice Call with {contact.first_name} {contact.last_name}",
        description="Call Status: Completed (112s). Qualification: Qualified. Intent: High Purchase Intent.",
        contact_id=contact.id,
        performed_by="Nova5 AI Voice Agent"
    )
    db.add(activity)

    # Create Follow-up Task
    task = Task(
        id=f"tsk_{uuid.uuid4().hex[:8]}",
        title=f"Conduct Technical ERP Architecture Demo with {contact.first_name}",
        due_date="Tomorrow, 11:00 AM",
        priority="Critical",
        status="Pending",
        contact_id=contact.id,
        is_ai_recommended=True
    )
    db.add(task)

    await db.commit()
    await db.refresh(call_result)
    return call_result

@router.get("/consent", response_model=List[ConsentRecordOut])
async def list_consent_records(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ConsentRecord))
    return res.scalars().all()

@router.post("/consent/{contact_id}/toggle")
async def toggle_consent_status(contact_id: str, status: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ConsentRecord).where(ConsentRecord.contact_id == contact_id))
    rec = res.scalars().first()
    if not rec:
        rec = ConsentRecord(
            id=f"cns_{uuid.uuid4().hex[:8]}",
            contact_id=contact_id,
            channel="VoiceCall",
            consent_status=status
        )
        db.add(rec)
    else:
        rec.consent_status = status
    await db.commit()
    return {"status": "success", "contact_id": contact_id, "new_consent_status": status}

@router.get("/analytics")
async def get_outreach_analytics(db: AsyncSession = Depends(get_db)):
    return {
        "emails_sent": 1420,
        "email_delivery_rate": "99.4%",
        "email_open_rate": "48.2%",
        "email_reply_rate": "21.6%",
        "voice_calls_attempted": 340,
        "voice_calls_connected": 286,
        "voice_qualification_rate": "78.5%",
        "meetings_booked": 42,
        "human_escalation_rate": "4.2%",
        "trai_dnd_blocked": 14
    }
