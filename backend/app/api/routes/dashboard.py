from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import CustomerLead, ChannelInteraction, ChatMessage, VoiceCall, IntegrationConfig, AIInsight
from app.schemas.domain import DashboardMetrics, AIInsightResponse

router = APIRouter(prefix="/dashboard", tags=["AI Dashboard"])

@router.get("", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Returns live aggregated metrics and AI Priorities computed from the shared customer/lead database.
    """
    total_leads = db.query(CustomerLead).count()
    new_leads = db.query(CustomerLead).filter(CustomerLead.status == "New").count()
    qualified_leads = db.query(CustomerLead).filter(CustomerLead.lead_score >= 80).count()
    high_intent_leads = db.query(CustomerLead).filter(CustomerLead.intent == "High Purchase Intent").count()

    chat_conversations = db.query(ChatMessage).count()
    ai_conversations = db.query(ChatMessage).filter(ChatMessage.sender_type == "ai_agent").count()

    calls_made = db.query(VoiceCall).count()
    calls_connected = db.query(VoiceCall).filter(VoiceCall.call_status == "Completed").count()
    qualified_calls = db.query(VoiceCall).filter(VoiceCall.qualification_status == "Qualified").count()

    meetings_generated = db.query(CustomerLead).filter(CustomerLead.lead_score >= 90).count()

    # Calculate conversion rate
    conversion_rate = round((qualified_leads / total_leads * 100), 1) if total_leads > 0 else 0.0

    # Channel breakdown
    channels_list = ["whatsapp", "instagram", "facebook", "x", "linkedin", "website"]
    channel_breakdown = {}
    for ch in channels_list:
        count = db.query(CustomerLead).filter(CustomerLead.source_channel == ch).count()
        if count == 0 and ch == "website":
            count = db.query(CustomerLead).filter(CustomerLead.source_channel == "Website Chat").count()
        channel_breakdown[ch] = count

    # Fetch AI Priorities
    insights = db.query(AIInsight).order_by(AIInsight.created_at.desc()).limit(5).all()

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "qualified_leads": qualified_leads,
        "high_intent_leads": high_intent_leads,
        "chat_conversations": chat_conversations,
        "ai_conversations": ai_conversations,
        "calls_made": calls_made,
        "calls_connected": calls_connected,
        "qualified_calls": qualified_calls,
        "meetings_generated": meetings_generated,
        "conversion_rate": conversion_rate,
        "channel_breakdown": channel_breakdown,
        "ai_priorities": [
            {
                "id": ins.id,
                "category": ins.category,
                "title": ins.title,
                "summary": ins.summary,
                "target_type": ins.target_type,
                "target_id": ins.target_id,
                "action_label": ins.action_label,
                "created_at": ins.created_at
            }
            for ins in insights
        ]
    }
