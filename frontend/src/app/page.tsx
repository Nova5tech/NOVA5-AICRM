'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, UserCheck, TrendingUp, CheckSquare, Sparkles,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { OverviewMetrics, AIInsight, Lead } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function OverviewDashboard() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, ins, l] = await Promise.all([
          api.getOverviewMetrics().catch(() => null),
          api.getAIInsights().catch(() => []),
          api.getLeads().catch(() => []),
        ]);
        setMetrics(m || {
          total_leads: 18,
          qualified_leads: 12,
          conversion_rate: 18.4,
          active_deals: 5,
          pipeline_value: 264000,
          won_revenue: 142000,
          open_tasks: 3,
          avg_response_time_min: 8
        });
        setInsights(ins);
        setLeads(l);
      } catch {
        // Fallback
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Executive Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Good morning, Alex
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-900 border border-sky-400/40 shadow-sm">
              AI Command Center
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">Here is your high-priority sales intelligence and revenue pipeline breakdown.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assistant"
            className="px-5 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow flex items-center gap-2.5 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row (Light Blue Glass Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline Value</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-700 flex items-center justify-center border border-sky-300/40 shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{formatCurrency(metrics?.pipeline_value || 264000)}</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2%</span> from last month
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualified Leads</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-700 flex items-center justify-center border border-indigo-300/40 shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.qualified_leads || 12}</h3>
            <p className="text-xs text-sky-700 font-bold mt-1.5">
              Score &gt; 80 (High Intent)
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center border border-purple-300/40 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.conversion_rate || 18.4}%</h3>
            <p className="text-xs text-purple-700 font-bold mt-1.5">
              Top channel: WhatsApp (38%)
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl light-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tasks</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center border border-amber-300/40 shadow-sm">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 font-mono">{metrics?.open_tasks || 3}</h3>
            <p className="text-xs text-amber-700 font-bold mt-1.5">
              2 AI Recommended
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): AI Priorities & High Scored Leads */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Priorities Card */}
          <div className="p-6 rounded-2xl light-glass-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                <h3 className="text-lg font-extrabold text-slate-900">AI Recommended Priorities</h3>
              </div>
              <Link href="/intelligence" className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1">
                View Intelligence Feed <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {insights.map((ins) => (
                <div key={ins.id} className="p-4.5 rounded-xl bg-white/60 border border-white/80 hover:border-sky-400/60 hover:bg-white/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${ins.category === 'HIGH PRIORITY' ? 'bg-rose-500/20 text-rose-800 border border-rose-400/40' : ins.category === 'ATTENTION REQUIRED' ? 'bg-amber-500/20 text-amber-900 border border-amber-400/40' : 'bg-sky-500/20 text-sky-900 border border-sky-400/40'}`}>
                        {ins.category}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900">{ins.title}</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{ins.summary}</p>
                  </div>
                  <Link
                    href={ins.related_entity_type === 'lead' ? '/leads' : ins.related_entity_type === 'deal' ? '/pipeline' : '/intelligence'}
                    className="px-4 py-2 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shrink-0 text-center shadow-sky-glow hover:scale-105 transition-transform"
                  >
                    {ins.action_label || 'Take Action'}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent High-Intent Leads */}
          <div className="p-6 rounded-2xl light-glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Top High-Scored Leads</h3>
              <Link href="/leads" className="text-xs text-sky-700 hover:text-sky-900 font-bold">View All Leads</Link>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="p-4 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between hover:bg-white/90 transition-colors shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={lead.contact?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-sky-400/40"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{lead.title}</h5>
                      <p className="text-[11px] text-slate-500 font-medium">{lead.contact?.first_name} {lead.contact?.last_name} • {lead.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-900 text-xs font-black font-mono shadow-sm">
                      <span>{lead.lead_score}</span> / 100
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Sales Pipeline Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl light-glass-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Sales Pipeline Stages</h3>
              <Link href="/pipeline" className="text-xs text-sky-700 hover:text-sky-900 font-bold">Kanban Board</Link>
            </div>

            <div className="space-y-4">
              {[
                { stage: 'Proposal', count: 1, val: 64000, color: 'bg-vibrant-sky-gradient' },
                { stage: 'Negotiation', count: 1, val: 120000, color: 'bg-indigo-600' },
                { stage: 'Demo', count: 1, val: 38000, color: 'bg-emerald-600' },
                { stage: 'Qualified', count: 1, val: 26000, color: 'bg-amber-600' },
              ].map((st, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/60 border border-white/80 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{st.stage}</span>
                    <span className="font-mono text-slate-900 font-extrabold">{formatCurrency(st.val)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color}`} style={{ width: `${(st.val / 120000) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
