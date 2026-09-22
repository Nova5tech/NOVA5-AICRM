'use client';

import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, CheckSquare, Sparkles, Clock, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { Activity, Task } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    Promise.all([
      api.getActivities().catch(() => []),
      api.getTasks().catch(() => []),
    ]).then(([acts, tsks]) => {
      setActivities(acts);
      setTasks(tsks);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <ActivityIcon className="w-6 h-6 text-sky-600" /> Activities & Follow-up Timeline
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Calls, meetings, tasks, follow-ups, and automated AI activity events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Activity Timeline */}
        <div className="light-glass-card rounded-2xl p-5 space-y-4 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" /> Recent Activities
          </h3>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-sky-200">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-8">
                <span className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-sky-500/20 border-2 border-sky-600"></span>
                <span className="text-[10px] text-sky-800 font-mono font-extrabold">{formatTime(act.timestamp)}</span>
                <h5 className="text-xs font-extrabold text-slate-900 mt-0.5">{act.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Open Tasks */}
        <div className="light-glass-card rounded-2xl p-5 space-y-4 shadow-sky-glass">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-600" /> Pending Action Tasks
          </h3>

          <div className="space-y-3">
            {tasks.map((tsk) => (
              <div key={tsk.id} className="p-4 rounded-xl bg-white/80 border border-sky-200 space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {tsk.is_ai_recommended && <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />}
                    <h5 className="text-xs font-extrabold text-slate-900">{tsk.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${tsk.priority === 'Critical' ? 'bg-rose-500/20 text-rose-900 border border-rose-400/40' : 'bg-amber-500/20 text-amber-900 border border-amber-400/40'}`}>
                    {tsk.priority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono font-bold">Due: {tsk.due_date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
