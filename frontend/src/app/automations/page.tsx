'use client';

import React, { useState, useEffect } from 'react';
import { Workflow, Play, Plus, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { Automation } from '@/lib/types';

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [testLog, setTestLog] = useState<any>(null);

  useEffect(() => {
    api.getAutomations().then(setAutomations).catch(() => {});
  }, []);

  async function handleTestTrigger(id: string) {
    try {
      const res = await api.triggerAutomationTest(id);
      setTestLog(res);
      api.getAutomations().then(setAutomations);
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Workflow className="w-6 h-6 text-sky-600" /> Visual Workflow Automations
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Trigger -&gt; Condition -&gt; AI Action -&gt; System Action automated rule engine.</p>
        </div>
      </div>

      {testLog && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-900 space-y-1 shadow-sm">
          <div className="font-extrabold flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-700" /> Automation Trigger Test Succeeded!</div>
          {testLog.logs?.map((l: string, i: number) => (
            <div key={i} className="font-mono text-[11px] font-bold text-slate-800">• {l}</div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {automations.map((aut) => (
          <div key={aut.id} className="p-6 rounded-2xl light-glass-card space-y-4 shadow-sky-glass">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{aut.name}</h3>
                <span className="text-xs font-bold text-slate-500">Total Executions: {aut.total_runs} runs</span>
              </div>
              <button
                onClick={() => handleTestTrigger(aut.id)}
                className="px-4 py-2 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold flex items-center gap-2 shadow-sky-glow hover:scale-105 transition-transform"
              >
                <Play className="w-3.5 h-3.5" /> Test Rule Execution
              </button>
            </div>

            {/* Workflow Diagram */}
            <div className="p-4 rounded-xl bg-white/80 border border-sky-200 flex flex-wrap items-center gap-3 text-xs shadow-sm">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 font-mono text-slate-900 font-bold">
                <span className="text-[10px] text-sky-700 block font-extrabold">TRIGGER</span>
                {aut.trigger}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 font-mono text-slate-900 font-bold">
                <span className="text-[10px] text-purple-700 block font-extrabold">CONDITION</span>
                {aut.conditions[0]?.field} {aut.conditions[0]?.operator} {aut.conditions[0]?.value}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 font-mono text-slate-900 font-bold">
                <span className="text-[10px] text-emerald-700 block font-extrabold">ACTION</span>
                {aut.actions[0]?.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
