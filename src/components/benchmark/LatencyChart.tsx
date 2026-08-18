'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BENCHMARK_MODELS } from '@/lib/taxonomy';

export function LatencyChart() {
  const chartData = BENCHMARK_MODELS.map((m) => ({
    name: m.modelName.split(' ')[0],
    fullName: m.modelName,
    latency: m.avgLatencyMs,
    recall: m.safetyRecallPct,
  }));

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 font-mono shadow-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Runtime Latency vs. Safety Recall Tradeoff
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating parameter-efficient QLoRA Mistral-7B achieving 32ms inference with 96.4% recall
          </p>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Bar dataKey="latency" name="Latency (ms - Lower is better)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recall" name="Safety Recall (% - Higher is better)" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
