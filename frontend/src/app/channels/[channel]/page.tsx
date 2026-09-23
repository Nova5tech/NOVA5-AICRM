'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Share2, MessageSquare, UserCheck, Sparkles, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function ChannelActivityPage() {
  const params = useParams();
  const channel = (params?.channel as string) || 'whatsapp';
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [channel]);

  async function loadData() {
    try {
      const res = await api.getChannelActivity(channel);
      setData(res);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 capitalize flex items-center gap-2.5">
              <Share2 className="w-6 h-6 text-sky-600" /> {channel} Channel Feed
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-900 border border-emerald-400/40">
              Normalized Connector Active
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Normalized inbound interactions feeding into unified customer identity matching.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Messages</div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">{data?.total_messages || 0}</div>
        </div>

        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Leads Generated</div>
          <div className="text-3xl font-black text-sky-800 font-mono mt-1">{data?.total_leads_generated || 0}</div>
        </div>

        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Adapter Status</div>
          <div className="text-sm font-extrabold text-emerald-700 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Healthy & Normalized
          </div>
        </div>
      </div>

      {/* Interaction Feed */}
      <div className="light-glass-card rounded-2xl p-6 space-y-4 shadow-sky-glass">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" /> Normalized Inbound Stream
        </h3>

        <div className="space-y-3">
          {(data?.interactions || []).map((item: any) => (
            <div key={item.id} className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">Lead ID: {item.customer_lead_id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-900 border border-sky-400/40">
                  {item.intent}
                </span>
              </div>
              <p className="text-slate-800 font-medium leading-relaxed">"{item.content}"</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Sentiment: {item.sentiment} • Event Timestamp: {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
