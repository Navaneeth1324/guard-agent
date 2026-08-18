'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Activity, Terminal, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { useGuard } from '@/context/GuardContext';

export function Navbar() {
  const pathname = usePathname();
  const { totalIntercepted, pendingReviewQueue, avgLatencyMs } = useGuard();

  const links = [
    { href: '/', label: 'Live Sandbox', icon: Terminal },
    { href: '/benchmark', label: 'Model Benchmark', icon: BarChart3 },
    { href: '/audit', label: 'Audit Traces', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between text-white">
      {/* Brand & Research Badge */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg text-white tracking-tight">
                GuardAgent
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                PI Labs // PES Univ
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-mono">
              Parameter-Efficient Runtime Safety for Tool-Using LLMs
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-800">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Live System Telemetry Badges */}
      <div className="flex items-center gap-3 font-mono">
        {/* Latency Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300">
          <Activity size={13} className="text-emerald-400" />
          <span>{avgLatencyMs}ms avg latency</span>
        </div>

        {/* Pending HITL Review Badge */}
        {pendingReviewQueue.length > 0 && (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-600/60 rounded-full text-xs font-bold text-amber-300 animate-pulse"
          >
            <AlertTriangle size={13} />
            <span>{pendingReviewQueue.length} HITL PENDING</span>
          </Link>
        )}

        {/* Total Interceptions */}
        <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300 font-semibold">
          <span>{totalIntercepted} Interceptions</span>
        </div>
      </div>
    </header>
  );
}
