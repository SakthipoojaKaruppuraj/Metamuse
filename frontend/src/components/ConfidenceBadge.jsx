import React from 'react';
import { ShieldCheck, FileText, HelpCircle, AlertCircle, Cpu } from 'lucide-react';

/**
 * Renders a standardized trust confidence badge.
 * Values: VERIFIED, SOURCE-BACKED, INFERRED, AI-INTERPRETATION, UNKNOWN
 */
export function ConfidenceBadge({ confidence }) {
  if (!confidence) return null;

  const value = confidence.toUpperCase();

  let styles = {};
  let icon = null;
  let label = value;

  switch (value) {
    case 'VERIFIED':
      styles = {
        backgroundColor: '#ECFDF5',
        color: '#059669',
        borderColor: '#A7F3D0'
      };
      icon = <ShieldCheck className="w-3 h-3" />;
      label = "Verified Fact";
      break;

    case 'SOURCE-BACKED':
      styles = {
        backgroundColor: '#F5F0FB',
        color: '#996FD6',
        borderColor: '#E8DDF7'
      };
      icon = <FileText className="w-3 h-3" />;
      label = "Source-Backed";
      break;

    case 'INFERRED':
      styles = {
        backgroundColor: '#FFFBEB',
        color: '#D97706',
        borderColor: '#FDE68A'
      };
      icon = <HelpCircle className="w-3 h-3" />;
      label = "Inferred Claim";
      break;

    case 'AI-INTERPRETATION':
    case 'AI INTERPRETATION':
      styles = {
        backgroundColor: '#EFF6FF',
        color: '#2563EB',
        borderColor: '#BFDBFE'
      };
      icon = <Cpu className="w-3 h-3" />;
      label = "AI Interpretation";
      break;

    case 'UNKNOWN':
    default:
      styles = {
        backgroundColor: '#F3F4F6',
        color: '#4B5563',
        borderColor: '#E5E7EB'
      };
      icon = <AlertCircle className="w-3 h-3" />;
      label = "Unverified / Unknown";
      break;
  }

  return (
    <span 
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={styles}
    >
      {icon}
      {label}
    </span>
  );
}
