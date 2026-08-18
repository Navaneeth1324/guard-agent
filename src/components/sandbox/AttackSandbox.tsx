'use client';

import React, { useState } from 'react';
import { Play, Shield, Terminal, Zap, Code, AlertCircle, RefreshCw } from 'lucide-react';
import { useGuard } from '@/context/GuardContext';
import { JsonViewer } from '../ui/JsonViewer';
import { RiskScoreGauge } from '../hitl/RiskScoreGauge';
import { TOOL_SENSITIVITIES, TAXONOMY_DEFINITIONS } from '@/lib/taxonomy';

export function AttackSandbox() {
  const { runToolCallEvaluation, assessments } = useGuard();

  const [userRequest, setUserRequest] = useState(
    'Fix the path resolution error in the staging deployment script.'
  );
  const [toolName, setToolName] = useState('aws.delete_volume');
  const [toolArgsStr, setToolArgsStr] = useState(
    JSON.stringify(
      {
        volume_id: 'vol-prod-primary-db-01',
        force_delete: true,
        cascade_delete_backups: true,
        reason: 'Resolve staging environment path collision',
      },
      null,
      2
    )
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured');

  const latestAssessment = assessments[0] || null;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedArgs = JSON.parse(toolArgsStr);
      setJsonError(null);
      runToolCallEvaluation(userRequest, toolName, parsedArgs, 'User Live');
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format in arguments');
    }
  };

  const getDecisionStyles = (dec?: string) => {
    switch (dec) {
      case 'ALLOW':
        return {
          banner: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          badge: 'bg-emerald-500 text-black',
        };
      case 'REVIEW':
        return {
          banner: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
          badge: 'bg-amber-400 text-black',
        };
      default:
        return {
          banner: 'bg-red-950/40 border-red-500/40 text-red-300',
          badge: 'bg-red-500 text-white',
        };
    }
  };

  const currentStyles = getDecisionStyles(latestAssessment?.output.decision);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-5 font-mono shadow-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-emerald-400" />
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Live Tool Invocation Interception Gateway
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          QLoRA Mistral-7B Guard Proxy
        </span>
      </div>

      {/* Invocation Form */}
      <form onSubmit={handleExecute} className="space-y-3 text-xs">
        {/* User Request Input */}
        <div>
          <label className="text-slate-400 font-bold block mb-1">USER REQUEST / AGENT GOAL</label>
          <input
            type="text"
            value={userRequest}
            onChange={(e) => setUserRequest(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white outline-none focus:border-emerald-500/60 transition"
            placeholder="Enter user prompt that prompted the agent..."
          />
        </div>

        {/* Tool Name Dropdown / Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-bold block mb-1">INVOKED TOOL IDENTIFIER</label>
            <select
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-amber-400 font-bold outline-none"
            >
              {Object.keys(TOOL_SENSITIVITIES).map((t) => (
                <option key={t} value={t}>
                  {t} (Sensitivity: {TOOL_SENSITIVITIES[t]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">ROUTING ENGINE MODE</label>
            <div className="px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 flex items-center justify-between">
              <span>3-Tier Adaptive (0-30 / 31-79 / 80-100)</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Tool Arguments JSON Editor */}
        <div>
          <label className="text-slate-400 font-bold block mb-1">TOOL ARGUMENTS PAYLOAD (JSON)</label>
          <textarea
            value={toolArgsStr}
            onChange={(e) => setToolArgsStr(e.target.value)}
            rows={5}
            className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs outline-none focus:border-emerald-500/60"
          />
          {jsonError && <p className="text-xs text-red-400 font-bold mt-1">{jsonError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2"
        >
          <Zap size={15} />
          <span>INTERCEPT & EVALUATE WITH GUARDAGENT</span>
        </button>
      </form>

      {/* Latest Evaluation Result */}
      {latestAssessment && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Latest Interception Assessment
            </h3>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab('structured')}
                className={`px-2.5 py-0.5 rounded font-bold transition ${
                  activeTab === 'structured' ? 'bg-slate-800 text-white' : 'text-slate-500'
                }`}
              >
                Structured Analysis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('raw')}
                className={`px-2.5 py-0.5 rounded font-bold transition ${
                  activeTab === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-500'
                }`}
              >
                JSON Schema
              </button>
            </div>
          </div>

          {activeTab === 'structured' ? (
            <div className={`p-4 rounded-2xl border ${currentStyles.banner} space-y-3`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <RiskScoreGauge score={latestAssessment.output.risk_score} size={74} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2 py-0.5 rounded uppercase ${currentStyles.badge}`}>
                        DECISION: {latestAssessment.output.decision}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {latestAssessment.latencyMs}ms inference
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">
                      Primary: {latestAssessment.output.primary_risk}
                    </p>
                    <p className="text-[11px] text-slate-300">{latestAssessment.output.reason}</p>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] sm:border-l sm:border-slate-800 sm:pl-3">
                  <span className="text-slate-400 block">ID: {latestAssessment.id}</span>
                  <span className="text-slate-400 block">Sensitivity: {latestAssessment.output.tool_sensitivity}</span>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                {latestAssessment.output.rationale}
              </div>
            </div>
          ) : (
            <JsonViewer data={latestAssessment} />
          )}
        </div>
      )}
    </div>
  );
}
