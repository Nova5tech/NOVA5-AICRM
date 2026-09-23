'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, UserCheck, AlertTriangle, User, RefreshCw, PhoneCall } from 'lucide-react';
import { api } from '@/lib/api';
import { CustomerLead, ChatMessage } from '@/lib/types';

export default function AIChatbotPage() {
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<CustomerLead | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
        loadHistory(data[0].id);
      }
    } catch {
      // Fallback
    }
  }

  async function loadHistory(leadId: string) {
    try {
      const history = await api.getChatHistory(leadId);
      setMessages(history);
    } catch {
      setMessages([]);
    }
  }

  function handleSelectLead(lead: CustomerLead) {
    setSelectedLead(lead);
    loadHistory(lead.id);
  }

  async function handleSendMessage() {
    if (!inputMessage.trim()) return;
    const msgText = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        customer_lead_id: selectedLead?.id,
        customer_name: selectedLead?.name || 'Prospect',
        channel: selectedLead?.source_channel || 'website',
        message: msgText
      });

      // Reload chat history & updated lead score
      if (selectedLead) {
        loadHistory(selectedLead.id);
      }
      loadLeads();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in relative z-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-purple-600" /> AI Conversational Chatbot
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Grounding AI responses with product docs, automatic lead generation, and human escalation.</p>
        </div>
      </div>

      {/* Workspace Grid: Left Lead Context (1/3), Right Chat Interface (2/3) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Lead Conversation Context */}
        <div className="lg:col-span-4 light-glass-card rounded-2xl flex flex-col overflow-hidden shadow-sky-glass">
          <div className="p-3.5 border-b border-white/80 bg-sky-100/60 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Conversations & Context ({leads.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-sky-100/80">
            {leads.map((ld) => {
              const isSelected = selectedLead?.id === ld.id;
              return (
                <div
                  key={ld.id}
                  onClick={() => handleSelectLead(ld)}
                  className={`p-4 cursor-pointer transition-all duration-75 ${isSelected ? 'bg-sky-500/15 border-l-4 border-l-sky-600' : 'hover:bg-white/80'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ld.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{ld.company || 'Enterprise'} • {ld.source_channel}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-black font-mono bg-sky-500/20 text-sky-900 border border-sky-400/40">
                      {ld.lead_score}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-900 border border-sky-400/40">
                      {ld.intent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Chatbot Dialog Box */}
        <div className="lg:col-span-8 light-glass-card rounded-2xl flex flex-col overflow-hidden shadow-sky-glass">
          {/* Thread Header */}
          <div className="p-4 border-b border-white/80 flex items-center justify-between bg-sky-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vibrant-sky-gradient text-white flex items-center justify-center font-extrabold shadow-sky-glow">
                {selectedLead?.name.substring(0, 2).toUpperCase() || 'AI'}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{selectedLead?.name || 'Prospect Customer'}</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedLead?.product_interest || 'AI CRM Platform'} • {selectedLead?.source_channel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-900 text-xs font-black font-mono shadow-sm">
                Score: {selectedLead?.lead_score || 50}/100
              </div>
            </div>
          </div>

          {/* Messages Scroll Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender_type === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-700">{msg.sender_name}</span>
                  </div>
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      isUser
                        ? 'bg-white/90 border border-sky-200 text-slate-900 rounded-tr-none shadow-sm'
                        : 'bg-vibrant-sky-gradient text-white rounded-tl-none shadow-sky-glow font-semibold'
                    }`}
                  >
                    {msg.content}
                    {msg.is_escalated && (
                      <div className="mt-2 p-2 rounded-xl bg-rose-500/30 text-white font-extrabold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Human Escalation Triggered
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-sky-800 font-bold animate-pulse font-mono">
                <Sparkles className="w-4 h-4 text-sky-600" /> AI Chatbot reasoning & retrieving grounded answers...
              </div>
            )}
          </div>

          {/* Message Reply Box */}
          <div className="p-4 border-t border-white/80 bg-sky-50/60 flex gap-2">
            <input
              type="text"
              placeholder="Ask product question or test chatbot dialog..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-xl light-glass-input text-slate-900 text-xs placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-5 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-sky-glow"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
