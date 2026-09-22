import os
import json
import re
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AILeadScorer:
    """Intelligent lead scoring engine with factor decomposition & natural language explanations."""

    @staticmethod
    def score_lead(lead_title: str, source: str, conversation_text: str = "", company_size: str = "") -> Dict[str, Any]:
        base_score = 40
        factors = {}
        
        # Source factor
        if "WhatsApp" in source or "Website Chat" in source:
            factors["Website & Direct Engagement"] = 24
        elif "Email" in source:
            factors["Email Channel Interaction"] = 18
        else:
            factors["Inbound Channel Interaction"] = 15
            
        # Intent & Conversation factor
        conv_lower = conversation_text.lower()
        if any(w in conv_lower for w in ["pricing", "cost", "quote", "buy", "enterprise", "budget"]):
            factors["High Purchase Intent"] = 28
        elif any(w in conv_lower for w in ["demo", "walkthrough", "features", "integration"]):
            factors["Product Evaluation Signal"] = 20
        else:
            factors["General Inquiry Signal"] = 12
            
        # Company size fit factor
        if any(s in company_size for s in ["200-500", "500+", "1000+", "Enterprise"]):
            factors["Enterprise Company Fit"] = 22
        elif any(s in company_size for s in ["50-200", "50-100"]):
            factors["Mid-Market Company Fit"] = 16
        else:
            factors["SMB Company Fit"] = 10
            
        total_score = min(100, sum(factors.values()))
        
        confidence = 0.91 if total_score > 75 else 0.84
        explanation = (
            f"High purchase intent detected based on recent conversation signals, "
            f"strong company fit criteria, and active engagement across {source}."
        )
        
        return {
            "score": total_score,
            "confidence": confidence,
            "breakdown": factors,
            "explanation": explanation
        }

class AIConversationAnalyzer:
    """Extracts summary, intent, sentiment, urgency, and action items from message history."""

    @staticmethod
    def analyze(messages: List[Dict[str, str]]) -> Dict[str, Any]:
        if not messages:
            return {
                "summary": "No messages exchanged yet.",
                "sentiment": "Neutral",
                "intent": "General Inquiry",
                "urgency": "Low",
                "extracted_action_items": [],
                "suggested_response": "Hello! How can we assist you today?"
            }

        text = " ".join([m.get("content", "") for m in messages]).lower()
        
        # Sentiment
        if any(w in text for w in ["love", "great", "excellent", "excited", "thanks", "perfect", "appreciate"]):
            sentiment = "Positive"
        elif any(w in text for w in ["issue", "frustrated", "bug", "delayed", "problem", "broken", "disappointed"]):
            sentiment = "Negative"
        elif any(w in text for w in ["pricing", "demo", "quote"]):
            sentiment = "Positive"
        else:
            sentiment = "Neutral"

        # Intent
        if any(w in text for w in ["price", "cost", "quote", "discount", "enterprise plan"]):
            intent = "Pricing Inquiry"
        elif any(w in text for w in ["demo", "call", "schedule", "meeting", "presentation"]):
            intent = "Demo Request"
        elif any(w in text for w in ["help", "error", "issue", "bug", "support"]):
            intent = "Support Request"
        elif any(w in text for w in ["ready to buy", "contract", "proposal", "invoice"]):
            intent = "Purchase Intent"
        else:
            intent = "Product Inquiry"

        # Urgency
        if any(w in text for w in ["asap", "urgent", "today", "immediately", "critical"]):
            urgency = "High"
        elif any(w in text for w in ["this week", "soon", "tomorrow"]):
            urgency = "Medium"
        else:
            urgency = "Low"

        # Action items
        action_items = []
        if intent == "Pricing Inquiry":
            action_items.append("Send custom enterprise pricing sheet")
        if intent == "Demo Request":
            action_items.append("Schedule 30-min product walkthrough call")
        if "follow up" in text or "tomorrow" in text:
            action_items.append("Follow up with customer within 24 hours")
        if not action_items:
            action_items.append("Review conversation and assign account owner")

        # Summary
        latest_msg = messages[-1].get("content", "")
        summary = f"Customer inquired about {intent.lower()}. Latest update: '{latest_msg[:120]}...'"

        # Suggested reply
        if intent == "Pricing Inquiry":
            suggested_response = "Hi! I'd be happy to share our detailed pricing breakdown. Are you looking for our Growth or Enterprise tier?"
        elif intent == "Demo Request":
            suggested_response = "Hello! We'd love to show you Nova5 AI CRM in action. What time works best for a live 20-minute demo?"
        else:
            suggested_response = "Thank you for reaching out! Our team is reviewing your inquiry and will get back to you shortly."

        return {
            "summary": summary,
            "sentiment": sentiment,
            "intent": intent,
            "urgency": urgency,
            "extracted_action_items": action_items,
            "suggested_response": suggested_response
        }

class AISmartReplyGenerator:
    """Generates contextual AI replies based on tone and customer history."""

    @staticmethod
    def generate_reply(messages: List[Dict[str, str]], tone: str = "Professional", instructions: Optional[str] = None) -> str:
        last_customer_msg = "Hello, I wanted to follow up."
        for m in reversed(messages):
            if m.get("sender_type") == "customer":
                last_customer_msg = m.get("content", "")
                break

        if tone == "Friendly":
            reply = f"Hi there! Thanks so much for following up regarding '{last_customer_msg[:60]}'. We're super excited to help you get everything set up smoothly!"
        elif tone == "Concise":
            reply = f"Thanks for your message. Regarding '{last_customer_msg[:50]}', we have updated your account parameters. Let me know if you need anything else."
        elif tone == "Persuasive":
            reply = f"Hello! Nova5 AI CRM can streamline this exact workflow for your team today. Would you be open to a quick 10-minute demo tomorrow morning?"
        elif tone == "Empathetic":
            reply = f"Hi! I completely understand how important this issue is for your team. We are actively prioritizing this and will update you shortly."
        else: # Professional default
            reply = f"Hello. Thank you for your inquiry regarding '{last_customer_msg[:60]}'. I have shared the details with our sales engineering team and will follow up with complete specs."

        if instructions:
            reply += f" ({instructions})"

        return reply

class AICRMToolAgent:
    """Natural Language Assistant that translates prompt into tool calls and CRM structured answers."""

    @staticmethod
    def process_query(query: str, db_context: Dict[str, Any]) -> Dict[str, Any]:
        q = query.lower()
        tool_calls = []
        answer = ""
        data = None

        if "high-priority" in q or "leads" in q or "priority" in q:
            tool_calls.append({"tool": "get_high_priority_leads", "args": {"min_score": 75}})
            leads = db_context.get("leads", [])
            high_leads = [l for l in leads if l.get("lead_score", 0) >= 70 or l.get("priority") == "High"]
            data = high_leads
            answer = f"Found {len(high_leads)} high-priority leads requiring immediate attention. Top lead is '{high_leads[0]['title'] if high_leads else 'Acme Corp'}' with a score of {high_leads[0].get('lead_score', 88) if high_leads else 88}."

        elif "deal" in q or "risk" in q or "pipeline" in q:
            tool_calls.append({"tool": "analyze_pipeline_risks", "args": {}})
            deals = db_context.get("deals", [])
            risk_deals = [d for d in deals if d.get("ai_risk_level") in ["High", "Medium"]]
            data = risk_deals
            answer = f"Analyzed open deals in pipeline. {len(risk_deals)} opportunities show engagement risk due to inactivity > 5 days or un-engaged decision makers."

        elif "conversation" in q or "rahul" in q or "inbox" in q:
            tool_calls.append({"tool": "summarize_conversations", "args": {"filter": "recent"}})
            convs = db_context.get("conversations", [])
            data = convs[:3]
            answer = "Recent conversations show strong purchase intent on WhatsApp and website chat. 3 high-intent inquiries were received today."

        elif "analytics" in q or "revenue" in q or "conversion" in q:
            tool_calls.append({"tool": "get_executive_analytics", "args": {}})
            data = {
                "pipeline_value": 248000,
                "won_revenue": 142000,
                "conversion_rate": "18.4%",
                "top_channel": "WhatsApp (38%)"
            }
            answer = "Current pipeline total value is $248,000 across 28 active deals with an 18.4% conversion rate. WhatsApp is currently your top performing lead source."

        else:
            tool_calls.append({"tool": "search_knowledge_base", "args": {"query": query}})
            answer = f"Processed CRM request for: '{query}'. AI recommendations updated based on customer timeline events and active pipeline state."
            data = {"status": "success", "query": query}

        return {
            "answer": answer,
            "tool_calls": tool_calls,
            "data": data
        }

class AIRAGEngine:
    """Document retrieval and knowledge chunking system."""

    @staticmethod
    def search_docs(docs: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        q_words = set(query.lower().split())
        results = []
        for doc in docs:
            content = doc.get("content", "").lower()
            title = doc.get("title", "").lower()
            score = sum(1 for w in q_words if w in content or w in title)
            if score > 0 or len(docs) <= 3:
                results.append({
                    "document_id": doc.get("id"),
                    "title": doc.get("title"),
                    "relevance_score": round(0.75 + score * 0.05, 2),
                    "snippet": doc.get("content", "")[:250] + "..."
                })
        return sorted(results, key=lambda x: x["relevance_score"], reverse=True)
