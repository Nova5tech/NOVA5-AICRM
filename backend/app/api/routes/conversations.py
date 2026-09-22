from typing import List, Optional
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.domain import Conversation, Message, Contact, Company
from app.schemas.domain import ConversationOut, MessageOut, SmartReplyRequest, SmartReplyResponse
from app.ai.engine import AIConversationAnalyzer, AISmartReplyGenerator

router = APIRouter(prefix="/conversations", tags=["Conversations & Omnichannel Inbox"])

@router.get("", response_model=List[ConversationOut])
async def list_conversations(
    channel: Optional[str] = None,
    sentiment: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Conversation)
    if channel and channel != "all":
        stmt = stmt.where(Conversation.channel == channel)
    if sentiment:
        stmt = stmt.where(Conversation.sentiment == sentiment)
    stmt = stmt.order_by(Conversation.last_message_at.desc())
    
    res = await db.execute(stmt)
    conversations = res.scalars().all()
    
    for c in conversations:
        # Load contact
        cnt_res = await db.execute(select(Contact).where(Contact.id == c.contact_id))
        c.contact = cnt_res.scalars().first()
        if c.contact and c.contact.company_id:
            comp_res = await db.execute(select(Company).where(Company.id == c.contact.company_id))
            c.contact.company = comp_res.scalars().first()
            
        # Load messages
        msg_res = await db.execute(select(Message).where(Message.conversation_id == c.id).order_by(Message.timestamp))
        c.messages = msg_res.scalars().all()
        
    return conversations

@router.get("/{conversation_id}", response_model=ConversationOut)
async def get_conversation(conversation_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    cnt_res = await db.execute(select(Contact).where(Contact.id == conv.contact_id))
    conv.contact = cnt_res.scalars().first()
    if conv.contact and conv.contact.company_id:
        comp_res = await db.execute(select(Company).where(Company.id == conv.contact.company_id))
        conv.contact.company = comp_res.scalars().first()
        
    msg_res = await db.execute(select(Message).where(Message.conversation_id == conv.id).order_by(Message.timestamp))
    conv.messages = msg_res.scalars().all()
    return conv

@router.post("/{conversation_id}/messages")
async def post_message(
    conversation_id: str,
    content: str,
    sender_type: str = "agent",
    sender_name: str = "Michael Ross",
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    new_msg = Message(
        id=f"msg_{uuid.uuid4().hex[:8]}",
        conversation_id=conversation_id,
        sender_type=sender_type,
        sender_name=sender_name,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(new_msg)
    conv.last_message_at = datetime.utcnow()
    
    # Re-run AI Conversation Intelligence
    msg_res = await db.execute(select(Message).where(Message.conversation_id == conv.id).order_by(Message.timestamp))
    all_msgs = [m.__dict__ for m in msg_res.scalars().all()]
    all_msgs.append({"content": content, "sender_type": sender_type})
    
    ai_res = AIConversationAnalyzer.analyze(all_msgs)
    conv.ai_summary = ai_res["summary"]
    conv.sentiment = ai_res["sentiment"]
    conv.intent = ai_res["intent"]
    conv.urgency = ai_res["urgency"]
    conv.extracted_action_items = ai_res["extracted_action_items"]
    conv.suggested_response = ai_res["suggested_response"]
    
    await db.commit()
    return {"status": "success", "message": new_msg.id, "ai_intelligence": ai_res}

@router.post("/generate-smart-reply", response_model=SmartReplyResponse)
async def generate_smart_reply(req: SmartReplyRequest, db: AsyncSession = Depends(get_db)):
    msg_res = await db.execute(select(Message).where(Message.conversation_id == req.conversation_id).order_by(Message.timestamp))
    messages = [m.__dict__ for m in msg_res.scalars().all()]
    
    reply = AISmartReplyGenerator.generate_reply(
        messages=messages,
        tone=req.tone,
        instructions=req.custom_instructions
    )
    
    return SmartReplyResponse(
        reply=reply,
        confidence=0.92,
        sources_used=["Customer History", "Knowledge Base SLA Docs", f"Tone Config: {req.tone}"]
    )
