'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, UserCheck, MessageSquare, PhoneCall, Settings, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-xl light-glass-card rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-sky-200">
        <div className="p-4 border-b border-sky-100 flex items-center gap-3 bg-sky-50/60">
          <Search className="w-5 h-5 text-sky-600" />
          <input
            type="text"
            placeholder="Type a command, lead name, or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-xs px-2.5 py-1 rounded-lg bg-white/80 border border-sky-200 text-slate-600 font-bold font-mono">
            ESC
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Quick Actions</div>

          <button
            onClick={() => navigateTo('/leads')}
            className="w-full px-3.5 py-2.5 rounded-xl hover:bg-white/80 text-left flex items-center justify-between group transition-colors duration-75"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">View AI Scored Leads</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" />
          </button>

          <button
            onClick={() => navigateTo('/chat')}
            className="w-full px-3.5 py-2.5 rounded-xl hover:bg-white/80 text-left flex items-center justify-between group transition-colors duration-75"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-900">Launch AI Conversational Chatbot</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all" />
          </button>

          <button
            onClick={() => navigateTo('/calling')}
            className="w-full px-3.5 py-2.5 rounded-xl hover:bg-white/80 text-left flex items-center justify-between group transition-colors duration-75"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">Initiate AI Outbound Voice Call</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all" />
          </button>

          <button
            onClick={() => navigateTo('/integrations')}
            className="w-full px-3.5 py-2.5 rounded-xl hover:bg-white/80 text-left flex items-center justify-between group transition-colors duration-75"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-slate-900">Omnichannel Integration Settings</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
