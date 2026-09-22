'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles, Upload, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { Document } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    api.getDocuments().then(setDocuments).catch(() => {});
  }, []);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.searchKnowledge(searchQuery);
      setSearchResults(res.matched_chunks || []);
    } catch {
      // Error
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Company RAG Knowledge Base
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Grounding AI responses with product docs, enterprise FAQs, SLAs, and security policies.</p>
        </div>
      </div>

      {/* RAG Vector Search Box */}
      <div className="p-5 rounded-2xl light-glass-card space-y-3 shadow-sky-glass">
        <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" /> Test Vector Chunk Retrieval
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a product or compliance query e.g. 'HIPAA SLA guaranteed uptime'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2.5 rounded-xl light-glass-input text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 rounded-xl bg-vibrant-sky-gradient text-white font-bold text-xs shadow-sky-glow hover:scale-105 transition-transform"
          >
            Search Chunks
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] text-sky-900 font-extrabold">Top Matched Chunks:</div>
            {searchResults.map((chunk, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/90 border border-sky-200 text-xs text-slate-800 font-medium shadow-sm">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono font-bold mb-1">
                  <span>Doc: {chunk.title}</span>
                  <span className="text-emerald-700 font-black">Relevance: {(chunk.relevance_score * 100).toFixed(0)}%</span>
                </div>
                "{chunk.snippet}"
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div key={doc.id} className="p-5 rounded-2xl light-glass-card hover:scale-[1.02] transition-all duration-75 space-y-3 shadow-sky-glass">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-800 border border-indigo-300/40">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{doc.title}</h4>
                <p className="text-[10px] text-slate-600 font-bold">{doc.category} • {doc.chunk_count} Chunks</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed font-medium">{doc.content}</p>

            <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-[10px] text-slate-600 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 font-extrabold border border-emerald-400/40">{doc.status}</span>
              <span className="font-mono font-bold">Indexed {formatDate(doc.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
