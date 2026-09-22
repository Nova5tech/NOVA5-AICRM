'use client';

import React, { useState } from 'react';
import { Search, Bell, Sparkles, Command } from 'lucide-react';
import { NotificationsDrawer } from './NotificationsDrawer';
import { CommandPalette } from './CommandPalette';

export function Header() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/60 bg-skybg-50/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-sky-glass">
        {/* Global Search Input */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-96 px-4 py-2 rounded-xl bg-white/60 border border-white/80 hover:border-sky-400/60 hover:bg-white/80 transition-all flex items-center justify-between text-slate-500 group shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <Search className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              <span className="text-slate-600">Search customers, leads, deals or ask AI...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/80 border border-white text-slate-500 font-bold shadow-sm">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Status */}
        <div className="flex items-center gap-4">
          {/* AI Live Engine Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-xs text-sky-900 font-bold shadow-sky-glow">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Copilot Active</span>
          </div>

          {/* Real-time Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2.5 rounded-xl bg-white/60 border border-white/80 text-slate-700 hover:bg-white/90 hover:border-sky-400/50 transition-all shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-sky-700" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </header>

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
