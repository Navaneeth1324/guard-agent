'use client';

import React from 'react';
import { ComparisonTable } from '@/components/benchmark/ComparisonTable';
import { LatencyChart } from '@/components/benchmark/LatencyChart';
import { ShieldCheck, BarChart2, Cpu, BookOpen } from 'lucide-react';

export default function BenchmarkPage() {
  return (
    <div className="min-h-[calc(100vh-61px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <BarChart2 size={14} />
            <span>RESEARCH EXPERIMENT 2 & 3</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Empirical Model Benchmark & Comparison
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            Evaluating our QLoRA fine-tuned Mistral-7B GuardAgent against 5 baseline guard systems (GuardAgent GPT-4, LlamaFirewall, GuardReasoner, Llama Guard 3-1B, PromptGuard 2).
          </p>
        </div>

        {/* Latency & Recall Visualizer Chart */}
        <LatencyChart />

        {/* Full 5-Model Comparison Table */}
        <ComparisonTable />
      </div>
    </div>
  );
}
