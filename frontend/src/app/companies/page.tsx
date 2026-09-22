'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Users, HeartPulse } from 'lucide-react';
import { api } from '@/lib/api';
import { Company } from '@/lib/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    api.getCompanies().then(setCompanies).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-sky-600" /> Organization & Account Directory
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Enterprise accounts with health scores and financial parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((cmp) => (
          <div key={cmp.id} className="p-5 rounded-2xl light-glass-card hover:scale-[1.02] transition-all duration-75 space-y-4 shadow-sky-glass">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{cmp.name}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{cmp.industry}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-900 text-xs font-black font-mono shadow-sm">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />
                <span>{cmp.health_score}</span> / 100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-sky-100">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Company Size</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{cmp.size || '50-200'}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Annual Revenue</span>
                <p className="font-black text-emerald-700 font-mono mt-0.5">{cmp.annual_revenue || '$10M'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-2 border-t border-sky-100">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-600" /> {cmp.location}</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-sky-600" /> {cmp.domain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
