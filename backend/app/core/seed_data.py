import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.domain import (
    User, Company, Contact, Lead, Conversation, Message,
    Deal, Activity, Task, AIInsight, Automation, Document, Integration, Notification,
    Ticket, AILog, ApprovalTask, Campaign, ConsentRecord, VoiceCallResult
)

async def populate_seed_data(db: AsyncSession):
    res = await db.execute(select(User))
    if res.scalars().first():
        return # Seed data already present

    # 1. Seed Users
    users = [
        User(id="usr_1", email="alex.vance@nova5.ai", full_name="Alex Vance", role="Admin", avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
        User(id="usr_2", email="sarah.chen@nova5.ai", full_name="Sarah Chen", role="Manager", avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"),
        User(id="usr_3", email="michael.ross@nova5.ai", full_name="Michael Ross", role="Sales", avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"),
        User(id="usr_4", email="elena.rodriguez@nova5.ai", full_name="Elena Rodriguez", role="Support", avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"),
    ]
    db.add_all(users)

    # 2. Seed Companies
    companies = [
        Company(id="cmp_1", name="Aether Dynamics", domain="aetherdyn.com", industry="AI Robotics & Automation", size="500-1000", annual_revenue="$45M", website="https://aetherdyn.com", location="San Francisco, CA", health_score=94),
        Company(id="cmp_2", name="Nexus Health Technologies", domain="nexushealth.io", industry="Healthcare SaaS", size="200-500", annual_revenue="$18M", website="https://nexushealth.io", location="Boston, MA", health_score=88),
        Company(id="cmp_3", name="Hyperion Financial Systems", domain="hyperionfin.com", industry="Fintech & Banking", size="1000+", annual_revenue="$120M", website="https://hyperionfin.com", location="New York, NY", health_score=72),
        Company(id="cmp_4", name="Vortex Commerce Solutions", domain="vortexshop.co", industry="E-Commerce & Logistics", size="50-200", annual_revenue="$8M", website="https://vortexshop.co", location="Austin, TX", health_score=91),
        Company(id="cmp_5", name="Quantum Cloud Labs", domain="quantumcloud.tech", industry="Cloud Infrastructure", size="50-100", annual_revenue="$6M", website="https://quantumcloud.tech", location="Seattle, WA", health_score=82),
    ]
    db.add_all(companies)

    # 3. Seed Contacts
    contacts = [
        Contact(
            id="cnt_1", company_id="cmp_1", first_name="Marcus", last_name="Vance", email="marcus@aetherdyn.com", phone="+1 (415) 890-2341", title="VP of Revenue & Operations",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            channel_handles={"whatsapp": "+14158902341", "email": "marcus@aetherdyn.com"}
        ),
        Contact(
            id="cnt_2", company_id="cmp_2", first_name="Dr. Priya", last_name="Sharma", email="priya.sharma@nexushealth.io", phone="+1 (617) 451-9982", title="Chief Medical Information Officer",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            channel_handles={"whatsapp": "+16174519982", "website": "web_visitor_9982"}
        ),
        Contact(
            id="cnt_3", company_id="cmp_3", first_name="David", last_name="Sterling", email="d.sterling@hyperionfin.com", phone="+1 (212) 901-4433", title="Head of Enterprise IT Infrastructure",
            avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            channel_handles={"email": "d.sterling@hyperionfin.com", "linkedin": "david-sterling-fin"}
        ),
        Contact(
            id="cnt_4", company_id="cmp_4", first_name="Sophia", last_name="Martinez", email="sophia@vortexshop.co", phone="+1 (512) 349-1100", title="Director of Customer Success",
            avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
            channel_handles={"instagram": "@sophia_vortex", "whatsapp": "+15123491100"}
        ),
        Contact(
            id="cnt_5", company_id="cmp_5", first_name="Rahul", last_name="Verma", email="rahul.v@quantumcloud.tech", phone="+1 (206) 774-3209", title="CTO & Co-Founder",
            avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
            channel_handles={"whatsapp": "+12067743209", "email": "rahul.v@quantumcloud.tech"}
        ),
    ]
    db.add_all(contacts)

    # 4. Seed Leads
    leads = [
        Lead(
            id="led_1", contact_id="cnt_1", title="Enterprise CRM & AI Omnichannel Rollout", source="WhatsApp", status="Qualified", priority="High",
            lead_score=92, confidence=0.94, assigned_to="usr_3",
            score_breakdown={"Engagement": 28, "Company Fit": 24, "Website Activity": 22, "Conversation Intent": 18},
            score_explanation="High purchase intent detected from recent WhatsApp inquiry regarding 150+ seats.",
            next_best_action="Send formal 150-seat enterprise proposal and schedule closing call with Marcus Vance."
        ),
        Lead(
            id="led_2", contact_id="cnt_2", title="Healthcare Compliance AI Workspace", source="Website Chat", status="New", priority="High",
            lead_score=84, confidence=0.89, assigned_to="usr_2",
            score_breakdown={"Engagement": 22, "Company Fit": 26, "Website Activity": 20, "Conversation Intent": 16},
            score_explanation="Strong company fit in Healthcare sector with immediate HIPAA inquiry.",
            next_best_action="Send HIPAA vector security compliance packet to Dr. Priya Sharma."
        ),
    ]
    db.add_all(leads)

    # 5. Seed Conversations & Messages
    c1 = Conversation(
        id="cnv_1", contact_id="cnt_1", channel="whatsapp", channel_account="+1 (800) NOVA5-AI", status="Open", assigned_to="usr_3",
        ai_summary="Marcus requested a formal quote for 150 enterprise seats with custom AI RAG module integration.",
        sentiment="Positive", intent="Pricing Inquiry", urgency="High",
        extracted_action_items=["Draft enterprise custom proposal ($64,000/yr)"],
        suggested_response="Hi Marcus, I've prepared the custom 150-seat enterprise proposal.",
        tags=["Enterprise", "150+ Seats", "AI RAG"]
    )
    db.add_all([c1])

    m1 = Message(id="msg_1", conversation_id="cnv_1", sender_type="customer", sender_name="Marcus Vance", content="Hi Alex, can we get pricing for 150 enterprise licenses?")
    m2 = Message(id="msg_2", conversation_id="cnv_1", sender_type="agent", sender_name="Michael Ross", content="Hi Marcus! Putting together the custom proposal right now.")
    db.add_all([m1, m2])

    # 6. Seed Deals
    deals = [
        Deal(
            id="del_1", title="Aether Dynamics - 150 Seat AI CRM Rollout", company_id="cmp_1", lead_id="led_1",
            value=64000.0, stage="Proposal", probability=80, expected_close_date="2026-10-15", owner_id="usr_3",
            ai_risk_level="Low", ai_risk_reasons=["High executive engagement"],
            ai_recommended_action="Send final contract via DocuSign and schedule close call.", days_in_stage=3
        ),
    ]
    db.add_all(deals)

    # 7. Seed AI Outreach Campaigns, Consent Records & Voice Call Results
    campaigns = [
        Campaign(
            id="cmpg_1", name="Q3 Enterprise Lead Outreach & Voice Qualification", status="Active",
            audience_filter="Lead Score > 75",
            sequence_steps=[
                {"day": 0, "channel": "Email", "action": "Initial AI Personalized Introduction"},
                {"day": 2, "channel": "Email", "action": "Follow-up Case Study Packet"},
                {"day": 4, "channel": "VoiceCall", "action": "Outbound AI Voice Agent Qualification Call"}
            ],
            max_contacts=150, total_engaged=84, total_qualified=62, meetings_booked=28
        ),
        Campaign(
            id="cmpg_2", name="Healthcare Compliance & RAG AI Demo Outreach", status="Active",
            audience_filter="Industry == Healthcare",
            sequence_steps=[
                {"day": 0, "channel": "Email", "action": "HIPAA Vector RAG Architecture Deck"},
                {"day": 3, "channel": "VoiceCall", "action": "Outbound Voice Agent Call to CMIO"}
            ],
            max_contacts=75, total_engaged=42, total_qualified=31, meetings_booked=14
        ),
    ]
    db.add_all(campaigns)

    consents = [
        ConsentRecord(id="cns_1", contact_id="cnt_1", channel="VoiceCall", consent_status="Consented", consent_source="Inbound Web Contact Form", trai_sender_id="NV5CRM-TRAI-882"),
        ConsentRecord(id="cns_2", contact_id="cnt_2", channel="VoiceCall", consent_status="Consented", consent_source="Website Live Chat Opt-In", trai_sender_id="NV5CRM-TRAI-882"),
        ConsentRecord(id="cns_3", contact_id="cnt_3", channel="VoiceCall", consent_status="OptedOut", consent_source="Unsubscribe Link", trai_sender_id="NV5CRM-TRAI-882"),
    ]
    db.add_all(consents)

    calls = [
        VoiceCallResult(
            id="vcall_1", contact_id="cnt_1", campaign_id="cmpg_1", call_status="Completed", duration_sec=112,
            transcript=[
                {"speaker": "AI Voice Agent", "text": "Hello Marcus! Calling on behalf of Nova5 AI regarding your 150-seat enterprise evaluation."},
                {"speaker": "Marcus Vance", "text": "Hi! Yes, we need custom ERP integration."},
                {"speaker": "AI Voice Agent", "text": "Understood! Shall I schedule a live technical architecture walkthrough tomorrow at 11 AM?"},
                {"speaker": "Marcus Vance", "text": "Yes, please send the invite."}
            ],
            summary="AI Voice Agent conducted 112s call with Marcus Vance. Confirmed 150 enterprise seat intent and scheduled technical demo.",
            intent="High Purchase Intent", sentiment="Positive", qualification_status="Qualified",
            requirements="150 Enterprise Seats, ERP REST Integration", objections="Technical ERP compatibility confirmation requested",
            recommended_next_action="Schedule 20-min live technical architecture demo",
            lead_score_before=88, lead_score_after=95, escalated_to_human=False
        ),
    ]
    db.add_all(calls)

    # 8. Seed Tickets, AI Logs, Approvals, Activities, Tasks, Automations, Docs, Integrations, Notifications
    tickets = [
        Ticket(
            id="tkt_1", contact_id="cnt_2", conversation_id="cnv_1", title="HIPAA Vector Encryption Audit Inquiry",
            issue_description="Dr. Priya requested formal SOC2 Type II and HIPAA data isolation verification for patient RAG searches.",
            status="In Progress", priority="High", assignee_id="usr_4", sla_due_hours=12,
            ai_summary="Customer inquiring about patient data isolation in LLM RAG vector index.",
            ai_suggested_resolution="Provide HIPAA compliance whitepaper and schedule security architect call."
        ),
    ]
    db.add_all(tickets)

    ai_logs = [
        AILog(id="log_1", operation="lead_scoring", model="gpt-4o-mini", prompt_tokens=140, completion_tokens=45, total_tokens=185, cost_usd=0.0009, latency_ms=280, status="Success"),
    ]
    db.add_all(ai_logs)

    approvals = [
        ApprovalTask(
            id="app_1", action_type="send_email", title="Automated Enterprise Proposal Email to Marcus Vance",
            proposed_content="Dear Marcus, Attached is the formal 150-seat Nova5 AI CRM enterprise proposal ($64,000/yr).",
            target_contact_id="cnt_1", status="Pending"
        ),
    ]
    db.add_all(approvals)

    activities = [
        Activity(id="act_1", type="WhatsApp", title="WhatsApp message received from Marcus Vance", description="High purchase intent detected: Requested 150 seat enterprise quote.", contact_id="cnt_1", company_id="cmp_1", deal_id="del_1", performed_by="Marcus Vance"),
    ]
    db.add_all(activities)

    tasks = [
        Task(id="tsk_1", title="Send 150-seat Enterprise Proposal to Marcus (Aether Dyn)", due_date="Today, 5:00 PM", priority="Critical", status="Pending", assignee_id="usr_3", contact_id="cnt_1", deal_id="del_1", is_ai_recommended=True),
    ]
    db.add_all(tasks)

    insights = [
        AIInsight(id="ins_1", category="HIGH PRIORITY", title="3 leads show strong purchase intent on WhatsApp & Web Chat", summary="Aether Dynamics, Vortex Commerce, and Nexus Health have engaged in 8+ interactions. Estimated value: $128,000.", impact_score=95, related_entity_type="lead", related_entity_id="led_1", action_label="Review High-Intent Leads"),
    ]
    db.add_all(insights)

    automations = [
        Automation(id="aut_1", name="High-Priority Lead Auto-Assignment", trigger="score_changed", conditions=[{"field": "lead_score", "operator": ">", "value": 80}], actions=[{"type": "assign_user", "target": "Senior Sales Rep"}], is_active=True, total_runs=42),
    ]
    db.add_all(automations)

    documents = [
        Document(id="doc_1", title="Nova5 AI CRM - Enterprise Platform Specs & SLAs", category="Product Doc", content="Nova5 AI CRM provides enterprise-grade AI intelligence and RAG vector search across customer channels.", chunk_count=4, status="Indexed"),
    ]
    db.add_all(documents)

    integrations = [
        Integration(id="int_1", name="WhatsApp Business API", category="Communication", status="Connected", account_connected="+1 (800) 555-NOVA5", last_sync="2 mins ago", icon_key="whatsapp"),
    ]
    db.add_all(integrations)

    notifications = [
        Notification(id="ntf_1", title="High Priority Lead Alert", message="Marcus Vance (Aether Dynamics) reached out via WhatsApp. Lead Score: 92/100.", type="ai_alert", is_read=False),
    ]
    db.add_all(notifications)

    await db.commit()
    print("Seed data updated with AI Outreach Module entities.")
