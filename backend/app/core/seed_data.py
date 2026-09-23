from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.domain import CustomerLead, ChannelInteraction, ChatMessage, VoiceCall, IntegrationConfig, AIInsight

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(CustomerLead).first():
        return

    # Seed Customer Leads
    leads_data = [
        {
            "id": "lead_101",
            "name": "Marcus Vance",
            "email": "marcus@aetherdynamics.com",
            "phone": "+1 (555) 234-5678",
            "company": "Aether Dynamics",
            "job_role": "VP of Revenue Operations",
            "source_channel": "whatsapp",
            "status": "Qualified",
            "lead_score": 92,
            "confidence_score": 0.95,
            "score_breakdown": {"High Purchase Intent": 25, "Demo Requested": 30, "Verified Contact Info": 20, "Enterprise Company Fit": 10, "Multi-Channel Engagement": 7},
            "score_explanation": "Lead score evaluates to 92/100. Key drivers: + Pricing / Enterprise plan discussion, + Direct demo requested, + Verified email & phone provided.",
            "recommended_action": "Initiate AI Voice Call",
            "product_interest": "AI Voice Calling Agent & Enterprise CRM",
            "requirements": "Custom REST API integration & 99.9% SOC2 SLA compliance",
            "objections": "Technical validation needed prior to contract",
            "intent": "High Purchase Intent",
            "sentiment": "Positive",
            "assigned_to": "AI Agent",
            "is_ready_for_call": True
        },
        {
            "id": "lead_102",
            "name": "Sarah Chen",
            "email": "sarah.chen@nexushealth.org",
            "phone": "+1 (555) 876-5432",
            "company": "Nexus Health",
            "job_role": "Director of Customer Care",
            "source_channel": "instagram",
            "status": "Qualified",
            "lead_score": 88,
            "confidence_score": 0.92,
            "score_breakdown": {"High Purchase Intent": 25, "Verified Contact Info": 20, "Enterprise Company Fit": 10, "Product Inquiry": 15, "Multi-Channel Engagement": 18},
            "score_explanation": "Lead score evaluates to 88/100. Key drivers: + Product inquiry, + Verified contact info provided, + Enterprise company fit.",
            "recommended_action": "Initiate AI Voice Call",
            "product_interest": "AI Chatbot & WhatsApp Integration",
            "requirements": "HIPAA compliance & multi-lingual WhatsApp support",
            "objections": "Security review required",
            "intent": "High Purchase Intent",
            "sentiment": "Positive",
            "assigned_to": "AI Agent",
            "is_ready_for_call": True
        },
        {
            "id": "lead_103",
            "name": "David Miller",
            "email": "david@fintechglobal.io",
            "phone": "+1 (555) 345-6789",
            "company": "Fintech Global",
            "job_role": "Head of Growth",
            "source_channel": "linkedin",
            "status": "In Discussion",
            "lead_score": 78,
            "confidence_score": 0.88,
            "score_breakdown": {"Product Inquiry": 15, "Verified Contact Info": 20, "Enterprise Company Fit": 10, "Multi-Channel Engagement": 33},
            "score_explanation": "Lead score evaluates to 78/100. Key drivers: + Product capability inquiry, + Verified email & phone provided.",
            "recommended_action": "Send AI Smart Follow-up Chat",
            "product_interest": "Omnichannel Integration Layer",
            "requirements": "LinkedIn & X lead extraction pipeline",
            "objections": "Need pricing comparison",
            "intent": "Product Inquiry",
            "sentiment": "Neutral",
            "assigned_to": "AI Agent",
            "is_ready_for_call": False
        },
        {
            "id": "lead_104",
            "name": "Elena Rostova",
            "email": "elena@cloudscale.tech",
            "phone": "+1 (555) 987-6543",
            "company": "CloudScale Systems",
            "job_role": "Chief Technology Officer",
            "source_channel": "x",
            "status": "New",
            "lead_score": 64,
            "confidence_score": 0.85,
            "score_breakdown": {"Product Inquiry": 15, "Contact Info Provided": 10, "Enterprise Company Fit": 10, "Baseline": 29},
            "score_explanation": "Lead score evaluates to 64/100. Key drivers: + Initial product inquiry via X DM.",
            "recommended_action": "Send AI Smart Follow-up Chat",
            "product_interest": "AI Voice Calling Agent",
            "requirements": "Twilio / SIP trunk integration",
            "intent": "General Inquiry",
            "sentiment": "Neutral",
            "assigned_to": "AI Agent",
            "is_ready_for_call": False
        },
        {
            "id": "lead_105",
            "name": "Alex Vance",
            "email": "alex@nova5tech.com",
            "phone": "+1 (555) 111-2233",
            "company": "Nova5 Tech",
            "job_role": "Sales Lead",
            "source_channel": "facebook",
            "status": "New",
            "lead_score": 55,
            "confidence_score": 0.80,
            "score_breakdown": {"Contact Info Provided": 10, "Baseline": 45},
            "score_explanation": "Lead score evaluates to 55/100. Initial lead detection.",
            "recommended_action": "Engage via AI Chatbot",
            "product_interest": "AI CRM Platform",
            "intent": "General Inquiry",
            "sentiment": "Neutral",
            "assigned_to": "AI Agent",
            "is_ready_for_call": False
        }
    ]

    for ld in leads_data:
        lead_obj = CustomerLead(**ld)
        db.add(lead_obj)

    db.commit()

    # Seed Channel Interactions
    interactions = [
        {"id": "int_1", "customer_lead_id": "lead_101", "channel": "whatsapp", "content": "Evaluated competitors. Requesting 150 enterprise seat pricing package and SOC2 compliance document.", "sentiment": "Positive", "intent": "High Purchase Intent"},
        {"id": "int_2", "customer_lead_id": "lead_102", "channel": "instagram", "content": "Hi! We need multi-channel WhatsApp and Instagram chatbot integration for 50 customer support reps.", "sentiment": "Positive", "intent": "High Purchase Intent"},
        {"id": "int_3", "customer_lead_id": "lead_103", "channel": "linkedin", "content": "Interested in your LinkedIn & X Lead extraction pipeline for our growth team.", "sentiment": "Neutral", "intent": "Product Inquiry"},
        {"id": "int_4", "customer_lead_id": "lead_104", "channel": "x", "content": "Does your AI Voice agent support SIP trunking and custom telephony integrations?", "sentiment": "Neutral", "intent": "Product Inquiry"},
        {"id": "int_5", "customer_lead_id": "lead_105", "channel": "facebook", "content": "Hello! Looking for information on your AI customer acquisition suite.", "sentiment": "Neutral", "intent": "General Inquiry"}
    ]

    for inter in interactions:
        db.add(ChannelInteraction(**inter))

    # Seed Chat Messages
    chat_msgs = [
        {"id": "msg_1", "customer_lead_id": "lead_101", "sender_type": "user", "sender_name": "Marcus Vance", "content": "Can your AI agent handle enterprise custom REST API calls during live conversations?"},
        {"id": "msg_2", "customer_lead_id": "lead_101", "sender_type": "ai_agent", "sender_name": "Nova5 AI Chatbot", "content": "Yes, Marcus! Nova5 supports native REST API tool calling and grounds all answers in your approved RAG knowledge base. Would you like me to set up an engineering demo?", "intent_detected": "High Purchase Intent", "sentiment_detected": "Positive"},
        {"id": "msg_3", "customer_lead_id": "lead_102", "sender_type": "user", "sender_name": "Sarah Chen", "content": "What is the pricing for HIPAA compliant voice agent deployment?"},
        {"id": "msg_4", "customer_lead_id": "lead_102", "sender_type": "ai_agent", "sender_name": "Nova5 AI Chatbot", "content": "Hello Sarah! Our Enterprise Plan ($299/mo + custom SLA) includes full HIPAA compliance, dedicated voice pipelines, and 99.9% uptime guarantees.", "intent_detected": "High Purchase Intent", "sentiment_detected": "Positive"}
    ]

    for cm in chat_msgs:
        db.add(ChatMessage(**cm))

    # Seed Voice Calls
    calls = [
        {
            "id": "call_101",
            "customer_lead_id": "lead_101",
            "objective": "Lead Qualification",
            "call_status": "Completed",
            "duration_sec": 98,
            "transcript": [
                {"speaker": "AI Voice Agent", "text": "Hello Marcus, this is Nova5 AI calling regarding your interest in our AI Voice Calling Agent for Aether Dynamics. Do you have 2 minutes?"},
                {"speaker": "Customer", "text": "Hi! Yes, I was evaluating your platform for our enterprise sales team. We need CRM tool integration and custom SLA uptime."},
                {"speaker": "AI Voice Agent", "text": "That's great! Nova5 provides native REST APIs and guaranteed 99.9% HIPAA/SOC2 compliant SLAs. I can schedule a technical demo tomorrow at 2 PM."},
                {"speaker": "Customer", "text": "Perfect, send the calendar invitation to my email."}
            ],
            "summary": "Completed 98-second AI Voice call with Marcus Vance (Aether Dynamics). Customer validated requirements for CRM API integration and SLA compliance. Agreed to technical demo.",
            "intent": "High Purchase Intent",
            "sentiment": "Positive",
            "qualification_status": "Qualified",
            "requirements_extracted": "Custom REST API integration & 99.9% SOC2 SLA compliance",
            "objections_raised": "Technical validation needed prior to contract",
            "recommended_next_step": "Send technical demo calendar invite & enterprise architecture whitepaper",
            "lead_score_before": 80,
            "lead_score_after": 92
        }
    ]

    for cl in calls:
        db.add(VoiceCall(**cl))

    # Seed Integration Configs
    integrations = [
        {"id": "cfg_wa", "channel_key": "whatsapp", "name": "WhatsApp Business API", "status": "Connected", "account_name": "+1 (800) 555-NV5", "permissions": ["messages:read", "messages:write", "webhooks"], "webhook_status": "Healthy", "connection_health": "99.9%"},
        {"id": "cfg_ig", "channel_key": "instagram", "name": "Instagram Direct Graph API", "status": "Connected", "account_name": "@nova5.ai", "permissions": ["instagram_manage_messages"], "webhook_status": "Healthy", "connection_health": "99.8%"},
        {"id": "cfg_fb", "channel_key": "facebook", "name": "Facebook Messenger API", "status": "Connected", "account_name": "Nova5 Technologies", "permissions": ["pages_messaging"], "webhook_status": "Healthy", "connection_health": "99.7%"},
        {"id": "cfg_x", "channel_key": "x", "name": "X / Twitter Direct Messages API", "status": "API Access Required", "account_name": "@Nova5AI", "permissions": ["dm:read", "dm:write"], "webhook_status": "Pending Verification", "connection_health": "Action Required"},
        {"id": "cfg_li", "channel_key": "linkedin", "name": "LinkedIn Messaging API", "status": "API Access Required", "account_name": "Nova5 Org", "permissions": ["r_messaging", "w_messaging"], "webhook_status": "Pending Verification", "connection_health": "Action Required"},
        {"id": "cfg_web", "channel_key": "website", "name": "Website Chat Widget", "status": "Connected", "account_name": "app.nova5.ai Script Tag", "permissions": ["embed:active"], "webhook_status": "Healthy", "connection_health": "100% Active"}
    ]

    for cfg in integrations:
        db.add(IntegrationConfig(**cfg))

    # Seed AI Insights
    insights = [
        {"id": "ins_1", "category": "HIGH PRIORITY", "title": "3 Leads Show Strong Purchase Intent", "summary": "Marcus Vance (Aether Dynamics) and Sarah Chen (Nexus Health) requested pricing and enterprise demos via WhatsApp & Instagram.", "target_type": "lead", "target_id": "lead_101", "action_label": "Review Lead Scores"},
        {"id": "ins_2", "category": "CALL READY", "title": "2 Leads Qualified & Ready for AI Voice Call", "summary": "Marcus Vance and Sarah Chen have scores > 85. AI Voice Call eligibility verified.", "target_type": "call", "target_id": "lead_101", "action_label": "Initiate AI Voice Call"},
        {"id": "ins_3", "category": "CHANNEL ALERT", "title": "5 New Inbound Interactions Recorded", "summary": "Messages received across WhatsApp, Instagram, LinkedIn, and X. Unified identities mapped.", "target_type": "chat", "target_id": "lead_102", "action_label": "Open AI Chat"}
    ]

    for ins in insights:
        db.add(AIInsight(**ins))

    db.commit()
