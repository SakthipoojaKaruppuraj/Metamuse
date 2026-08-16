import React from 'react';
import { CheckCircle2, HelpCircle, Shield, AlertCircle } from 'lucide-react';

/**
 * ProvenanceConfidence
 * Explains how the confidence score was calculated based on metadata check criteria.
 */
export function ProvenanceConfidence({ confidence }) {
  if (!confidence) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return '#059669'; // Emerald
    if (score >= 70) return '#996FD6'; // Violet
    if (score >= 50) return '#D97706'; // Amber
    return '#DC2626'; // Red
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return '#ECFDF5';
    if (score >= 70) return '#F5F0FB';
    if (score >= 50) return '#FFFBEB';
    return '#FEF2F2';
  };

  const getCriteriaIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'strong':
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'source-backed':
      case 'moderate':
        return <CheckCircle2 className="w-4 h-4 text-violet-500" />;
      case 'inferred':
      case 'weak':
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case 'unknown':
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-5">
        Provenance Confidence Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Circle Hero */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-50 bg-slate-50/50">
          <div 
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 relative"
            style={{ 
              borderColor: getScoreColor(confidence.score),
              backgroundColor: getScoreBackground(confidence.score)
            }}
          >
            <span 
              className="text-3xl font-black"
              style={{ color: getScoreColor(confidence.score) }}
            >
              {confidence.score}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
              Confidence
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 mt-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-violet-500" />
            {confidence.score >= 90 ? 'Highly Verified' : confidence.score >= 70 ? 'Source Verified' : 'Partially Inferred'}
          </span>
        </div>

        {/* Detailed Criteria List */}
        <div className="md:col-span-2 space-y-3.5">
          {confidence.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-600 text-sm font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${
                  item.status.toLowerCase() === 'strong' ? 'text-emerald-700' :
                  item.status.toLowerCase() === 'source-backed' ? 'text-violet-700' :
                  item.status.toLowerCase() === 'inferred' ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  {item.status}
                </span>
                {getCriteriaIcon(item.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
