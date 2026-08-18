'use client';

import React from 'react';

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
}

export function RiskScoreGauge({ score, size = 110 }: RiskScoreGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#ef4444'; // Red (BLOCK)
    if (score >= 31) return '#f59e0b'; // Amber (REVIEW)
    return '#10b981'; // Green (ALLOW)
  };

  const getDecisionBadge = () => {
    if (score >= 80) return { label: 'BLOCK', class: 'bg-red-950 text-red-400 border-red-800' };
    if (score >= 31) return { label: 'REVIEW', class: 'bg-amber-950 text-amber-400 border-amber-800' };
    return { label: 'ALLOW', class: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
  };

  const badge = getDecisionBadge();
  const color = getColor();

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{score}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      {/* Decision Pill */}
      <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.class}`}>
        {badge.label}
      </span>
    </div>
  );
}
