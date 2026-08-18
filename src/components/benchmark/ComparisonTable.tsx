'use client';

import React from 'react';
import { BENCHMARK_MODELS } from '@/lib/taxonomy';
import { ShieldCheck, Zap, DollarSign } from 'lucide-react';

export function ComparisonTable() {
  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 font-mono shadow-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            Existing Guard Models vs. Our Proposed GuardAgent
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical comparison across latency, explainability, safety recall, and deployment cost
          </p>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          Slide 14–15 Benchmark
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="pb-3 pr-4 font-bold">Model</th>
              <th className="pb-3 pr-4 font-bold">Architecture</th>
              <th className="pb-3 pr-4 font-bold">Dataset / Taxonomy</th>
              <th className="pb-3 pr-4 font-bold">Open Source</th>
              <th className="pb-3 pr-4 font-bold">Explainable</th>
              <th className="pb-3 pr-4 font-bold text-center">Avg Latency</th>
              <th className="pb-3 pr-4 font-bold text-center">Safety Recall</th>
              <th className="pb-3 font-bold">Key Result / Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {BENCHMARK_MODELS.map((model, idx) => {
              const isOurs = idx === 0;
              return (
                <tr
                  key={model.modelName}
                  className={`hover:bg-slate-800/40 transition ${
                    isOurs ? 'bg-emerald-950/20 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <td className="py-3.5 pr-4 font-bold">
                    <div className="flex items-center gap-1.5">
                      {isOurs && <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />}
                      <span className={isOurs ? 'text-emerald-400' : 'text-white'}>
                        {model.modelName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300">{model.architecture}</td>
                  <td className="py-3.5 pr-4 text-slate-400">{model.dataset}</td>
                  <td className="py-3.5 pr-4 text-slate-300">{model.openSource}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        model.explainable.startsWith('Yes')
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {model.explainable}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-center font-bold text-cyan-400">
                    {model.avgLatencyMs}ms
                  </td>
                  <td className="py-3.5 pr-4 text-center font-bold text-emerald-400">
                    {model.safetyRecallPct}%
                  </td>
                  <td className="py-3.5 text-slate-400 text-[11px] leading-relaxed">
                    {model.keyResult}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
