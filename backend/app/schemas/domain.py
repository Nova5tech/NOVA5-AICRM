from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --- CUSTOMER LEAD SCHEMAS ---
class CustomerLeadBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_role: Optional[str] = None
    source_channel: str = "Website Chat"
    status: str = "New"
    lead_score: int = 50
    confidence_score: float = 0.88
    score_breakdown: Dict[str, int] = Field(default_factory=dict)
    score_explanation: Optional[str] = None
    recommended_action: Optional[str] = None
    product_interest: Optional[str] = None
    requirements: Optional[str] = None
    objections: Optional[str] = None
    intent: str = "Medium"
    sentiment: str = "Neutral"
    assigned_to: str = "AI Agent"
    is_ready_for_call: bool = False
    has_opted_out: bool = False

class CustomerLeadCreate(CustomerLeadBase):
    pass

class CustomerLeadResponse(CustomerLeadBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- CHANNEL INTERACTION SCHEMAS ---
class ChannelInteractionBase(BaseModel):
    customer_lead_id: str
    channel: str
    external_user_id: Optional[str] = None
    message_id: Optional[str] = None
    content: str
    direction: str = "inbound"
    sentiment: str = "Neutral"
    intent: str = "General Inquiry"

class ChannelInteractionResponse(ChannelInteractionBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- CHAT MESSAGE SCHEMAS ---
class ChatMessageBase(BaseModel):
    customer_lead_id: str
    sender_type: str
    sender_name: str
    content: str
    intent_detected: Optional[str] = None
    sentiment_detected: Optional[str] = None
    extracted_info: Dict[str, Any] = Field(default_factory=dict)
    is_escalated: bool = False

class ChatMessageResponse(ChatMessageBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- VOICE CALL SCHEMAS ---
class VoiceCallBase(BaseModel):
    customer_lead_id: str
    objective: str = "Lead Qualification"
    call_status: str = "Completed"
    duration_sec: int = 90
    transcript: List[Dict[str, str]] = Field(default_factory=list)
    summary: str
    intent: str = "High"
    sentiment: str = "Positive"
    qualification_status: str = "Qualified"
    requirements_extracted: Optional[str] = None
    objections_raised: Optional[str] = None
    recommended_next_step: Optional[str] = None
    lead_score_before: int = 80
    lead_score_after: int = 92
    escalated_to_human: bool = False

class VoiceCallResponse(VoiceCallBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- INTEGRATION CONFIG SCHEMAS ---
class IntegrationConfigBase(BaseModel):
    channel_key: str
    name: str
    status: str = "Connected"
    account_name: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    webhook_status: str = "Healthy"
    connection_health: str = "Good"

class IntegrationConfigResponse(IntegrationConfigBase):
    id: str
    last_sync_at: datetime

    class Config:
        from_attributes = True

# --- AI INSIGHT SCHEMAS ---
class AIInsightResponse(BaseModel):
    id: str
    category: str
    title: str
    summary: str
    target_type: str
    target_id: str
    action_label: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- DASHBOARD METRICS ---
class DashboardMetrics(BaseModel):
    total_leads: int
    new_leads: int
    qualified_leads: int
    high_intent_leads: int
    chat_conversations: int
    ai_conversations: int
    calls_made: int
    calls_connected: int
    qualified_calls: int
    meetings_generated: int
    conversion_rate: float
    channel_breakdown: Dict[str, int]
    ai_priorities: List[AIInsightResponse]
