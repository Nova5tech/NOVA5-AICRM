from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from app.core.database import get_db
from app.models.domain import CustomerLead, ChatMessage
from app.schemas.domain import ChatMessageResponse
from app.ai.engine import AIEngine

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    customer_lead_id: Optional[str] = None
    customer_name: Optional[str] = "Prospect"
    channel: str = "website"
    message: str

@router.post("/send")
def send_chat_message(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Processes user input through the AI Chatbot agent:
    - Answers FAQ/product inquiries using grounded knowledge
    - Detects intent & sentiment
    - Automatically creates/updates unified CustomerLead
    - Recalculates lead score
    """
    # Find or create customer lead
    lead = None
    if req.customer_lead_id:
        lead = db.query(CustomerLead).filter(CustomerLead.id == req.customer_lead_id).first()

    if not lead:
        # Extract lead info from user message
        extracted = AIEngine.extract_lead_info(req.message, req.channel)
        lead_id = f"lead_{uuid.uuid4().hex[:8]}"
        lead = CustomerLead(
            id=lead_id,
            name=req.customer_name or "New Prospect",
            email=extracted.get("email"),
            phone=extracted.get("phone"),
            source_channel=req.channel,
            intent=extracted.get("intent", "General Inquiry"),
            sentiment=extracted.get("sentiment", "Neutral"),
            product_interest=extracted.get("product_interest"),
            status="New",
            lead_score=55
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)

    # Save user message
    user_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    user_msg = ChatMessage(
        id=user_msg_id,
        customer_lead_id=lead.id,
        sender_type="user",
        sender_name=lead.name,
        content=req.message
    )
    db.add(user_msg)

    # Generate AI Chatbot response
    ai_result = AIEngine.generate_chatbot_response(
        query=req.message,
        lead_name=lead.name
    )

    ai_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    ai_msg = ChatMessage(
        id=ai_msg_id,
        customer_lead_id=lead.id,
        sender_type="ai_agent",
        sender_name="Nova5 AI Chatbot",
        content=ai_result["reply"],
        intent_detected=ai_result["intent"],
        sentiment_detected=ai_result["sentiment"],
        is_escalated=ai_result["is_escalated"]
    )
    db.add(ai_msg)

    # Update lead intent & sentiment
    lead.intent = ai_result["intent"]
    lead.sentiment = ai_result["sentiment"]

    # Recalculate lead score
    score_res = AIEngine.calculate_explainable_score(
        intent=lead.intent,
        has_email=bool(lead.email),
        has_phone=bool(lead.phone),
        has_company=bool(lead.company),
        has_demo_request=(lead.intent == "Demo Request" or "pricing" in req.message.lower()),
        interactions_count=db.query(ChatMessage).filter(ChatMessage.customer_lead_id == lead.id).count()
    )

    lead.lead_score = score_res["score"]
    lead.score_breakdown = score_res["breakdown"]
    lead.score_explanation = score_res["explanation"]
    lead.recommended_action = score_res["recommended_action"]
    if lead.lead_score >= 80:
        lead.is_ready_for_call = True

    db.commit()

    return {
        "customer_lead_id": lead.id,
        "lead_name": lead.name,
        "reply": ai_result["reply"],
        "intent_detected": ai_result["intent"],
        "sentiment_detected": ai_result["sentiment"],
        "is_escalated": ai_result["is_escalated"],
        "lead_score": lead.lead_score,
        "recommended_action": lead.recommended_action
    }

@router.get("/history/{customer_lead_id}", response_model=List[ChatMessageResponse])
def get_chat_history(customer_lead_id: str, db: Session = Depends(get_db)):
    return db.query(ChatMessage).filter(ChatMessage.customer_lead_id == customer_lead_id).order_by(ChatMessage.timestamp.asc()).all()
