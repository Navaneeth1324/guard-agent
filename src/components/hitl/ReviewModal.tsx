'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  X,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Cpu,
} from 'lucide-react';
import { useGuard } from '@/context/GuardContext';
import { RiskScoreGauge } from './RiskScoreGauge';
import { TAXONOMY_DEFINITIONS } from '@/lib/taxonomy';

export function ReviewModal() {
  const { selectedAssessment, setSelectedAssessment, approveReview, rejectReview, modifyAndApproveReview } =
    useGuard();

  const [isEditing, setIsEditing] = useState(false);
  const [editedArgs, setEditedArgs] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');

  if (!selectedAssessment) return null;

  const { input, output, latencyMs, id, timestamp } = selectedAssessment;

  const handleStartEdit = () => {
    setEditedArgs(JSON.stringify(input.tool_arguments, null, 2));
    setIsEditing(true);
    setJsonError(null);
  };

  const handleSaveAndApprove = () => {
    try {
      const parsed = JSON.parse(editedArgs);
      modifyAndApproveReview(id, parsed, reviewerNotes);
      setIsEditing(false);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON format');
    }
  };

  const primaryTaxonomy = TAXONOMY_DEFINITIONS[output.primary_risk];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 font-sans text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Human-in-the-Loop Interception Review
                </h2>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  {id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Intercepted at {timestamp} • {latencyMs}ms guard inference latency
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAssessment(null)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Summary: Risk Score Gauge + Taxonomy Pill */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <RiskScoreGauge score={output.risk_score} size={88} />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Primary Risk Vector
              </span>
              <h4
                className="text-base font-black font-mono"
                style={{ color: primaryTaxonomy.color }}
              >
                {output.primary_risk}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                {primaryTaxonomy.description}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <span className="text-[10px] font-mono text-slate-400 block">TOOL SENSITIVITY</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{output.tool_sensitivity}</span>
          </div>
        </div>

        {/* User Request & Triggering Tool Call */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <span className="text-slate-400 font-bold block mb-1 flex items-center gap-1.5">
              <User size={13} className="text-cyan-400" /> USER PROMPT
            </span>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
              {input.user_request}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Cpu size={13} className="text-amber-400" /> INTERCEPTED TOOL: {input.tool_name}
              </span>
              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 size={12} />
                  <span>Sanitize / Edit Args</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedArgs}
                  onChange={(e) => setEditedArgs(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-slate-950 text-slate-100 rounded-xl border border-cyan-500/50 font-mono text-xs outline-none focus:ring-1 focus:ring-cyan-400"
                />
                {jsonError && <p className="text-xs text-red-400 font-bold">{jsonError}</p>}
              </div>
            ) : (
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
                {JSON.stringify(input.tool_arguments, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Natural Language Safety Reasoning & Rationale */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
          <span className="text-amber-400 font-bold block flex items-center gap-1">
            <FileText size={13} /> GUARDAGENT SAFETY REASONING
          </span>
          <p className="text-slate-200">{output.reason}</p>
          <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
            {output.rationale}
          </p>
        </div>

        {/* Optional Reviewer Notes */}
        <div>
          <input
            type="text"
            placeholder="Add optional reviewer notes or audit rationale..."
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-white outline-none focus:border-slate-600"
          />
        </div>

        {/* Action Buttons: Reject / Sanitize / Approve */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800 font-mono text-xs font-bold">
          <button
            onClick={() => rejectReview(id, reviewerNotes)}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <XCircle size={16} />
            <span>REJECT & TERMINATE (BLOCK)</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSaveAndApprove}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <CheckCircle2 size={16} />
              <span>SAVE & EXECUTE MODIFIED</span>
            </button>
          ) : (
            <button
              onClick={() => approveReview(id, reviewerNotes)}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <CheckCircle2 size={16} />
              <span>APPROVE EXECUTION (ALLOW)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
