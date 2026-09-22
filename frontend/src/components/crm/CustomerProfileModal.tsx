'use client';

import React, { useState } from 'react';
import { X, Building2, Mail, Phone, Calendar, Sparkles, CheckCircle, Activity, MessageSquare } from 'lucide-react';
import { Contact } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface CustomerProfileModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerProfileModal({ contact, isOpen, onClose }: CustomerProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'deals' | 'activities'>('timeline');

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl light-glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-sky-100 bg-sky-50/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={contact.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={contact.first_name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-400/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">{contact.first_name} {contact.last_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-900 border border-emerald-400/40">
                  Verified Contact
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{contact.title || 'Executive'} • {contact.company?.name || 'Enterprise Organization'}</p>
              <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-600" /> {contact.email}</span>
                {contact.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sky-600" /> {contact.phone}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-white/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 360 Degree Intelligence Tabs */}
        <div className="px-6 border-b border-sky-100 bg-white/60 flex gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors duration-75 ${activeTab === 'timeline' ? 'border-sky-600 text-sky-900 font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            Chronological Timeline
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`py-3 border-b-2 transition-colors duration-75 ${activeTab === 'deals' ? 'border-sky-600 text-sky-900 font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            Associated Deals & Value
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`py-3 border-b-2 transition-colors duration-75 ${activeTab === 'activities' ? 'border-sky-600 text-sky-900 font-extrabold' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            AI Notes & Activities
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'timeline' && (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-sky-200">
              <div className="relative pl-8">
                <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-sky-500/20 border-2 border-sky-600"></span>
                <span className="text-[10px] text-sky-800 font-mono font-bold">TODAY • 10:32 AM</span>
                <h5 className="text-xs font-extrabold text-slate-900 mt-0.5">WhatsApp Inquiry Received</h5>
                <div className="mt-1 p-3 rounded-xl bg-white/80 border border-sky-200 text-xs text-slate-800 font-medium shadow-sm">
                  <div className="flex items-center gap-1.5 text-sky-700 text-[11px] font-extrabold mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Intent: High Purchase Intent
                  </div>
                  "Evaluated competitors. Requesting 150 enterprise seat pricing package."
                </div>
              </div>

              <div className="relative pl-8">
                <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-indigo-500/20 border-2 border-indigo-600"></span>
                <span className="text-[10px] text-indigo-800 font-mono font-bold">YESTERDAY • 4:15 PM</span>
                <h5 className="text-xs font-extrabold text-slate-900 mt-0.5">Pricing Page Visited</h5>
                <p className="text-xs text-slate-600 font-medium">Visited Enterprise Security & Vector RAG documentation 4 times.</p>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/80 border border-sky-200 flex items-center justify-between shadow-sm">
                <div>
                  <h5 className="text-xs font-extrabold text-slate-900">Enterprise AI Rollout</h5>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Stage: Proposal (Probability: 80%)</p>
                </div>
                <span className="text-sm font-black text-emerald-700 font-mono">{formatCurrency(64000)}</span>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/80 border border-sky-200 text-xs text-slate-800 font-medium shadow-sm">
                <div className="font-extrabold text-slate-900 mb-1">AI Recommendation</div>
                Send custom enterprise proposal with HIPAA data compliance whitepaper attached.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
