import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

/**
 * AnalysisProgress
 * Displays an elegant step-by-step progress flow when auditing an NFT.
 */
export function AnalysisProgress({ steps }) {
  if (!steps) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-lg mx-auto w-full animate-fade-in">
      <div className="flex flex-col items-center text-center mb-8">
        <h3 className="font-serif text-2xl font-bold text-slate-800">
          Uncovering the Story...
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs leading-normal">
          Tracing the asset provenance, scanning metadata hashes, and collecting creator contexts.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = step.status === 'done';
          const isActive = step.status === 'active';

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-violet-50/50 border-violet-100 shadow-sm scale-[1.02]' 
                  : isDone
                  ? 'bg-slate-50/30 border-slate-100/60 opacity-80'
                  : 'bg-white border-transparent opacity-40'
              }`}
            >
              {/* Icon Status */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-scale-in" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>

              {/* Label */}
              <span className={`text-sm font-medium ${
                isActive 
                  ? 'text-violet-700 font-bold' 
                  : isDone 
                  ? 'text-slate-600' 
                  : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
