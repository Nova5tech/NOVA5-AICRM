from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Sales")
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    domain = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    size = Column(String, nullable=True)
    annual_revenue = Column(String, nullable=True)
    website = Column(String, nullable=True)
    location = Column(String, nullable=True)
    health_score = Column(Integer, default=85)
    created_at = Column(DateTime, default=datetime.utcnow)

    contacts = relationship("Contact", back_populates="company")
    deals = relationship("Deal", back_populates="company")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(String, primary_key=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    phone = Column(String, nullable=True)
    title = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    channel_handles = Column(JSON, default=dict)
    is_merged = Column(Boolean, default=False)
    merged_into_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="contacts")
    leads = relationship("Lead", back_populates="contact")
    conversations = relationship("Conversation", back_populates="contact")
    tickets = relationship("Ticket", back_populates="contact")
    consent_records = relationship("ConsentRecord", back_populates="contact")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(String, primary_key=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    title = Column(String, nullable=False)
    source = Column(String, default="Website Chat")
    status = Column(String, default="New")
    priority = Column(String, default="Medium")
    lead_score = Column(Integer, default=50)
    confidence = Column(Float, default=0.88)
    score_breakdown = Column(JSON, default=dict)
    score_explanation = Column(Text, nullable=True)
    next_best_action = Column(Text, nullable=True)
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="leads")
    deals = relationship("Deal", back_populates="lead")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    channel = Column(String, nullable=False)
    channel_account = Column(String, nullable=True)
    status = Column(String, default="Open")
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)
    last_message_at = Column(DateTime, default=datetime.utcnow)
    
    # AI Extracted Fields
    ai_summary = Column(Text, nullable=True)
    sentiment = Column(String, default="Neutral")
    intent = Column(String, default="General Inquiry")
    urgency = Column(String, default="Medium")
    extracted_action_items = Column(JSON, default=list)
    suggested_response = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", order_by="Message.timestamp")
    tickets = relationship("Ticket", back_populates="conversation")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    sender_type = Column(String, nullable=False)
    sender_name = Column(String, nullable=False)
    sender_avatar = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    attachments = Column(JSON, default=list)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_internal_note = Column(Boolean, default=False)

    conversation = relationship("Conversation", back_populates="messages")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    lead_id = Column(String, ForeignKey("leads.id"), nullable=True)
    value = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    stage = Column(String, default="New Lead")
    probability = Column(Integer, default=20)
    expected_close_date = Column(String, nullable=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=True)
    
    # AI Risk & Deal Intelligence
    ai_risk_level = Column(String, default="Low")
    ai_risk_reasons = Column(JSON, default=list)
    ai_recommended_action = Column(Text, nullable=True)
    days_in_stage = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="deals")
    lead = relationship("Lead", back_populates="deals")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=True)
    title = Column(String, nullable=False)
    issue_description = Column(Text, nullable=False)
    status = Column(String, default="Open")
    priority = Column(String, default="Medium")
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)
    sla_due_hours = Column(Integer, default=24)
    ai_summary = Column(Text, nullable=True)
    ai_suggested_resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="tickets")
    conversation = relationship("Conversation", back_populates="tickets")

# --- OUTREACH AGENT MODULE MODELS ---

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    status = Column(String, default="Active") # Draft, Active, Paused, Completed
    audience_filter = Column(String, default="Lead Score > 75")
    sequence_steps = Column(JSON, default=list) # [{"day": 0, "channel": "Email"}, {"day": 2, "channel": "Email"}, {"day": 4, "channel": "VoiceCall"}]
    max_contacts = Column(Integer, default=100)
    total_engaged = Column(Integer, default=0)
    total_qualified = Column(Integer, default=0)
    meetings_booked = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String, primary_key=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    channel = Column(String, nullable=False) # Email, VoiceCall, WhatsApp
    consent_status = Column(String, default="Consented") # Consented, OptedOut, DND
    consent_source = Column(String, default="Inbound Web Form")
    trai_sender_id = Column(String, default="NV5CRM-TRAI-882")
    last_contacted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contact = relationship("Contact", back_populates="consent_records")

class VoiceCallResult(Base):
    __tablename__ = "voice_call_results"

    id = Column(String, primary_key=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=False)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=True)
    call_status = Column(String, default="Completed") # Completed, Escalated, Unanswered
    duration_sec = Column(Integer, default=95)
    transcript = Column(JSON, default=list) # [{"speaker": "AI Voice Agent", "text": "..."}, ...]
    summary = Column(Text, nullable=False)
    intent = Column(String, default="High Purchase Intent")
    sentiment = Column(String, default="Positive")
    qualification_status = Column(String, default="Qualified") # Qualified, Unqualified
    requirements = Column(Text, nullable=True)
    objections = Column(Text, nullable=True)
    recommended_next_action = Column(Text, nullable=True)
    lead_score_before = Column(Integer, default=88)
    lead_score_after = Column(Integer, default=95)
    escalated_to_human = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    deal_id = Column(String, ForeignKey("deals.id"), nullable=True)
    performed_by = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    due_date = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    status = Column(String, default="Pending")
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)
    contact_id = Column(String, ForeignKey("contacts.id"), nullable=True)
    deal_id = Column(String, ForeignKey("deals.id"), nullable=True)
    is_ai_recommended = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AILog(Base):
    __tablename__ = "ai_logs"

    id = Column(String, primary_key=True)
    operation = Column(String, nullable=False)
    model = Column(String, default="gpt-4o-mini / gemini-1.5-flash")
    prompt_tokens = Column(Integer, default=150)
    completion_tokens = Column(Integer, default=80)
    total_tokens = Column(Integer, default=230)
    cost_usd = Column(Float, default=0.0012)
    latency_ms = Column(Integer, default=340)
    status = Column(String, default="Success")
    timestamp = Column(DateTime, default=datetime.utcnow)

class ApprovalTask(Base):
    __tablename__ = "approval_tasks"

    id = Column(String, primary_key=True)
    action_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    proposed_content = Column(Text, nullable=False)
    target_contact_id = Column(String, ForeignKey("contacts.id"), nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(String, primary_key=True)
    category = Column(String, default="HIGH PRIORITY")
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    impact_score = Column(Integer, default=80)
    related_entity_type = Column(String, nullable=True)
    related_entity_id = Column(String, nullable=True)
    action_label = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Automation(Base):
    __tablename__ = "automations"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    trigger = Column(String, nullable=False)
    conditions = Column(JSON, default=list)
    actions = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    total_runs = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    category = Column(String, default="Product Doc")
    content = Column(Text, nullable=False)
    chunk_count = Column(Integer, default=1)
    status = Column(String, default="Indexed")
    created_at = Column(DateTime, default=datetime.utcnow)

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="Disconnected")
    account_connected = Column(String, nullable=True)
    last_sync = Column(String, nullable=True)
    icon_key = Column(String, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
