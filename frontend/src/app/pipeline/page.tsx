'use client';

import React, { useState, useEffect } from 'react';
import { Kanban as KanbanIcon, Sparkles, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';
import { Deal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

const stages = ['New Lead', 'Contacted', 'Qualified', 'Demo', 'Proposal', 'Negotiation', 'Won'];

export default function PipelineKanbanPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      const data = await api.getDeals();
      setDeals(data);
    } catch {
      // Fallback
    }
  }

  async function moveDealStage(dealId: string, currentStage: string) {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      await api.updateDealStage(dealId, nextStage);
      loadDeals();
    }
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <KanbanIcon className="w-6 h-6 text-amber-600" /> Interactive Sales Pipeline & Deal Risk
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">Visual opportunity stages with real-time AI engagement risk calculation.</p>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((acc, d) => acc + d.value, 0);

          return (
            <div key={stage} className="w-72 light-glass-card rounded-2xl p-3 shrink-0 flex flex-col space-y-3 shadow-sky-glass">
              {/* Stage Header */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-sky-100">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">{stage}</h3>
                  <span className="text-[10px] text-slate-500 font-bold">{stageDeals.length} Deals</span>
                </div>
                <span className="text-xs font-black font-mono text-emerald-700">{formatCurrency(stageTotal)}</span>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-260px)]">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="p-4 rounded-xl bg-white/80 border border-sky-200/80 hover:border-sky-400 hover:bg-white cursor-pointer transition-all duration-75 space-y-3 shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{deal.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{deal.company?.name || 'Enterprise'}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-slate-900 font-black">{formatCurrency(deal.value)}</span>
                      <span className="text-slate-600 text-[10px]">{deal.probability}% Prob.</span>
                    </div>

                    {/* AI Risk Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold ${deal.ai_risk_level === 'High' ? 'bg-rose-500/20 text-rose-900 border border-rose-400/40' : deal.ai_risk_level === 'Medium' ? 'bg-amber-500/20 text-amber-900 border border-amber-400/40' : 'bg-emerald-500/20 text-emerald-900 border border-emerald-400/40'}`}>
                        AI Risk: {deal.ai_risk_level}
                      </span>
                      {stage !== 'Won' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); moveDealStage(deal.id, deal.stage); }}
                          className="text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 font-bold"
                        >
                          Advance <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal Intelligence Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md light-glass-card rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> Deal Intelligence & Risk
              </h3>
              <button onClick={() => setSelectedDeal(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">{selectedDeal.title}</h4>
              <p className="text-xs text-slate-600 font-medium">Value: {formatCurrency(selectedDeal.value)} • Stage: {selectedDeal.stage}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/90 border border-sky-200 space-y-2 text-xs shadow-sm">
              <div className="font-extrabold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> AI Risk Reasons:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] font-medium">
                {selectedDeal.ai_risk_reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-300/40 text-xs space-y-1">
              <div className="font-extrabold text-sky-900">Recommended Next Action:</div>
              <p className="text-slate-800 font-medium">{selectedDeal.ai_recommended_action}</p>
            </div>

            <button
              onClick={() => setSelectedDeal(null)}
              className="w-full py-2.5 rounded-xl bg-vibrant-sky-gradient text-white text-xs font-bold shadow-sky-glow"
            >
              Close Intelligence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
