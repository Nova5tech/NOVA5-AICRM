'use client';

import React, { useState, useEffect } from 'react';
import { LifeBuoy, Clock, Sparkles, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Ticket } from '@/lib/types';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const data = await api.getTickets();
      setTickets(data);
    } catch {
      // Fallback
    }
  }

  async function handleStatusChange(ticketId: string, status: string) {
    try {
      await api.updateTicketStatus(ticketId, status);
      loadTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: status as any });
      }
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-600" /> Customer Support Tickets & SLAs
          </h1>
          <p className="text-xs text-slate-600 font-medium">Ticket management linked directly to omnichannel conversations and AI suggested resolutions.</p>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            onClick={() => setSelectedTicket(tkt)}
            className="p-5 rounded-2xl light-glass-card space-y-4 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tkt.priority === 'High' || tkt.priority === 'Critical' ? 'bg-rose-500/20 text-rose-900 border border-rose-400/40' : 'bg-sky-500/20 text-sky-900 border border-sky-400/40'}`}>
                    {tkt.priority} Priority
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tkt.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-900' : 'bg-amber-500/20 text-amber-900'}`}>
                    {tkt.status}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mt-2">{tkt.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{tkt.contact?.first_name} {tkt.contact?.last_name} • {tkt.contact?.company?.name || 'Customer'}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-600" /> SLA: {tkt.sla_due_hours}h
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">{tkt.issue_description}</p>

            {/* AI Resolution Hint */}
            {tkt.ai_suggested_resolution && (
              <div className="p-3 rounded-xl bg-white/70 border border-white/90 text-xs space-y-1 shadow-sm">
                <div className="text-[10px] text-purple-700 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggested Resolution:
                </div>
                <p className="text-slate-800 text-[11px] font-medium leading-normal">{tkt.ai_suggested_resolution}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ticket Details & SLA Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-white/90 border border-white rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-rose-600" /> Ticket SLA & Resolution Center
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">{selectedTicket.title}</h4>
              <p className="text-xs text-slate-600">Contact: {selectedTicket.contact?.first_name} {selectedTicket.contact?.last_name} ({selectedTicket.contact?.email})</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900">Issue Description:</div>
              <p className="text-slate-700 leading-relaxed">{selectedTicket.issue_description}</p>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-2">
              <div className="font-bold text-sky-900 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-sky-600" /> AI Resolution Guide:
              </div>
              <p className="text-sky-950 font-medium">{selectedTicket.ai_suggested_resolution}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStatusChange(selectedTicket.id, 'Resolved')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Mark Ticket Resolved
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
