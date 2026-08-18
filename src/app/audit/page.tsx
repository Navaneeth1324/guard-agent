'use client';

import React, { useState } from 'react';
import { useGuard } from '@/context/GuardContext';
import { Download, Trash2, Filter, ShieldCheck, Clock } from 'lucide-react';
import { JsonViewer } from '@/components/ui/JsonViewer';
import { TAXONOMY_DEFINITIONS } from '@/lib/taxonomy';

export default function AuditPage() {
  const { assessments, clearHistory } = useGuard();
  const [filterDecision, setFilterDecision] = useState<string>('ALL');

  const filtered = assessments.filter((a) => {
    if (filterDecision === 'ALL') return true;
    return a.output.decision === filterDecision;
  });

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(assessments, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guardagent_audit_traces_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'REVIEW':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-red-950 text-red-400 border-red-800';
    }
  };

  return (
    <div className="min-h-[calc(100vh-61px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <Clock size={14} />
              <span>INCIDENT AUDIT LOGS</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Safety Interception Traces
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Historical step-level tool call audit logs with risk scores and human review actions.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export traces.json</span>
            </button>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-xl border border-red-800/60 transition flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {['ALL', 'ALLOW', 'REVIEW', 'BLOCK'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterDecision(f)}
              className={`px-3 py-1 rounded-lg border transition ${
                filterDecision === f
                  ? 'bg-slate-800 text-white border-slate-600 font-bold'
                  : 'bg-slate-950 text-slate-500 border-slate-900 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Traces List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-slate-900/40 rounded-3xl p-12 text-center border border-slate-800 text-slate-400 font-mono text-xs">
              No audit traces match the current filter.
            </div>
          ) : (
            filtered.map((item) => {
              const taxonomy = TAXONOMY_DEFINITIONS[item.output.primary_risk];
              return (
                <div
                  key={item.id}
                  className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 font-mono text-xs shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getDecisionBadge(item.output.decision)}`}>
                        {item.output.decision}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        style={{ backgroundColor: `${taxonomy.color}20`, color: taxonomy.color }}
                      >
                        {item.output.primary_risk}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>Source: {item.source}</span>
                      <span>•</span>
                      <span>{item.latencyMs}ms inference</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold block">USER PROMPT:</span>
                      <p className="text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        {item.input.user_request}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-amber-400 font-bold block">TOOL: {item.input.tool_name}</span>
                      <pre className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 overflow-x-auto text-[11px]">
                        {JSON.stringify(item.input.tool_arguments, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold block">REASONING & RATIONALE:</span>
                    <p className="text-slate-300">{item.output.reason}</p>
                    <p className="text-slate-500 text-[11px]">{item.output.rationale}</p>
                    {item.reviewerNotes && (
                      <p className="text-emerald-400 text-[11px] pt-1 font-bold">
                        Human Note: {item.reviewerNotes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
