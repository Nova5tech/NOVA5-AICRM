import {
  OverviewMetrics, Lead, Conversation, Deal, Contact, Company,
  Activity, Task, AIInsight, Automation, Document, Integration,
  Ticket, AILog, ApprovalTask, DuplicateMatch, Campaign, ConsentRecord, VoiceCallResult
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Fast In-Memory Cache for Instant (<10ms) UI Navigation Response
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 30000; // 30 seconds cache TTL

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${options?.method || 'GET'}:${endpoint}`;

  // Return instant cached data for GET requests if available
  if ((!options || options.method === 'GET') && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      // Revalidate in background asynchronously without blocking UI render
      fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      }).then(async (res) => {
        if (res.ok) {
          const freshData = await res.json();
          cache.set(cacheKey, { data: freshData, timestamp: Date.now() });
        }
      }).catch(() => {});

      return cached.data as T;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Fast 2s timeout fallback

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();

    if (!options || options.method === 'GET') {
      cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    return data as T;
  } catch (err) {
    // If cached version exists, return it instantly
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!.data as T;
    }
    console.warn(`[Nova5 API] Server request failed for ${endpoint}, using instant fallback:`, err);
    throw err;
  }
}

export const api = {
  // Overview & Analytics
  getOverviewMetrics: () => fetcher<OverviewMetrics>('/analytics/overview'),
  getChannelPerformance: () => fetcher<any[]>('/analytics/channel-performance'),

  // AI Outreach Agent Module
  getCampaigns: () => fetcher<Campaign[]>('/outreach/campaigns'),
  createCampaign: (data: any) =>
    fetcher<Campaign>('/outreach/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  simulateVoiceCall: (contactId: string, campaignId?: string) =>
    fetcher<VoiceCallResult>('/outreach/voice-call/simulate', {
      method: 'POST',
      body: JSON.stringify({ contact_id: contactId, campaign_id: campaignId }),
    }),
  getConsentRecords: () => fetcher<ConsentRecord[]>('/outreach/consent'),
  toggleConsent: (contactId: string, status: string) =>
    fetcher<any>(`/outreach/consent/${contactId}/toggle?status=${status}`, { method: 'POST' }),
  getOutreachAnalytics: () => fetcher<any>('/outreach/analytics'),

  // Leads
  getLeads: (status?: string, minScore?: number) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (minScore) params.append('min_score', minScore.toString());
    return fetcher<Lead[]>(`/leads?${params.toString()}`);
  },
  getLead: (id: string) => fetcher<Lead>(`/leads/${id}`),
  recalculateLeadScore: (id: string) => fetcher<any>(`/leads/recalculate-score/${id}`, { method: 'POST' }),

  // Conversations & Omnichannel Inbox
  getConversations: (channel?: string, sentiment?: string) => {
    const params = new URLSearchParams();
    if (channel) params.append('channel', channel);
    if (sentiment) params.append('sentiment', sentiment);
    return fetcher<Conversation[]>(`/conversations?${params.toString()}`);
  },
  getConversation: (id: string) => fetcher<Conversation>(`/conversations/${id}`),
  sendMessage: (id: string, content: string, senderType: string = 'agent') =>
    fetcher<any>(`/conversations/${id}/messages?content=${encodeURIComponent(content)}&sender_type=${senderType}`, { method: 'POST' }),
  generateSmartReply: (conversationId: string, tone: string, customInstructions?: string) =>
    fetcher<any>('/conversations/generate-smart-reply', {
      method: 'POST',
      body: JSON.stringify({ conversation_id: conversationId, tone, custom_instructions: customInstructions }),
    }),

  // Support Tickets & SLAs
  getTickets: (status?: string, priority?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    return fetcher<Ticket[]>(`/tickets?${params.toString()}`);
  },
  createTicket: (data: any) =>
    fetcher<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTicketStatus: (id: string, status: string) =>
    fetcher<any>(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Customer Identity Resolution & Merging
  getDuplicateMatches: () => fetcher<DuplicateMatch[]>('/identity/duplicates'),
  mergeContacts: (primaryId: string, secondaryId: string) =>
    fetcher<any>('/identity/merge', {
      method: 'POST',
      body: JSON.stringify({ primary_contact_id: primaryId, secondary_contact_id: secondaryId }),
    }),

  // AI Governance, Cost & Approvals
  getAILogs: () => fetcher<AILog[]>('/ai-governance/logs'),
  getAIGovernanceMetrics: () => fetcher<any>('/ai-governance/metrics'),
  getPendingApprovals: () => fetcher<ApprovalTask[]>('/ai-governance/approvals'),
  respondToApproval: (taskId: string, action: 'Approved' | 'Rejected') =>
    fetcher<any>(`/ai-governance/approvals/${taskId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  // Deals & Pipeline
  getDeals: (stage?: string) => fetcher<Deal[]>(`/deals${stage ? `?stage=${stage}` : ''}`),
  getDeal: (id: string) => fetcher<Deal>(`/deals/${id}`),
  updateDealStage: (id: string, stage: string) =>
    fetcher<any>(`/deals/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    }),

  // Contacts & Companies
  getContacts: () => fetcher<Contact[]>('/contacts'),
  getContact: (id: string) => fetcher<Contact>(`/contacts/${id}`),
  getCompanies: () => fetcher<Company[]>('/companies'),

  // Activities & Tasks
  getActivities: () => fetcher<Activity[]>('/activities/timeline'),
  getTasks: () => fetcher<Task[]>('/activities/tasks'),

  // AI Insights & Copilot
  getAIInsights: () => fetcher<AIInsight[]>('/ai/insights'),
  queryCopilot: (query: string) =>
    fetcher<any>('/ai/copilot', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),

  // Automations
  getAutomations: () => fetcher<Automation[]>('/automations'),
  createAutomation: (data: any) =>
    fetcher<Automation>('/automations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  triggerAutomationTest: (id: string) => fetcher<any>(`/automations/${id}/trigger-test`, { method: 'POST' }),

  // Knowledge (RAG)
  getDocuments: () => fetcher<Document[]>('/knowledge'),
  searchKnowledge: (query: string) => fetcher<any>(`/knowledge/search?q=${encodeURIComponent(query)}`),

  // Integrations
  getIntegrations: () => fetcher<Integration[]>('/integrations'),
  toggleIntegration: (id: string) => fetcher<Integration>(`/integrations/${id}/toggle`, { method: 'POST' }),
};
