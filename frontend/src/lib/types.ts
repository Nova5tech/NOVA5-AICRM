export interface CustomerLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  job_role?: string;
  source_channel: string;
  status: string;
  lead_score: number;
  confidence_score: number;
  score_breakdown: Record<string, number>;
  score_explanation?: string;
  recommended_action?: string;
  product_interest?: string;
  requirements?: string;
  objections?: string;
  intent: string;
  sentiment: string;
  assigned_to: string;
  is_ready_for_call: boolean;
  has_opted_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChannelInteraction {
  id: string;
  customer_lead_id: string;
  channel: string;
  external_user_id?: string;
  message_id?: string;
  content: string;
  direction: string;
  sentiment: string;
  intent: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  customer_lead_id: string;
  sender_type: 'user' | 'ai_agent' | 'human_agent';
  sender_name: string;
  content: string;
  intent_detected?: string;
  sentiment_detected?: string;
  extracted_info?: Record<string, any>;
  is_escalated: boolean;
  timestamp: string;
}

export interface VoiceCall {
  id: string;
  customer_lead_id: string;
  objective: string;
  call_status: string;
  duration_sec: number;
  transcript: Array<{ speaker: string; text: string }>;
  summary: string;
  intent: string;
  sentiment: string;
  qualification_status: string;
  requirements_extracted?: string;
  objections_raised?: string;
  recommended_next_step?: string;
  lead_score_before: number;
  lead_score_after: number;
  escalated_to_human: boolean;
  timestamp: string;
}

export interface IntegrationConfig {
  id: string;
  channel_key: string;
  name: string;
  status: string;
  account_name?: string;
  permissions: string[];
  last_sync_at: string;
  webhook_status: string;
  connection_health: string;
}

export interface AIInsight {
  id: string;
  category: string;
  title: string;
  summary: string;
  target_type: 'lead' | 'chat' | 'call';
  target_id: string;
  action_label: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  high_intent_leads: number;
  chat_conversations: number;
  ai_conversations: number;
  calls_made: number;
  calls_connected: number;
  qualified_calls: number;
  meetings_generated: number;
  conversion_rate: number;
  channel_breakdown: Record<string, number>;
  ai_priorities: AIInsight[];
}
