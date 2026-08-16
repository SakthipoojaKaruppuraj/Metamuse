import React from 'react';
import { ExternalLink, Database, Link as LinkIcon, FileCheck } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

/**
 * Renders an evidence card supporting specific metadata claims.
 * Differentiates visually between on-chain facts and project source documents.
 */
export function SourceCard({ source }) {
  if (!source) return null;

  const isOnChain = source.type.toLowerCase() === 'on-chain';

  return (
    <div 
      className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${
        isOnChain 
          ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200' 
          : 'bg-white border-slate-100 hover:border-violet-100'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {isOnChain ? (
            <div className="p-1.5 rounded-lg bg-emerald-100/50 text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
              <LinkIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
              {source.type === 'on-chain' ? 'On-Chain Ledger' : `${source.type} source`}
            </span>
            <h4 className="font-semibold text-slate-800 text-sm leading-tight mt-0.5">
              {source.title}
            </h4>
          </div>
        </div>
        <ConfidenceBadge confidence={source.confidence} />
      </div>

      <p className="text-slate-600 text-xs italic bg-slate-50/50 p-3 rounded-lg border border-slate-100/40 mb-4 leading-relaxed">
        "{source.excerpt}"
      </p>

      {source.description && (
        <p className="text-slate-500 text-xs mb-4 leading-normal">
          {source.description}
        </p>
      )}

      {source.url && (
        <a 
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            isOnChain 
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' 
              : 'text-violet-700 bg-violet-50 hover:bg-violet-100'
          }`}
        >
          {isOnChain ? <FileCheck className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
          {isOnChain ? 'Verify Transaction' : 'Open Source Document'}
        </a>
      )}
    </div>
  );
}
