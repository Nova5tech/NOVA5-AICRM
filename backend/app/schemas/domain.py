from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "Sales"
    avatar_url: Optional[str] = None

class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    annual_revenue: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    health_score: int = 85

class CompanyOut(CompanyBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Contact Schemas
class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    title: Optional[str] = None
    company_id: Optional[str] = None
    avatar_url: Optional[str] = None
    channel_handles: Dict[str, Any] = {}

class ContactOut(ContactBase):
    id: str
    is_merged: bool = False
    merged_into_id: Optional[str] = None
    company: Optional[CompanyOut] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- OUTREACH AGENT SCHEMAS ---

class CampaignCreate(BaseModel):
    name: str
    audience_filter: str = "Lead Score > 75"
    sequence_steps: List[Dict[str, Any]]
    max_contacts: int = 100

class CampaignOut(CampaignCreate):
    id: str
    status: str
    total_engaged: int
    total_qualified: int
    meetings_booked: int
    created_at: datetime
    class Config:
        from_attributes = True

class ConsentRecordOut(BaseModel):
    id: str
    contact_id: str
    channel: str
    consent_status: str
    consent_source: str
    trai_sender_id: str
    last_contacted_at: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

class VoiceCallResultOut(BaseModel):
    id: str
    contact_id: str
    campaign_id: Optional[str]
    call_status: str
    duration_sec: int
    transcript: List[Dict[str, str]]
    summary: str
    intent: str
    sentiment: str
    qualification_status: str
    requirements: Optional[str]
    objections: Optional[str]
    recommended_next_action: Optional[str]
    lead_score_before: int
    lead_score_after: int
    escalated_to_human: bool
    created_at: datetime
    class Config:
        from_attributes = True

class SimulateVoiceCallRequest(BaseModel):
    contact_id: str
    campaign_id: Optional[str] = None

# Ticket Schemas
class TicketCreate(BaseModel):
    contact_id: str
    conversation_id: Optional[str] = None
    title: str
    issue_description: str
    priority: str = "Medium"
    assignee_id: Optional[str] = None
    sla_due_hours: int = 24

class TicketOut(BaseModel):
    id: str
    contact_id: str
    conversation_id: Optional[str]
    title: str
    issue_description: str
    status: str
    priority: str
    assignee_id: Optional[str]
    sla_due_hours: int
    ai_summary: Optional[str]
    ai_suggested_resolution: Optional[str]
    contact: Optional[ContactOut] = None
    created_at: datetime
    class Config:
        from_attributes = True

# AI Governance & Log Schemas
class AILogOut(BaseModel):
    id: str
    operation: str
    model: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    cost_usd: float
    latency_ms: int
    status: str
    timestamp: datetime
    class Config:
        from_attributes = True

class ApprovalTaskOut(BaseModel):
    id: str
    action_type: str
    title: str
    proposed_content: str
    target_contact_id: Optional[str]
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Identity Resolution Schemas
class DuplicateMatch(BaseModel):
    contact1: ContactOut
    contact2: ContactOut
    match_reason: str
    confidence_score: int

class MergeContactsRequest(BaseModel):
    primary_contact_id: str
    secondary_contact_id: str

# Lead Schemas
class LeadBase(BaseModel):
    title: str
    source: str = "Website Chat"
    status: str = "New"
    priority: str = "Medium"
    lead_score: int = 50
    contact_id: str
    assigned_to: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadOut(LeadBase):
    id: str
    confidence: float
    score_breakdown: Dict[str, int]
    score_explanation: Optional[str]
    next_best_action: Optional[str] = None
    contact: Optional[ContactOut] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Message & Conversation Schemas
class MessageBase(BaseModel):
    sender_type: str
    sender_name: str
    sender_avatar: Optional[str] = None
    content: str
    is_internal_note: bool = False

class MessageCreate(MessageBase):
    conversation_id: str

class MessageOut(MessageBase):
    id: str
    conversation_id: str
    timestamp: datetime
    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: str
    contact_id: str
    channel: str
    channel_account: Optional[str]
    status: str
    assigned_to: Optional[str]
    last_message_at: datetime
    ai_summary: Optional[str]
    sentiment: str
    intent: str
    urgency: str
    extracted_action_items: List[str]
    suggested_response: Optional[str]
    tags: List[str]
    contact: Optional[ContactOut]
    messages: List[MessageOut] = []
    class Config:
        from_attributes = True

# Deal Schemas
class DealBase(BaseModel):
    title: str
    company_id: Optional[str] = None
    lead_id: Optional[str] = None
    value: float
    currency: str = "USD"
    stage: str = "New Lead"
    probability: int = 20
    expected_close_date: Optional[str] = None
    owner_id: Optional[str] = None

class DealCreate(DealBase):
    pass

class DealOut(DealBase):
    id: str
    ai_risk_level: str
    ai_risk_reasons: List[str]
    ai_recommended_action: Optional[str]
    days_in_stage: int
    company: Optional[CompanyOut] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Activity & Task Schemas
class ActivityOut(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str]
    contact_id: Optional[str]
    company_id: Optional[str]
    deal_id: Optional[str]
    performed_by: Optional[str]
    timestamp: datetime
    class Config:
        from_attributes = True

class TaskOut(BaseModel):
    id: str
    title: str
    due_date: Optional[str]
    priority: str
    status: str
    assignee_id: Optional[str]
    contact_id: Optional[str]
    deal_id: Optional[str]
    is_ai_recommended: bool
    created_at: datetime
    class Config:
        from_attributes = True

# AI Intelligence & Assistant Schemas
class SmartReplyRequest(BaseModel):
    conversation_id: str
    tone: str = "Professional"
    custom_instructions: Optional[str] = None

class SmartReplyResponse(BaseModel):
    reply: str
    confidence: float
    sources_used: List[str]

class CopilotQueryRequest(BaseModel):
    query: str

class CopilotQueryResponse(BaseModel):
    answer: str
    tool_calls: List[Dict[str, Any]]
    data: Optional[Any] = None

# Analytics & Overview Schemas
class OverviewMetrics(BaseModel):
    total_leads: int
    qualified_leads: int
    conversion_rate: float
    active_deals: int
    pipeline_value: float
    won_revenue: float
    open_tasks: int
    avg_response_time_min: int

# Automation Schemas
class AutomationCreate(BaseModel):
    name: str
    trigger: str
    conditions: List[Dict[str, Any]]
    actions: List[Dict[str, Any]]

class AutomationOut(AutomationCreate):
    id: str
    is_active: bool
    total_runs: int
    created_at: datetime
    class Config:
        from_attributes = True

# Document Schemas
class DocumentCreate(BaseModel):
    title: str
    category: str = "Product Doc"
    content: str

class DocumentOut(DocumentCreate):
    id: str
    chunk_count: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Integration Schemas
class IntegrationOut(BaseModel):
    id: str
    name: str
    category: str
    status: str
    account_connected: Optional[str]
    last_sync: Optional[str]
    icon_key: Optional[str]
    class Config:
        from_attributes = True
