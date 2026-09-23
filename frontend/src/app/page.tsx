'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck, Sparkles, PhoneCall, MessageSquare, TrendingUp,
  ArrowUpRight, ChevronRight, Share2, DollarSign, Bot, Activity
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardMetrics } from '@/lib/types';

export default function AIDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch {
      // Fallback fallback if API loading
    }
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Header Command Center Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              AI Command Center
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-900 border border-sky-400/40 shadow-sm">
              Live Integrated Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">Real-time customer acquisition, lead qualification, AI chats, and voice call metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-5 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Launch AI Chatbot</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Row (Live Shared Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total & New Leads</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-700 flex items-center justify-center border border-sky-300/40 shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.total_leads || 5}</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics?.new_leads || 2} new today</span> ({metrics?.conversion_rate || 40}% conversion)
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI-Qualified Leads</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center border border-emerald-300/40 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.qualified_leads || 2}</h3>
            <p className="text-xs text-emerald-700 font-bold mt-1.5">
              Score &ge; 80 ({metrics?.high_intent_leads || 2} High Intent)
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Chat Conversations</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center border border-purple-300/40 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.chat_conversations || 4}</h3>
            <p className="text-xs text-purple-700 font-bold mt-1.5">
              {metrics?.ai_conversations || 2} Automated AI replies
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calls Made & Connected</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center border border-amber-300/40 shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.calls_connected || 1} / {metrics?.calls_made || 1}</h3>
            <p className="text-xs text-amber-700 font-bold mt-1.5">
              {metrics?.qualified_calls || 1} Qualified ({metrics?.meetings_generated || 2} Demos Booked)
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Priorities & Channel Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): AI Priorities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl light-glass-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="text-lg font-extrabold text-slate-900">AI Priorities & Action Feed</h3>
              </div>
              <Link href="/leads" className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1">
                View All Leads <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {(metrics?.ai_priorities || []).map((ins) => (
                <div key={ins.id} className="p-4.5 rounded-xl bg-white/70 border border-white/90 hover:border-sky-400/60 hover:bg-white/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${ins.category === 'HIGH PRIORITY' ? 'bg-rose-500/20 text-rose-800 border border-rose-400/40' : ins.category === 'CALL READY' ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-400/40' : 'bg-sky-500/20 text-sky-900 border border-sky-400/40'}`}>
                        {ins.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900">{ins.title}</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{ins.summary}</p>
                  </div>
                  <Link
                    href={ins.target_type === 'call' ? '/calling' : ins.target_type === 'chat' ? '/chat' : '/leads'}
                    className="px-4 py-2 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shrink-0 text-center shadow-sky-glow hover:scale-105 transition-transform"
                  >
                    {ins.action_label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Channel Source Activity */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl light-glass-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Channel Activity</h3>
              <Link href="/integrations" className="text-xs text-sky-700 hover:text-sky-900 font-bold">Connectors</Link>
            </div>

            <div className="space-y-3.5">
              {Object.entries(metrics?.channel_breakdown || { whatsapp: 2, instagram: 1, linkedin: 1, x: 1 }).map(([channel, count]) => (
                <Link
                  key={channel}
                  href={`/channels/${channel}`}
                  className="p-3.5 rounded-xl bg-white/70 border border-white/90 hover:bg-white flex items-center justify-between transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-700 flex items-center justify-center font-bold uppercase text-[11px]">
                      {channel.substring(0, 2)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 capitalize">{channel}</h5>
                      <p className="text-[10px] text-slate-500 font-medium">Inbound Interactions</p>
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-sky-900 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40">
                    {count} Leads
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
