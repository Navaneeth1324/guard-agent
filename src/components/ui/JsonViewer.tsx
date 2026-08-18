'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: Record<string, any> | string;
  className?: string;
}

export function JsonViewer({ data, className = '' }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-xs overflow-x-auto ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
        title="Copy JSON"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>
      <pre className="text-slate-300 leading-relaxed">{jsonString}</pre>
    </div>
  );
}
