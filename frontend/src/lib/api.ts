import {
  DashboardMetrics, CustomerLead, ChannelInteraction, ChatMessage,
  VoiceCall, IntegrationConfig, AIInsight
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Fast In-Memory Cache for Instant UI Navigation Response (<10ms)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15s cache TTL

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${options?.method || 'GET'}:${endpoint}`;

  if ((!options || options.method === 'GET') && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      // Async revalidate
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
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
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
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!.data as T;
    }
    console.warn(`[Nova5 API] Server request fallback for ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // 1. AI Dashboard
  getDashboardMetrics: () => fetcher<DashboardMetrics>('/dashboard'),

  // 2. AI Lead Generation
  getLeads: (status?: string, minScore?: number, source?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (minScore) params.append('min_score', minScore.toString());
    if (source) params.append('source', source);
    return fetcher<CustomerLead[]>(`/leads?${params.toString()}`);
  },
  getLead: (id: string) => fetcher<CustomerLead>(`/leads/${id}`),
  recalculateLeadScore: (id: string) => fetcher<any>(`/leads/recalculate-score/${id}`, { method: 'POST' }),
  updateLeadStatus: (id: string, status: string) => fetcher<any>(`/leads/${id}/status?status=${encodeURIComponent(status)}`, { method: 'PATCH' }),

  // 3. AI Chatbot
  sendChatMessage: (data: { customer_lead_id?: string; customer_name?: string; channel: string; message: string }) =>
    fetcher<any>('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getChatHistory: (leadId: string) => fetcher<ChatMessage[]>(`/chat/history/${leadId}`),

  // 4. AI Calling Agent
  initiateVoiceCall: (leadId: string, objective: string = 'Lead Qualification') =>
    fetcher<any>('/calling/initiate', {
      method: 'POST',
      body: JSON.stringify({ customer_lead_id: leadId, objective }),
    }),
  getCallHistory: (leadId: string) => fetcher<VoiceCall[]>(`/calling/history/${leadId}`),

  // 5. Omnichannel Integration Layer
  ingestEvent: (data: { channel: string; external_user_id: string; text: string }) =>
    fetcher<any>('/channels/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getChannelActivity: (channel: string) => fetcher<any>(`/channels/${channel}/activity`),
  getIntegrations: () => fetcher<IntegrationConfig[]>('/integrations'),
  toggleIntegration: (channelKey: string) => fetcher<IntegrationConfig>(`/integrations/${channelKey}/toggle`, { method: 'POST' }),
};
