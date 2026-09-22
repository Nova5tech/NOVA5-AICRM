'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Sparkles, RefreshCw, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { Lead } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [recalculatingId, setRecalculatingId] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch {
      // Fallback
    }
  }

  async function handleRecalculate(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRecalculatingId(id);
    try {
      await api.recalculateLeadScore(id);
      await loadLeads();
    } finally {
      setRecalculatingId(null);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-sky-600" /> AI Lead Intelligence & Scoring
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Predictive AI scoring decomposing engagement, company fit, and purchase intent.</p>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="light-glass-card rounded-2xl overflow-hidden shadow-sky-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-sky-100/60 border-b border-white/80 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">Lead Opportunity</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Confidence</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/80">
              {leads.map((lead) => {
                const isExpanded = expandedLeadId === lead.id;
                return (
                  <React.Fragment key={lead.id}>
                    <tr
                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      className="hover:bg-white/80 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={lead.contact?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                            alt="Avatar"
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-400/40"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900">{lead.title}</h4>
                            <p className="text-[11px] text-slate-500 font-medium">{lead.contact?.first_name} {lead.contact?.last_name} • {lead.contact?.company?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{lead.source}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${lead.status === 'Qualified' ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-400/40' : 'bg-slate-200/80 text-slate-800'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-900 font-extrabold font-mono text-sm">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>{lead.lead_score}</span> / 100
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-600">{(lead.confidence * 100).toFixed(0)}%</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => handleRecalculate(lead.id, e)}
                          disabled={recalculatingId === lead.id}
                          className="px-3 py-1.5 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shadow-sky-glow hover:scale-105 transition-transform inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${recalculatingId === lead.id ? 'animate-spin' : ''}`} />
                          <span>Recalculate</span>
                        </button>
                      </td>
                    </tr>

                    {/* Score Factor Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-sky-50/70">
                        <td colSpan={6} className="p-5">
                          <div className="p-4.5 rounded-xl bg-white/90 border border-sky-200/80 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                              <h5 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <Info className="w-4 h-4 text-sky-600" /> AI Score Factor Breakdown
                              </h5>
                              <span className="text-[11px] font-mono text-slate-500 font-bold">Model Version: v2.4-Hybrid</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              {Object.entries(lead.score_breakdown || {}).map(([factor, pts]) => (
                                <div key={factor} className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/60">
                                  <div className="text-slate-600 text-[10px] font-bold">{factor}</div>
                                  <div className="text-sm font-black text-sky-700 font-mono mt-0.5">+{pts} pts</div>
                                </div>
                              ))}
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed pt-1">
                              <span className="font-extrabold text-slate-900">AI Explanation: </span>
                              "{lead.score_explanation || 'High purchase intent detected based on recent conversation signals, strong company fit criteria, and active engagement.'}"
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
