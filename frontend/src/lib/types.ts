export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  annual_revenue?: string;
  website?: string;
  location?: string;
  health_score: number;
  created_at: string;
}

export interface Contact {
  id: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title?: string;
  avatar_url?: string;
  channel_handles: Record<string, string>;
  is_merged?: boolean;
  merged_into_id?: string;
  company?: Company;
  created_at: string;
}

// --- AI OUTREACH AGENT MODULE TYPES ---

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  audience_filter: string;
  sequence_steps: any[];
  max_contacts: number;
  total_engaged: number;
  total_qualified: number;
  meetings_booked: number;
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  contact_id: string;
  channel: string;
  consent_status: 'Consented' | 'OptedOut' | 'DND';
  consent_source: string;
  trai_sender_id: string;
  last_contacted_at?: string;
  created_at: string;
}

export interface VoiceCallResult {
  id: string;
  contact_id: string;
  campaign_id?: string;
  call_status: 'Completed' | 'Escalated' | 'Unanswered';
  duration_sec: number;
  transcript: { speaker: string; text: string }[];
  summary: string;
  intent: string;
  sentiment: string;
  qualification_status: string;
  requirements?: string;
  objections?: string;
  recommended_next_action?: string;
  lead_score_before: number;
  lead_score_after: number;
  escalated_to_human: boolean;
  created_at: string;
}

export interface Ticket {
  id: string;
  contact_id: string;
  conversation_id?: string;
  title: string;
  issue_description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee_id?: string;
  sla_due_hours: number;
  ai_summary?: string;
  ai_suggested_resolution?: string;
  contact?: Contact;
  created_at: string;
}

export interface AILog {
  id: string;
  operation: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  latency_ms: number;
  status: string;
  timestamp: string;
}

export interface ApprovalTask {
  id: string;
  action_type: string;
  title: string;
  proposed_content: string;
  target_contact_id?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface DuplicateMatch {
  contact1: Contact;
  contact2: Contact;
  match_reason: string;
  confidence_score: number;
}

export interface Lead {
  id: string;
  contact_id: string;
  title: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  lead_score: number;
  confidence: number;
  score_breakdown: Record<string, number>;
  score_explanation?: string;
  next_best_action?: string;
  assigned_to?: string;
  contact?: Contact;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'agent' | 'ai' | 'system';
  sender_name: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  is_internal_note?: boolean;
}

export interface Conversation {
  id: string;
  contact_id: string;
  channel: 'website' | 'email' | 'whatsapp' | 'instagram' | 'linkedin' | 'telegram';
  channel_account?: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  assigned_to?: string;
  last_message_at: string;
  ai_summary?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
  intent: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  extracted_action_items: string[];
  suggested_response?: string;
  tags: string[];
  contact?: Contact;
  messages: Message[];
}

export interface Deal {
  id: string;
  title: string;
  company_id?: string;
  lead_id?: string;
  value: number;
  currency: string;
  stage: 'New Lead' | 'Contacted' | 'Qualified' | 'Demo' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  probability: number;
  expected_close_date?: string;
  owner_id?: string;
  ai_risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  ai_risk_reasons: string[];
  ai_recommended_action?: string;
  days_in_stage: number;
  company?: Company;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  contact_id?: string;
  company_id?: string;
  deal_id?: string;
  performed_by?: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  due_date?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee_id?: string;
  contact_id?: string;
  deal_id?: string;
  is_ai_recommended: boolean;
  created_at: string;
}

export interface AIInsight {
  id: string;
  category: 'HIGH PRIORITY' | 'ATTENTION REQUIRED' | 'TREND' | 'DEAL RISK';
  title: string;
  summary: string;
  impact_score: number;
  related_entity_type?: string;
  related_entity_id?: string;
  action_label?: string;
  created_at: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  conditions: any[];
  actions: any[];
  is_active: boolean;
  total_runs: number;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  content: string;
  chunk_count: number;
  status: string;
  created_at: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Disconnected' | 'Pending Config';
  account_connected?: string;
  last_sync?: string;
  icon_key?: string;
}

export interface OverviewMetrics {
  total_leads: number;
  qualified_leads: number;
  conversion_rate: number;
  active_deals: number;
  pipeline_value: number;
  won_revenue: number;
  open_tasks: number;
  avg_response_time_min: number;
}
