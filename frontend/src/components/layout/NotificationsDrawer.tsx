'use client';

import React from 'react';
import { X, Bell, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    title: 'High Priority Lead Alert',
    message: 'Marcus Vance (Aether Dynamics) reached out via WhatsApp. Lead Score: 92/100.',
    type: 'ai_alert',
    time: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Deal Stage Advanced',
    message: 'Nexus Health proposal stage advanced to Demo phase by Sarah Chen.',
    type: 'info',
    time: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Automation Rule Executed',
    message: 'High-Priority Lead Auto-Assignment executed for 2 new leads.',
    type: 'success',
    time: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-96 light-glass-card border-l border-sky-200 h-full p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-slate-900">Notifications</h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-white/60 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {mockNotifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-white/80 border border-sky-200 hover:border-sky-400 transition-all shadow-sm">
                <div className="flex items-start gap-3">
                  {n.type === 'ai_alert' && <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />}
                  {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                  {n.type === 'info' && <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <h5 className="text-xs font-extrabold text-slate-900">{n.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-mono font-medium">{formatTime(n.time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/80 border border-sky-200 text-xs font-bold text-slate-700 hover:bg-white shadow-sm"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
