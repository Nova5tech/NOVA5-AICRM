# NOVA5 AICRM — AI-Powered Customer Intelligence & Engagement Platform

[![Platform](https://img.shields.io/badge/Platform-Nova5%20AICRM-0284c7.svg)](https://github.com/Nova5tech/NOVA5-AICRM)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-000000.svg)](https://nextjs.org)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLAlchemy%202.0-009688.svg)](https://fastapi.tiangolo.com)
[![AI Engine](https://img.shields.io/badge/AI-Lead%20Scoring%20%7C%20RAG%20%7C%20Copilot-7c3aed.svg)](#features)

> **Nova5 AICRM** is an AI-native customer relationship and outbound engagement platform built to unify multi-channel customer communications, extract predictive sales intelligence, automate customer workflows, and run compliant voice & email campaigns.

---

## 🌟 Core Architecture & Capabilities

### 1. 🎯 AI Lead Intelligence & Predictive Scoring
- **0–100 Intent Scoring**: Decomposes lead engagement, company fit parameters, and communication intent into actionable scores.
- **Factor Breakdown & Explanations**: Transparent breakdown showing exact positive/negative intent factors and model explanations.

### 2. 📬 Omnichannel Inbox
- **Multi-Channel Aggregation**: WhatsApp Business API, Email (Google/Outlook), Website Live Chat, and Instagram Direct.
- **Real-Time Sentiment & Intent**: Automatic sentiment analysis (Positive, Neutral, Urgent) and buyer intent classification.
- **AI Smart Reply Generator**: Context-aware draft generator with configurable tone controls (Professional, Friendly, Concise, Persuasive, Empathetic).

### 3. 📊 Interactive Sales Pipeline & Deal Risk
- **Visual Kanban Board**: Drag/advance deal pipeline stages (New Lead $\rightarrow$ Won).
- **AI Engagement Risk Analysis**: Calculates deal risk level (High, Medium, Low) with specific risk reasons and recommended next actions.

### 4. 📞 AI Outreach Agent Module
- **AI Email Agent & Multi-Step Campaigns**: Automated sequence triggers with CRM context personalization.
- **Outbound AI Voice Agent**: Speech dialog simulator for automated voice qualification.
- **TRAI/DND Regulatory Safety Layer**: Strict compliance engine enforcing registered sender IDs (`NV5CRM-TRAI-882`), national DND registry filters, and consent records.

### 5. 🛠️ Platform Core Subsystems
- **360° Customer Profile**: Complete historical timeline, associated deals, and activity notes.
- **Support Ticket SLA System**: Priority ticket management with SLA resolution timers and breach warnings.
- **Customer Identity Resolution**: Intelligent duplicate matching and contact merging.
- **Visual Automations Engine**: Trigger $\rightarrow$ Condition $\rightarrow$ Action rule evaluator with live test execution.
- **RAG Knowledge Base**: Vector document chunk indexing for product docs, FAQs, and SLA policies.
- **AI Governance & Observability**: Token cost tracking, latency monitoring, and human-in-the-loop approval queues.
- **Conversational AI Assistant**: Natural-language copilot with grounded tool calling.

---

## 🎨 Design System: Light Blue Ice-Glassmorphism

Nova5 AICRM features a **Soft Light Blue Glassmorphism** design system with hardware-accelerated rendering:
- **Background**: Soft ambient gradient (`linear-gradient(135deg, #E0F2FE, #EFF6FF, #F0F9FF)`)
- **Cards & Containers**: Frosted glass (`light-glass-card`) with backdrop blur (`blur(8px)`), crisp slate typography, and vibrant sky accents (`#0284C7`).
- **Performance**: Sub-10ms response times with in-memory SWR caching and hardware-accelerated transitions.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (Next.js 14)

```bash
cd frontend
npm install
npm run dev
```
Application URL: `http://localhost:3000`

---

## 📁 Repository Structure

```text
NOVA5-AICRM/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # 13 REST API routes (leads, conversations, deals, etc.)
│   │   ├── ai/engine.py      # Lead scorer, RAG retriever, Smart reply & Copilot engine
│   │   ├── automation/       # Trigger -> Condition -> Action evaluator
│   │   ├── core/             # Database session & Enterprise seed generator
│   │   ├── models/domain.py  # 18 Async SQLAlchemy domain models
│   │   └── schemas/domain.py # Pydantic v2 schemas
│   └── main.py               # FastAPI entrypoint
│
└── frontend/
    ├── src/
    │   ├── app/              # 20 Next.js 14 App Router pages
    │   ├── components/       # Glassmorphic layout, modals & CRM widgets
    │   └── lib/              # API client with SWR cache, types, & utilities
    └── tailwind.config.js    # Glassmorphism tokens & vibrant sky gradients
```

---

## 🛡️ License & Compliance

Built for **Nova5 Technologies**. All outbound messaging and calling capabilities comply with TRAI DND regulations and regulatory consent standards.
