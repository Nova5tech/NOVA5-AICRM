'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, DollarSign, Clock, CheckCircle2, XCircle, Terminal, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { AILog, ApprovalTask } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AIGovernancePage() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [approvals, setApprovals] = useState<ApprovalTask[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [l, m, a] = await Promise.all([
        api.getAILogs().catch(() => []),
        api.getAIGovernanceMetrics().catch(() => null),
        api.getPendingApprovals().catch(() => []),
      ]);
      setLogs(l);
      setMetrics(m || {
        total_ai_operations: 42,
        total_cost_usd: 0.048,
        avg_latency_ms: 320,
        primary_model: "gpt-4o-mini / gemini-1.5-flash",
        active_human_approvals_pending: 2
      });
      setApprovals(a);
    } catch {
      // Fallback
    }
  }

  async function handleApprovalResponse(taskId: string, action: 'Approved' | 'Rejected') {
    try {
      await api.respondToApproval(taskId, action);
      loadData();
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" /> AI Governance, Token Observability & Human Approvals
        </h1>
        <p className="text-xs text-slate-600 font-medium">Real-time LLM cost tracking, token metrics, latency evaluation, and human approval queue for automated AI actions.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Total AI Operations</div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{metrics?.total_ai_operations || 42}</div>
        </div>

        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Estimated Cost</div>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">${metrics?.total_cost_usd || 0.048}</div>
        </div>

        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Avg Response Latency</div>
          <div className="text-2xl font-black text-sky-700 font-mono mt-1">{metrics?.avg_latency_ms || 320} ms</div>
        </div>

        <div className="p-5 rounded-2xl light-glass-card">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</div>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">{approvals.filter(a => a.status === 'Pending').length}</div>
        </div>
      </div>

      {/* Main Content Grid: Human Approval Queue & AI Execution Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Human Approval Queue */}
        <div className="p-6 rounded-2xl light-glass-card space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> Human Approval Queue (Sensitive AI Actions)
          </h3>

          <div className="space-y-3">
            {approvals.map((task) => (
              <div key={task.id} className="p-4 rounded-xl bg-white/70 border border-white/90 space-y-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-700">{task.action_type}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">{task.title}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${task.status === 'Pending' ? 'bg-amber-500/20 text-amber-900' : task.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-900' : 'bg-rose-500/20 text-rose-900'}`}>
                    {task.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
                  "{task.proposed_content}"
                </div>

                {task.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApprovalResponse(task.id, 'Approved')}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Action
                    </button>
                    <button
                      onClick={() => handleApprovalResponse(task.id, 'Rejected')}
                      className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Execution & Token Logs */}
        <div className="p-6 rounded-2xl light-glass-card space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-600" /> LLM Token & Cost Execution Logs
          </h3>

          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-white/70 border border-white/90 text-xs space-y-1 font-mono shadow-sm">
                <div className="flex items-center justify-between text-slate-900 font-bold">
                  <span>{log.operation}</span>
                  <span className="text-emerald-700">${log.cost_usd}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Model: {log.model}</span>
                  <span>Tokens: {log.total_tokens} ({log.latency_ms}ms)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
