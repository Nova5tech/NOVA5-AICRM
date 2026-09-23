from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from app.core.database import get_db
from app.models.domain import CustomerLead, ChannelInteraction
from app.schemas.domain import ChannelInteractionResponse
from app.ai.engine import AIEngine

router = APIRouter(prefix="/channels", tags=["Omnichannel Integration Layer"])

class NormalizedEvent(BaseModel):
    channel: str # whatsapp, instagram, facebook, x, linkedin, website
    external_user_id: str
    message_id: Optional[str] = None
    text: str
    metadata: Optional[dict] = None

@router.post("/ingest")
def ingest_normalized_event(event: NormalizedEvent, db: Session = Depends(get_db)):
    """
    Normalized event ingestion pipeline for WhatsApp, Instagram, Facebook, X, LinkedIn & Website.
    - Matches or creates unified CustomerLead
    - Logs normalized channel interaction
    - Runs AI extraction & lead scoring
    """
    # Cross-channel identity resolution
    lead = db.query(CustomerLead).filter(
        (CustomerLead.email == event.external_user_id) | 
        (CustomerLead.phone == event.external_user_id)
    ).first()

    extracted = AIEngine.extract_lead_info(event.text, event.channel)

    if not lead:
        lead_id = f"lead_{uuid.uuid4().hex[:8]}"
        lead = CustomerLead(
            id=lead_id,
            name=f"Lead ({event.channel.capitalize()})",
            email=extracted.get("email"),
            phone=extracted.get("phone"),
            source_channel=event.channel,
            intent=extracted.get("intent", "General Inquiry"),
            sentiment=extracted.get("sentiment", "Neutral"),
            product_interest=extracted.get("product_interest"),
            status="New",
            lead_score=50
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)

    # Record normalized interaction
    interaction_id = f"int_{uuid.uuid4().hex[:8]}"
    interaction = ChannelInteraction(
        id=interaction_id,
        customer_lead_id=lead.id,
        channel=event.channel,
        external_user_id=event.external_user_id,
        message_id=event.message_id,
        content=event.text,
        direction="inbound",
        sentiment=extracted.get("sentiment", "Neutral"),
        intent=extracted.get("intent", "General Inquiry")
    )
    db.add(interaction)

    # Recalculate AI Lead Score
    interactions_count = db.query(ChannelInteraction).filter(ChannelInteraction.customer_lead_id == lead.id).count()
    score_res = AIEngine.calculate_explainable_score(
        intent=lead.intent,
        has_email=bool(lead.email),
        has_phone=bool(lead.phone),
        has_company=bool(lead.company),
        has_demo_request=(lead.intent == "Demo Request"),
        interactions_count=interactions_count
    )

    lead.lead_score = score_res["score"]
    lead.score_breakdown = score_res["breakdown"]
    lead.score_explanation = score_res["explanation"]
    lead.recommended_action = score_res["recommended_action"]

    db.commit()

    return {
        "event_id": interaction_id,
        "customer_lead_id": lead.id,
        "channel": event.channel,
        "intent_detected": extracted.get("intent"),
        "sentiment_detected": extracted.get("sentiment"),
        "lead_score": lead.lead_score,
        "status": "Processed"
    }

@router.get("/{channel}/activity")
def get_channel_activity(channel: str, db: Session = Depends(get_db)):
    """
    Returns channel activity feed for WhatsApp, Instagram, Facebook, X, or LinkedIn.
    """
    interactions = db.query(ChannelInteraction).filter(ChannelInteraction.channel == channel).order_by(ChannelInteraction.timestamp.desc()).all()
    leads = db.query(CustomerLead).filter(CustomerLead.source_channel == channel).all()

    return {
        "channel": channel,
        "total_messages": len(interactions),
        "total_leads_generated": len(leads),
        "interactions": [
            {
                "id": i.id,
                "customer_lead_id": i.customer_lead_id,
                "content": i.content,
                "sentiment": i.sentiment,
                "intent": i.intent,
                "timestamp": i.timestamp
            }
            for i in interactions
        ]
    }
