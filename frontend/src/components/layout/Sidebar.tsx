'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserCheck, MessageSquare, PhoneCall,
  Share2, Settings, Sparkles, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    group: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-sky-600' },
      { label: 'AI Leads', href: '/leads', icon: UserCheck, badge: 'Scored', color: 'text-emerald-600' },
      { label: 'AI Chat', href: '/chat', icon: MessageSquare, badge: 'RAG', color: 'text-purple-600' },
      { label: 'AI Calling', href: '/calling', icon: PhoneCall, badge: 'Voice', color: 'text-amber-600' },
    ]
  },
  {
    group: 'CHANNELS',
    items: [
      { label: 'WhatsApp', href: '/channels/whatsapp', icon: Share2, color: 'text-emerald-600' },
      { label: 'Instagram', href: '/channels/instagram', icon: Share2, color: 'text-purple-600' },
      { label: 'Facebook', href: '/channels/facebook', icon: Share2, color: 'text-sky-600' },
      { label: 'X (Twitter)', href: '/channels/x', icon: Share2, color: 'text-slate-800' },
      { label: 'LinkedIn', href: '/channels/linkedin', icon: Share2, color: 'text-indigo-600' },
    ]
  },
  {
    group: 'SETTINGS',
    items: [
      { label: 'Integrations', href: '/integrations', icon: Settings, color: 'text-sky-600' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 light-glass-sidebar flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 select-none shadow-sky-glass">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/80 bg-white/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-vibrant-sky-gradient flex items-center justify-center font-extrabold text-white shadow-sky-glow">
              N5
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-slate-900 flex items-center gap-1.5">
                NOVA5 <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-900 font-extrabold border border-sky-400/40">AI CRM</span>
              </span>
              <p className="text-[10px] text-slate-600 font-medium">Customer Acquisition Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {navItems.map((group, idx) => (
            <div key={idx}>
              <h4 className="px-3 text-[10px] font-extrabold text-slate-500 tracking-wider uppercase mb-2">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-75 group',
                        isActive
                          ? 'bg-vibrant-sky-gradient text-white shadow-sky-glow font-bold'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-white/70 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : item.color)} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-bold font-mono',
                          isActive
                            ? 'bg-white/30 text-white'
                            : 'bg-sky-500/20 text-sky-900 border border-sky-400/40'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/80 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Alex Vance"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-500/40 shadow-sm"
            />
            <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 truncate">Alex Vance</h5>
            <p className="text-[11px] text-slate-600 truncate font-medium">Sales Admin • Nova5 Org</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
