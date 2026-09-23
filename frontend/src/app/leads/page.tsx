'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCheck, Sparkles, RefreshCw, Info, PhoneCall, MessageSquare, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { CustomerLead } from '@/lib/types';

export default function AILeadsPage() {
  const [leads, setLeads] = useState<CustomerLead[]>([]);
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

  async function handleStatusChange(id: string, newStatus: string, e: React.ChangeEvent<HTMLSelectElement>) {
    e.stopPropagation();
    try {
      await api.updateLeadStatus(id, newStatus);
      await loadLeads();
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-sky-600" /> AI Lead Engine & Explainable Scoring
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Automated lead detection, extraction, explainable 0-100 scoring, and action triggers.</p>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="light-glass-card rounded-2xl overflow-hidden shadow-sky-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-sky-100/70 border-b border-white/80 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">Lead Opportunity</th>
                <th className="p-4">Source</th>
                <th className="p-4">Intent & Sentiment</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Status</th>
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
                          <div className="w-10 h-10 rounded-xl bg-vibrant-sky-gradient text-white flex items-center justify-center font-extrabold shadow-sky-glow">
                            {lead.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{lead.name}</h4>
                            <p className="text-[11px] text-slate-500 font-medium">{lead.job_role || 'Executive'} • {lead.company || 'Enterprise'}</p>
                            {lead.email && <span className="text-[10px] text-sky-700 font-mono font-bold block">{lead.email}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 capitalize">{lead.source_channel}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-900 border border-sky-400/40 block w-fit">
                            {lead.intent}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold block w-fit ${lead.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
                            {lead.sentiment} Sentiment
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-900 font-extrabold font-mono text-sm shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>{lead.lead_score}</span> / 100
                        </div>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-900 shadow-sm focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="In Discussion">In Discussion</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href="/chat"
                            className="p-2 rounded-xl bg-purple-500/20 text-purple-900 hover:bg-purple-500/30 border border-purple-400/40 shadow-sm"
                            title="Start AI Chat"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Link>
                          {lead.lead_score >= 75 && (
                            <Link
                              href="/calling"
                              className="p-2 rounded-xl bg-amber-500/20 text-amber-900 hover:bg-amber-500/30 border border-amber-400/40 shadow-sm"
                              title="Start AI Voice Call"
                            >
                              <PhoneCall className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={(e) => handleRecalculate(lead.id, e)}
                            disabled={recalculatingId === lead.id}
                            className="p-2 rounded-xl bg-sky-500/20 text-sky-900 hover:bg-sky-500/30 border border-sky-400/40 shadow-sm"
                            title="Recalculate AI Score"
                          >
                            <RefreshCw className={`w-4 h-4 ${recalculatingId === lead.id ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Score Factor Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-sky-50/70">
                        <td colSpan={6} className="p-5">
                          <div className="p-4.5 rounded-xl bg-white/90 border border-sky-200/80 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                              <h5 className="font-extrabold text-slate-900 flex items-center gap-2">
                                <Info className="w-4 h-4 text-sky-600" /> Explainable AI Score Drivers
                              </h5>
                              <span className="text-[11px] font-mono text-slate-500 font-bold">Confidence: {((lead.confidence_score || 0.9) * 100).toFixed(0)}%</span>
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
                              "{lead.score_explanation || 'Lead score calculated based on intent detection and contact verification.'}"
                            </p>
                            {lead.recommended_action && (
                              <div className="p-2.5 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shadow-sky-glow">
                                Recommended Next Action: {lead.recommended_action}
                              </div>
                            )}
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
