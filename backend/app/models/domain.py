from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class CustomerLead(Base):
    __tablename__ = "customer_leads"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    job_role = Column(String, nullable=True)
    source_channel = Column(String, default="Website Chat")
    
    # Lead Status & Scoring
    status = Column(String, default="New") # New, Contacted, Qualified, In Discussion, Closed
    lead_score = Column(Integer, default=50) # 0 to 100
    confidence_score = Column(Float, default=0.88)
    score_breakdown = Column(JSON, default=dict) # {"Product Inquiry": 25, "Pricing Discussion": 20, "Demo Request": 30}
    score_explanation = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    
    # AI Extracted Context
    product_interest = Column(String, nullable=True)
    requirements = Column(Text, nullable=True)
    objections = Column(Text, nullable=True)
    intent = Column(String, default="Medium") # High, Medium, Low
    sentiment = Column(String, default="Neutral") # Positive, Neutral, Negative
    
    # Assigned Agent / Status
    assigned_to = Column(String, default="AI Agent")
    is_ready_for_call = Column(Boolean, default=False)
    has_opted_out = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("ChannelInteraction", back_populates="customer_lead", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="customer_lead", cascade="all, delete-orphan")
    voice_calls = relationship("VoiceCall", back_populates="customer_lead", cascade="all, delete-orphan")

class ChannelInteraction(Base):
    __tablename__ = "channel_interactions"

    id = Column(String, primary_key=True)
    customer_lead_id = Column(String, ForeignKey("customer_leads.id"), nullable=False)
    channel = Column(String, nullable=False) # whatsapp, instagram, facebook, x, linkedin, website
    external_user_id = Column(String, nullable=True)
    message_id = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    direction = Column(String, default="inbound") # inbound, outbound
    sentiment = Column(String, default="Neutral")
    intent = Column(String, default="General Inquiry")
    timestamp = Column(DateTime, default=datetime.utcnow)

    customer_lead = relationship("CustomerLead", back_populates="interactions")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True)
    customer_lead_id = Column(String, ForeignKey("customer_leads.id"), nullable=False)
    sender_type = Column(String, nullable=False) # user, ai_agent, human_agent
    sender_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    intent_detected = Column(String, nullable=True)
    sentiment_detected = Column(String, nullable=True)
    extracted_info = Column(JSON, default=dict)
    is_escalated = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    customer_lead = relationship("CustomerLead", back_populates="chat_messages")

class VoiceCall(Base):
    __tablename__ = "voice_calls"

    id = Column(String, primary_key=True)
    customer_lead_id = Column(String, ForeignKey("customer_leads.id"), nullable=False)
    objective = Column(String, default="Lead Qualification") # Lead Qualification, Demo Scheduling, Follow-up
    call_status = Column(String, default="Completed") # Completed, In Progress, Failed, Escalated
    duration_sec = Column(Integer, default=90)
    transcript = Column(JSON, default=list) # [{"speaker": "AI Voice Agent", "text": "..."}, ...]
    summary = Column(Text, nullable=False)
    intent = Column(String, default="High")
    sentiment = Column(String, default="Positive")
    qualification_status = Column(String, default="Qualified")
    requirements_extracted = Column(Text, nullable=True)
    objections_raised = Column(Text, nullable=True)
    recommended_next_step = Column(Text, nullable=True)
    lead_score_before = Column(Integer, default=80)
    lead_score_after = Column(Integer, default=92)
    escalated_to_human = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    customer_lead = relationship("CustomerLead", back_populates="voice_calls")

class IntegrationConfig(Base):
    __tablename__ = "integration_configs"

    id = Column(String, primary_key=True)
    channel_key = Column(String, nullable=False, unique=True) # whatsapp, instagram, facebook, x, linkedin, website
    name = Column(String, nullable=False)
    status = Column(String, default="Connected") # Connected, Disconnected, API Access Required
    account_name = Column(String, nullable=True)
    permissions = Column(JSON, default=list)
    last_sync_at = Column(DateTime, default=datetime.utcnow)
    webhook_status = Column(String, default="Healthy")
    connection_health = Column(String, default="Good")

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(String, primary_key=True)
    category = Column(String, default="HIGH PRIORITY")
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    target_type = Column(String, nullable=False) # lead, chat, call
    target_id = Column(String, nullable=False)
    action_label = Column(String, default="Take Action")
    created_at = Column(DateTime, default=datetime.utcnow)
