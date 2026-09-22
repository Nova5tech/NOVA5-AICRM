'use client';

import React, { useState, useEffect } from 'react';
import { Plug, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Integration } from '@/lib/types';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  async function loadIntegrations() {
    try {
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch {
      // Fallback
    }
  }

  async function handleToggle(id: string) {
    try {
      await api.toggleIntegration(id);
      loadIntegrations();
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Plug className="w-6 h-6 text-amber-600" /> Channel Connectors & Integrations Hub
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Connect communication channels, social platforms, and developer REST APIs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl light-glass-card hover:scale-[1.02] transition-all duration-75 space-y-4 shadow-sky-glass">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{item.name}</h3>
                <span className="text-[10px] text-sky-800 uppercase font-mono font-bold">{item.category}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${item.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-900 border border-emerald-400/40' : 'bg-slate-200/80 text-slate-700'}`}>
                {item.status === 'Connected' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <XCircle className="w-3.5 h-3.5" />}
                {item.status}
              </span>
            </div>

            {item.account_connected && (
              <div className="text-xs text-slate-800 font-mono bg-white/90 p-2.5 rounded-xl border border-sky-200 font-bold truncate shadow-sm">
                Account: {item.account_connected}
              </div>
            )}

            <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-mono font-medium">Last Sync: {item.last_sync || 'Never'}</span>
              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-transform duration-75 ${item.status === 'Connected' ? 'bg-white/80 text-slate-800 border border-sky-200 hover:bg-white shadow-sm' : 'bg-vibrant-sky-gradient text-white hover:scale-105 shadow-sky-glow'}`}
              >
                {item.status === 'Connected' ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
