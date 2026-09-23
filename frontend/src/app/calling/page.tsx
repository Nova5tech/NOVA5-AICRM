'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, Sparkles, Activity, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { api } from '@/lib/api';
import { CustomerLead, VoiceCall } from '@/lib/types';

export default function AICallingAgentPage() {
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [callObjective, setCallObjective] = useState<string>('Lead Qualification');
  const [isCalling, setIsCalling] = useState(false);
  const [callResult, setCallResult] = useState<any | null>(null);
  const [callHistory, setCallHistory] = useState<VoiceCall[]>([]);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const data = await api.getLeads();
      setLeads(data);
      if (data.length > 0) {
        setSelectedLeadId(data[0].id);
        loadCallHistory(data[0].id);
      }
    } catch {
      // Fallback
    }
  }

  async function loadCallHistory(leadId: string) {
    try {
      const history = await api.getCallHistory(leadId);
      setCallHistory(history);
    } catch {
      setCallHistory([]);
    }
  }

  function handleSelectLead(leadId: string) {
    setSelectedLeadId(leadId);
    loadCallHistory(leadId);
  }

  async function handleInitiateCall() {
    if (!selectedLeadId) return;
    setIsCalling(true);
    setCallResult(null);

    try {
      const res = await api.initiateVoiceCall(selectedLeadId, callObjective);
      setCallResult(res);
      loadCallHistory(selectedLeadId);
      loadLeads();
    } catch (err: any) {
      alert(err.message || 'Call failed eligibility / opt-out validation check.');
    } finally {
      setIsCalling(false);
    }
  }

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <PhoneCall className="w-6 h-6 text-amber-600" /> Outbound AI Voice Calling Agent
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Context-driven speech qualification, real-time transcript logging, and post-call intelligence.</p>
        </div>
      </div>

      {/* Main Grid: Launcher & Call Intelligence (5/12 & 7/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context-Driven Call Launcher */}
        <div className="lg:col-span-5 p-6 rounded-2xl light-glass-card space-y-5 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-sky-600" /> Initiate Outbound Speech Qualification
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Target Customer / Lead</label>
            <select
              value={selectedLeadId}
              onChange={(e) => handleSelectLead(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-900 shadow-sm focus:outline-none"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.company || 'Enterprise'}) — Score: {l.lead_score}/100
                </option>
              ))}
            </select>
          </div>

          {selectedLead && (
            <div className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-2 text-xs shadow-sm">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Retrieved CRM Context</div>
              <div className="font-extrabold text-slate-900">{selectedLead.name} ({selectedLead.job_role || 'Executive'})</div>
              <div className="text-slate-700">Company: <span className="font-bold">{selectedLead.company || 'Enterprise'}</span></div>
              <div className="text-slate-700">Product Interest: <span className="font-bold">{selectedLead.product_interest}</span></div>
              <div className="text-slate-700">Current Intent: <span className="font-bold text-sky-700">{selectedLead.intent}</span></div>
              <div className="text-slate-700">Lead Score: <span className="font-black font-mono text-sky-900">{selectedLead.lead_score}/100</span></div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Call Objective</label>
            <select
              value={callObjective}
              onChange={(e) => setCallObjective(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-sky-200 text-xs font-bold text-slate-900 shadow-sm focus:outline-none"
            >
              <option value="Lead Qualification">Lead Qualification</option>
              <option value="Demo Scheduling">Demo Scheduling</option>
              <option value="Product Inquiry Follow-up">Product Inquiry Follow-up</option>
            </select>
          </div>

          <button
            onClick={handleInitiateCall}
            disabled={isCalling || !selectedLeadId}
            className="w-full py-3.5 rounded-xl bg-vibrant-sky-gradient text-white font-extrabold text-xs shadow-sky-glow flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <PhoneCall className={`w-4 h-4 ${isCalling ? 'animate-bounce' : ''}`} />
            {isCalling ? 'Connecting Speech Pipeline...' : 'Initiate AI Voice Call'}
          </button>
        </div>

        {/* Right Column: Real-time Transcript & Post-Call Intelligence */}
        <div className="lg:col-span-7 p-6 rounded-2xl light-glass-card space-y-4 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" /> Speech Transcript & Call Intelligence
          </h3>

          {callResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs">
                <span className="font-extrabold text-emerald-900">Call Status: Completed ({callResult.duration_sec}s)</span>
                <span className="font-black font-mono text-indigo-900">Score: {callResult.lead_score_before} &rarr; {callResult.lead_score_after} (+12 pts)</span>
              </div>

              {/* Speech Transcript */}
              <div className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-2.5 max-h-64 overflow-y-auto text-xs shadow-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speech-to-Text Live Transcript</div>
                {callResult.transcript.map((line: any, idx: number) => (
                  <div key={idx} className="space-y-0.5">
                    <span className={`text-[10px] font-bold ${line.speaker === 'AI Voice Agent' ? 'text-sky-700' : 'text-purple-700'}`}>{line.speaker}:</span>
                    <p className="text-slate-800 font-medium leading-relaxed">"{line.text}"</p>
                  </div>
                ))}
              </div>

              {/* Call Intelligence Summary */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-2">
                <div className="font-extrabold text-sky-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" /> Extracted Intelligence:
                </div>
                <div className="text-slate-800 font-medium"><span className="font-bold">Requirements:</span> {callResult.requirements_extracted}</div>
                <div className="text-slate-800 font-medium"><span className="font-bold">Recommended Step:</span> {callResult.recommended_next_step}</div>
              </div>
            </div>
          ) : callHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-600">Past Call History for {selectedLead?.name}:</div>
              {callHistory.map((call) => (
                <div key={call.id} className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-2 text-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{call.objective} ({call.duration_sec}s)</span>
                    <span className="font-black font-mono text-emerald-700">{call.qualification_status}</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{call.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-medium">
              Select a lead and click "Initiate AI Voice Call" to simulate outbound voice qualification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
