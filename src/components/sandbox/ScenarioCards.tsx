'use client';

import React from 'react';
import { Play, ShieldAlert, ShieldCheck, AlertTriangle, Flame, FileCode } from 'lucide-react';
import { useGuard } from '@/context/GuardContext';
import { ATTACK_SCENARIOS } from '@/lib/scenarios';
import { AttackScenario } from '@/types';
import { TAXONOMY_DEFINITIONS } from '@/lib/taxonomy';

export function ScenarioCards() {
  const { activeScenario, runScenario } = useGuard();

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'MEDIUM':
        return 'bg-yellow-950 text-yellow-400 border-yellow-800';
      default:
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Research Case Studies & Benchmark Attacks
        </h3>
        <span className="text-[10px] text-slate-500">6 Scenarios Ready</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ATTACK_SCENARIOS.map((scenario) => {
          const isSelected = activeScenario.id === scenario.id;
          const taxonomy = TAXONOMY_DEFINITIONS[scenario.riskTaxonomy];

          return (
            <div
              key={scenario.id}
              onClick={() => runScenario(scenario)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-xs ${
                isSelected
                  ? 'bg-slate-900 border-emerald-400/60 shadow-lg ring-1 ring-emerald-400/20'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(
                      scenario.severity
                    )}`}
                  >
                    {scenario.severity}
                  </span>
                  {scenario.caseStudyRef && (
                    <span className="text-[9px] text-slate-500 font-mono truncate">
                      {scenario.caseStudyRef}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm line-clamp-1">{scenario.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              {/* Footer: Tool Invoked & Trigger Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-400 truncate max-w-[170px]">
                  ⚡ {scenario.toolName}
                </span>

                <button
                  type="button"
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] rounded-lg border border-emerald-500/30 transition flex items-center gap-1"
                >
                  <Play size={10} />
                  <span>Execute Test</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
