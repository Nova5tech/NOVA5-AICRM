'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    api.getChannelPerformance().then(setChannels).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-emerald-600" /> Executive Business Analytics
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Actionable business intelligence, channel conversion attribution, and revenue trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance Breakdown */}
        <div className="p-6 rounded-2xl light-glass-card space-y-4 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-sky-600" /> Omnichannel Performance Attribution
          </h3>

          <div className="space-y-3">
            {[
              { channel: 'WhatsApp Business API', pct: 38, count: 42, color: 'bg-emerald-600' },
              { channel: 'Email (Google & Outlook)', pct: 27, count: 30, color: 'bg-vibrant-sky-gradient' },
              { channel: 'Website Live Chat', pct: 18, count: 20, color: 'bg-indigo-600' },
              { channel: 'Instagram Direct', pct: 10, count: 11, color: 'bg-purple-600' },
              { channel: 'Other & REST API', pct: 7, count: 8, color: 'bg-slate-600' },
            ].map((ch, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/80 border border-sky-200 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{ch.channel}</span>
                  <span className="font-mono text-sky-900 font-black">{ch.pct}% ({ch.count} convs)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${ch.color}`} style={{ width: `${ch.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="p-6 rounded-2xl light-glass-card space-y-4 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Executive Revenue Summary
          </h3>

          <div className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-1.5 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Active Pipeline</div>
            <div className="text-3xl font-black text-slate-900 font-mono">{formatCurrency(264000)}</div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-1.5 shadow-sm">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Won Revenue (YTD)</div>
            <div className="text-3xl font-black text-emerald-700 font-mono">{formatCurrency(142000)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
