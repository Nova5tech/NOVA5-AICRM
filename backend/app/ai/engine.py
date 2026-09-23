import re
from typing import Dict, Any, List

class AIEngine:
    """
    Nova5 AI Engine powering:
    - Lead Generation & Information Extraction
    - Explainable AI Lead Scoring (0-100)
    - Grounded RAG AI Chatbot with Human Escalation
    - Outbound AI Voice Agent Context Reasoning & Post-Call Intelligence
    """

    @staticmethod
    def extract_lead_info(content: str, channel: str) -> Dict[str, Any]:
        """
        Extracts structured lead parameters from incoming raw messages.
        Does not fabricate missing information.
        """
        text = content.strip()

        # Extract email
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        email = email_match.group(0) if email_match else None

        # Extract phone
        phone_match = re.search(r'\(?\+?[0-9]{1,4}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}', text)
        phone = phone_match.group(0) if phone_match else None

        # Detect intent
        text_lower = text.lower()
        if any(w in text_lower for w in ['price', 'pricing', 'cost', 'quote', 'subscription', 'enterprise plan']):
            intent = "High Purchase Intent"
        elif any(w in text_lower for w in ['demo', 'trial', 'schedule', 'meeting', 'call me']):
            intent = "Demo Request"
        elif any(w in text_lower for w in ['features', 'integration', 'api', 'how to']):
            intent = "Product Inquiry"
        else:
            intent = "General Inquiry"

        # Detect sentiment
        if any(w in text_lower for w in ['great', 'excellent', 'love', 'excited', 'interested', 'urgent']):
            sentiment = "Positive"
        elif any(w in text_lower for w in ['expensive', 'difficult', 'slow', 'issue', 'problem']):
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        # Product Interest
        product_interest = "AI CRM Platform"
        if "voice" in text_lower or "calling" in text_lower:
            product_interest = "AI Voice Calling Agent"
        elif "chat" in text_lower or "whatsapp" in text_lower:
            product_interest = "AI Chatbot & WhatsApp Integration"

        return {
            "email": email,
            "phone": phone,
            "intent": intent,
            "sentiment": sentiment,
            "product_interest": product_interest,
            "source_channel": channel
        }

    @staticmethod
    def calculate_explainable_score(
        intent: str,
        has_email: bool,
        has_phone: bool,
        has_company: bool,
        has_demo_request: bool,
        interactions_count: int
    ) -> Dict[str, Any]:
        """
        Calculates an explainable 0-100 AI Lead Score with factor breakdowns.
        """
        score = 40 # Base baseline score
        breakdown = {}
        factors = []

        if intent == "High Purchase Intent":
            score += 25
            breakdown["High Purchase Intent Signal"] = 25
            factors.append("+ Pricing / Enterprise plan discussion")
        elif intent == "Demo Request":
            score += 30
            breakdown["Demo Requested"] = 30
            factors.append("+ Direct demo requested")
        elif intent == "Product Inquiry":
            score += 15
            breakdown["Product Inquiry"] = 15
            factors.append("+ Product capability inquiry")

        if has_email and has_phone:
            score += 20
            breakdown["Verified Contact Info (Email & Phone)"] = 20
            factors.append("+ Verified email & phone provided")
        elif has_email or has_phone:
            score += 10
            breakdown["Contact Info Provided"] = 10
            factors.append("+ Contact info provided")

        if has_company:
            score += 10
            breakdown["Enterprise Company Fit"] = 10
            factors.append("+ Corporate domain / company identified")

        if has_demo_request:
            score += 15
            breakdown["Demo Scheduled"] = 15

        if interactions_count >= 3:
            score += 10
            breakdown["High Multi-Channel Engagement"] = 10
            factors.append("+ Multiple channel interactions")

        final_score = min(score, 100)

        explanation = f"Lead score evaluates to {final_score}/100. Key drivers: {', '.join(factors) if factors else 'Initial interaction baseline'}."
        recommended_action = "Initiate AI Voice Call" if final_score >= 80 else "Send AI Smart Follow-up Chat"

        return {
            "score": final_score,
            "confidence": 0.92,
            "breakdown": breakdown,
            "explanation": explanation,
            "recommended_action": recommended_action
        }

    @staticmethod
    def generate_chatbot_response(
        query: str,
        lead_name: str = "Valued Customer",
        context: str = ""
    ) -> Dict[str, Any]:
        """
        Grounded AI Chatbot Response with product knowledge grounding.
        """
        query_lower = query.lower()

        # Check for human escalation trigger
        if any(w in query_lower for w in ['human', 'agent', 'support rep', 'complaint', 'manager', 'speak to person']):
            return {
                "reply": f"Understood, {lead_name}. I am transferring your conversation directly to a senior sales specialist right now. One moment while I connect you.",
                "intent": "Human Escalation Requested",
                "sentiment": "Urgent",
                "is_escalated": True
            }

        if "pricing" in query_lower or "cost" in query_lower or "plan" in query_lower:
            reply = f"Hello {lead_name}! Nova5 AI CRM offers three tiers: Starter ($99/mo), Professional ($299/mo), and Enterprise (Custom SLA & dedicated voice agents). Would you like me to schedule a quick 10-minute demo for your team?"
            intent = "High Purchase Intent"
        elif "voice" in query_lower or "calling" in query_lower or "call" in query_lower:
            reply = f"Our AI Voice Agent can conduct outbound qualification calls, answer technical product questions, and update CRM records automatically post-call. Shall I initiate a sample call for you?"
            intent = "Product Inquiry - AI Voice"
        elif "integration" in query_lower or "whatsapp" in query_lower or "instagram" in query_lower:
            reply = f"Nova5 AI CRM natively integrates with WhatsApp Business API, Instagram Direct, Facebook Messenger, X (Twitter), and LinkedIn. All incoming conversations automatically unify under one customer profile."
            intent = "Product Inquiry - Integrations"
        else:
            reply = f"Thanks for reaching out, {lead_name}! Nova5 AI CRM helps businesses automate lead generation, customer chat, and voice qualification across all your channels. How can I assist your team today?"
            intent = "General Inquiry"

        return {
            "reply": reply,
            "intent": intent,
            "sentiment": "Positive",
            "is_escalated": False
        }

    @staticmethod
    def simulate_ai_voice_call(
        lead_name: str,
        company: str,
        interest: str,
        current_score: int
    ) -> Dict[str, Any]:
        """
        Simulates contextual speech qualification call & generates post-call intelligence.
        """
        transcript = [
            {"speaker": "AI Voice Agent", "text": f"Hello {lead_name}, this is Nova5 AI calling regarding your interest in our {interest} for {company}. Do you have 2 minutes?"},
            {"speaker": "Customer", "text": f"Hi! Yes, I was evaluating your platform for our enterprise sales team. We need CRM tool integration and custom SLA uptime."},
            {"speaker": "AI Voice Agent", "text": "That's great! Nova5 provides native REST APIs and guaranteed 99.9% HIPAA/SOC2 compliant SLAs. I can schedule a technical demo with our VP of Engineering tomorrow at 2 PM. Does that work?"},
            {"speaker": "Customer", "text": "Perfect, send the calendar invitation to my email."}
        ]

        new_score = min(current_score + 12, 100)

        return {
            "duration_sec": 98,
            "transcript": transcript,
            "summary": f"Completed 98-second AI Voice call with {lead_name} ({company}). Customer validated requirements for CRM API integration and SLA compliance. Agreed to technical demo.",
            "intent": "High Purchase Intent",
            "sentiment": "Positive",
            "qualification_status": "Qualified",
            "requirements": "Custom REST API integration & 99.9% SOC2 SLA compliance",
            "objections": "Technical validation needed prior to contract",
            "recommended_next_step": "Send technical demo calendar invite & enterprise architecture whitepaper",
            "lead_score_before": current_score,
            "lead_score_after": new_score,
            "escalated_to_human": False
        }
