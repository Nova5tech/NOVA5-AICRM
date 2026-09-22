'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { AIInsight } from '@/lib/types';
import Link from 'next/link';

export default function AIIntelligencePage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    api.getAIInsights().then(setInsights).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-purple-600" /> AI Sales Intelligence Feed
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Automated insights, conversion signals, and risk warnings extracted across customer conversations.</p>
      </div>

      <div className="space-y-4">
        {insights.map((ins) => (
          <div key={ins.id} className="p-6 rounded-2xl light-glass-card space-y-3 shadow-sky-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${ins.category === 'HIGH PRIORITY' ? 'bg-rose-500/20 text-rose-900 border border-rose-400/40' : ins.category === 'ATTENTION REQUIRED' ? 'bg-amber-500/20 text-amber-900 border border-amber-400/40' : 'bg-sky-500/20 text-sky-900 border border-sky-400/40'}`}>
                  {ins.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">Impact Score: {ins.impact_score}/100</span>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-slate-900">{ins.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium max-w-3xl">{ins.summary}</p>

            <div className="pt-2 flex justify-end">
              <Link
                href={ins.related_entity_type === 'lead' ? '/leads' : ins.related_entity_type === 'deal' ? '/pipeline' : '/inbox'}
                className="px-4 py-2 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shadow-sky-glow hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>{ins.action_label || 'Review Insights'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
