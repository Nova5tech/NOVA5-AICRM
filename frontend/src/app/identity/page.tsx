'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, GitMerge, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { DuplicateMatch } from '@/lib/types';

export default function IdentityResolutionPage() {
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [mergedSuccess, setMergedSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDuplicates();
  }, []);

  async function loadDuplicates() {
    try {
      const data = await api.getDuplicateMatches();
      setDuplicates(data);
    } catch {
      // Fallback
    }
  }

  async function handleMerge(primaryId: string, secondaryId: string) {
    try {
      await api.mergeContacts(primaryId, secondaryId);
      setMergedSuccess(`Successfully merged contact records.`);
      loadDuplicates();
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-indigo-600" /> Customer Identity Resolution & Deduplication
        </h1>
        <p className="text-xs text-slate-600 font-medium">Cross-channel entity resolution linking WhatsApp, Email, Instagram, and phone handles to unified customer profiles.</p>
      </div>

      {mergedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {mergedSuccess}
        </div>
      )}

      {duplicates.length === 0 ? (
        <div className="p-8 text-center rounded-2xl light-glass-card space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Duplicate Contacts Detected</h3>
          <p className="text-xs text-slate-600">All customer identities across channels are currently resolved and unified.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {duplicates.map((dup, idx) => (
            <div key={idx} className="p-6 rounded-2xl light-glass-card space-y-4">
              <div className="flex items-center justify-between border-b border-white/80 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Possible Duplicate Profiles Detected</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-900 border border-amber-400/40">
                    Confidence: {dup.confidence_score}%
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium">{dup.match_reason}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact 1 */}
                <div className="p-4 rounded-xl bg-white/70 border border-white/90 space-y-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={dup.contact1.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{dup.contact1.first_name} {dup.contact1.last_name} (Primary)</h4>
                      <p className="text-[11px] text-slate-600">{dup.contact1.title} • {dup.contact1.email}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">Phone: {dup.contact1.phone || 'N/A'}</div>
                </div>

                {/* Contact 2 */}
                <div className="p-4 rounded-xl bg-white/70 border border-white/90 space-y-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={dup.contact2.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{dup.contact2.first_name} {dup.contact2.last_name} (Duplicate)</h4>
                      <p className="text-[11px] text-slate-600">{dup.contact2.title} • {dup.contact2.email}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">Phone: {dup.contact2.phone || 'N/A'}</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleMerge(dup.contact1.id, dup.contact2.id)}
                  className="px-5 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <GitMerge className="w-4 h-4" /> Merge Records into Unified Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
