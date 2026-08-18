'use client';

import React from 'react';
import { AttackSandbox } from '@/components/sandbox/AttackSandbox';
import { ScenarioCards } from '@/components/sandbox/ScenarioCards';
import { HITLQueue } from '@/components/hitl/HITLQueue';
import { ReviewModal } from '@/components/hitl/ReviewModal';
import { ShieldCheck, Cpu, Terminal, AlertTriangle, Activity } from 'lucide-react';
import { useGuard } from '@/context/GuardContext';

export default function Home() {
  const { totalIntercepted, allowedCount, reviewCount, blockedCount, avgLatencyMs } = useGuard();

  return (
    <div className="min-h-[calc(100vh-61px)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Research Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PI LABS RESEARCH
              </span>
              <span className="text-xs font-mono text-slate-400">PES University // Dept of CSE (AI & ML)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Parameter-Efficient Runtime GuardAgent for Tool-Using LLMs
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Pre-execution interception proxy featuring 4-Tier Risk Taxonomy, structured JSON safety reasoning, and 3-Tier adaptive Human-in-the-Loop oversight.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto font-mono flex-shrink-0">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">TOTAL CALLS</span>
              <span className="text-xl font-black text-white">{totalIntercepted}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-900/60 text-center">
              <span className="text-[10px] text-emerald-400 block font-bold">AUTO-ALLOW</span>
              <span className="text-xl font-black text-emerald-400">{allowedCount}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-amber-900/60 text-center">
              <span className="text-[10px] text-amber-400 block font-bold">HITL REVIEW</span>
              <span className="text-xl font-black text-amber-400">{reviewCount}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-red-900/60 text-center">
              <span className="text-[10px] text-red-400 block font-bold">AUTO-BLOCK</span>
              <span className="text-xl font-black text-red-400">{blockedCount}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Sandbox & Scenarios, Right HITL Live Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Width: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ScenarioCards />
            <AttackSandbox />
          </div>

          {/* Right Column (Width: 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <HITLQueue />

            {/* Quick Architecture Reference Card */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 font-mono text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                3-Tier Context-Aware Routing Logic
              </h4>
              <div className="space-y-2 text-slate-300">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-emerald-300">ALLOW (Risk 0–30)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Low-risk / Read-only (~24ms)</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-bold text-amber-300">REVIEW (Risk 31–79)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Pauses for HITL Approval</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="font-bold text-red-300">BLOCK (Risk 80–100)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Immediate Abort & Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Human in the Loop Review Modal */}
      <ReviewModal />
    </div>
  );
}
