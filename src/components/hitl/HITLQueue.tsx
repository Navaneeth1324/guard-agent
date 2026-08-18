'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ChevronRight, Clock, Shield } from 'lucide-react';
import { useGuard } from '@/context/GuardContext';
import { TAXONOMY_DEFINITIONS } from '@/lib/taxonomy';

export function HITLQueue() {
  const { pendingReviewQueue, setSelectedAssessment, approveReview, rejectReview } = useGuard();

  if (pendingReviewQueue.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 text-center space-y-2 font-mono">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 size={20} />
        </div>
        <h4 className="text-sm font-bold text-white">HITL Review Queue Clean</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          No tool calls currently blocked in human review. Medium-risk actions will pause here for inspection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 font-mono shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Pending Human-in-the-Loop Queue
          </h3>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
          {pendingReviewQueue.length} AWAITING DECISION
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {pendingReviewQueue.map((item) => {
          const taxonomy = TAXONOMY_DEFINITIONS[item.output.primary_risk];
          return (
            <div
              key={item.id}
              className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              {/* Left: Summary */}
              <div
                onClick={() => setSelectedAssessment(item)}
                className="cursor-pointer flex-1 min-w-0 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">{item.id}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                    style={{ backgroundColor: `${taxonomy.color}20`, color: taxonomy.color }}
                  >
                    {item.output.primary_risk}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                </div>

                <p className="text-slate-300 font-medium truncate">
                  Tool: <span className="text-amber-300">{item.input.tool_name}</span>
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.output.reason}</p>
              </div>

              {/* Right: Quick Actions & Inspect Button */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  onClick={() => approveReview(item.id)}
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/40 text-[11px] font-bold transition"
                  title="Quick Approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectReview(item.id)}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-500/40 text-[11px] font-bold transition"
                  title="Quick Reject"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedAssessment(item)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Inspect Details"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
