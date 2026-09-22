'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox as InboxIcon, Sparkles, Send, Paperclip, MessageSquare,
  Mail, Phone, ShieldCheck, CheckCircle2, User, ChevronRight, Bot
} from 'lucide-react';
import { api } from '@/lib/api';
import { Conversation, Message } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { CustomerProfileModal } from '@/components/crm/CustomerProfileModal';

export default function OmnichannelInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [activeChannel, setActiveChannel] = useState<string>('all');
  const [replyText, setReplyText] = useState('');
  const [isSmartReplyOpen, setIsSmartReplyOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [aiGeneratedReply, setAiGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContactModal, setSelectedContactModal] = useState<any>(null);

  useEffect(() => {
    loadConversations();
  }, [activeChannel]);

  async function loadConversations() {
    try {
      const convs = await api.getConversations(activeChannel === 'all' ? undefined : activeChannel);
      setConversations(convs);
      if (convs.length > 0 && !selectedConv) {
        setSelectedConv(convs[0]);
      }
    } catch {
      // Fallback
    }
  }

  async function handleSendMessage() {
    if (!replyText.trim() || !selectedConv) return;
    const textToSend = replyText;
    setReplyText('');

    try {
      await api.sendMessage(selectedConv.id, textToSend, 'agent');
      // Reload current conversation
      const updated = await api.getConversation(selectedConv.id);
      setSelectedConv(updated);
      loadConversations();
    } catch {
      // Error handling
    }
  }

  async function handleGenerateSmartReply() {
    if (!selectedConv) return;
    setIsGenerating(true);
    try {
      const res = await api.generateSmartReply(selectedConv.id, selectedTone);
      setAiGeneratedReply(res.reply);
    } finally {
      setIsGenerating(false);
    }
  }

  function applySmartReply() {
    setReplyText(aiGeneratedReply);
    setIsSmartReplyOpen(false);
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4 animate-fade-in relative z-10">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <InboxIcon className="w-6 h-6 text-sky-600" /> Unified Omnichannel Inbox
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Aggregated customer conversations with real-time AI sentiment & intent extraction.</p>
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl light-glass-card text-xs">
          {['all', 'whatsapp', 'website', 'email', 'instagram'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 rounded-xl capitalize font-extrabold transition-all duration-75 ${activeChannel === ch ? 'bg-vibrant-sky-gradient text-white shadow-sky-glow' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Split Workspace: Left Conversation List (1/3), Middle Thread View (2/3) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Conversation List */}
        <div className="lg:col-span-4 light-glass-card rounded-2xl flex flex-col overflow-hidden shadow-sky-glass">
          <div className="p-3.5 border-b border-white/80 bg-sky-100/60 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Conversations ({conversations.length})
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-sky-100/80">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-4 cursor-pointer transition-all duration-75 ${isSelected ? 'bg-sky-500/15 border-l-4 border-l-sky-600' : 'hover:bg-white/80'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={conv.contact?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                        alt="Avatar"
                        className="w-9 h-9 rounded-xl object-cover shrink-0 ring-2 ring-sky-400/40"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{conv.contact?.first_name} {conv.contact?.last_name}</h4>
                        <span className="text-[10px] text-sky-800 uppercase font-mono font-bold">{conv.channel}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-medium">{formatTime(conv.last_message_at)}</span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {conv.ai_summary || conv.messages[conv.messages.length - 1]?.content}
                  </p>

                  <div className="flex items-center gap-2 mt-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${conv.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-400/40' : 'bg-slate-200/80 text-slate-800'}`}>
                      {conv.sentiment}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-900 border border-sky-400/40">
                      {conv.intent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation View & AI Copilot Tools */}
        {selectedConv ? (
          <div className="lg:col-span-8 light-glass-card rounded-2xl flex flex-col overflow-hidden shadow-sky-glass">
            {/* Thread Header */}
            <div className="p-4 border-b border-white/80 flex items-center justify-between bg-sky-50/70">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConv.contact?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-sky-400/40"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedConv.contact?.first_name} {selectedConv.contact?.last_name}</h3>
                  <p className="text-xs text-slate-600 font-medium">{selectedConv.contact?.company?.name || 'Enterprise'} • {selectedConv.channel}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedContactModal(selectedConv.contact)}
                className="px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-sky-900 border border-sky-200 shadow-sm transition-transform hover:scale-105"
              >
                View 360° Customer Profile
              </button>
            </div>

            {/* AI Conversation Summary Drawer */}
            <div className="px-4 py-2.5 bg-sky-500/10 border-b border-sky-400/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-sky-950 font-bold">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span>AI Intelligence:</span>
                <span className="text-slate-700 font-medium truncate">{selectedConv.ai_summary}</span>
              </div>
              <button
                onClick={() => setIsSmartReplyOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shrink-0 hover:scale-105 transition-transform shadow-sky-glow flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" /> Generate AI Reply
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedConv.messages.map((msg) => {
                const isCustomer = msg.sender_type === 'customer';
                return (
                  <div key={msg.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-700">{msg.sender_name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div
                      className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                        isCustomer
                          ? 'bg-white/90 border border-sky-200/80 text-slate-900 rounded-tl-none shadow-sm'
                          : 'bg-vibrant-sky-gradient text-white rounded-tr-none shadow-sky-glow font-semibold'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Reply Box */}
            <div className="p-4 border-t border-white/80 bg-sky-50/60 flex gap-2">
              <input
                type="text"
                placeholder="Type your message or click 'Generate AI Reply'..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl light-glass-input text-slate-900 text-xs placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-sky-glow"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Smart Reply Generation Modal */}
      {isSmartReplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg light-glass-card rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-600" /> AI Response Generator
              </h3>
              <button onClick={() => setIsSmartReplyOpen(false)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-700 font-bold">Select Tone of Voice</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Professional', 'Friendly', 'Concise', 'Persuasive', 'Empathetic'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTone(t)}
                    className={`py-2 rounded-xl font-bold border transition-all ${selectedTone === t ? 'bg-sky-500/20 border-sky-400 text-sky-900' : 'bg-white/60 border-sky-100 text-slate-700 hover:bg-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateSmartReply}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow hover:scale-[1.02] transition-transform"
            >
              {isGenerating ? 'Generating contextual reply...' : 'Generate Reply'}
            </button>

            {aiGeneratedReply && (
              <div className="p-3.5 rounded-xl bg-white/90 border border-sky-200 text-xs text-slate-800 leading-relaxed font-medium shadow-sm">
                <div className="text-[10px] text-sky-700 font-extrabold mb-1">Generated Draft</div>
                {aiGeneratedReply}
                <button
                  onClick={applySmartReply}
                  className="mt-3 w-full py-2 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow"
                >
                  Insert Reply into Composer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <CustomerProfileModal
        contact={selectedContactModal}
        isOpen={!!selectedContactModal}
        onClose={() => setSelectedContactModal(null)}
      />
    </div>
  );
}
