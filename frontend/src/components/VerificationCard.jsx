import React from 'react';
import { ShieldCheck, ShieldAlert, Shield, AlertTriangle } from 'lucide-react';
import { formatHash } from '../utils/formatHash';

/**
 * VerificationCard
 * Compares current local metadata hashes against registered blockchain hashes.
 * Displays MATCH, MISMATCH, or UNVERIFIED status.
 */
export function VerificationCard({ verification }) {
  const { status, currentHash, attestedHash, message } = verification;

  if (status === 'unverified' || !status) {
    return (
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50 mx-auto mb-3">
          <Shield className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-slate-700 text-xs mb-1">
          Independent Verification Registry
        </h4>
        <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs mx-auto">
          No verification state loaded. Attest the NFT metadata on Monad or run verification to compare hash commitments.
        </p>
      </div>
    );
  }

  const isMatch = status === 'match';

  return (
    <div 
      className={`rounded-2xl border p-6 transition-all duration-200 ${
        isMatch 
          ? 'bg-emerald-50/20 border-emerald-100' 
          : 'bg-amber-50/20 border-amber-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b pb-4 border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isMatch 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-amber-50 text-amber-600 border-amber-100'
          }`}>
            {isMatch ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">
              Attestation Verification
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Cryptographic evidence comparison registry check
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isMatch 
              ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-100/50 text-amber-700 border-amber-200'
          }`}
        >
          {isMatch ? '✓ VERIFIED MATCH' : '⚠ ATTENTION: MISMATCH'}
        </span>
      </div>

      {/* Hash Comparison Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current Hash */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">
            Current Evidence Hash
          </span>
          <span className="text-slate-700 font-mono text-xs font-semibold select-all mt-1 bg-slate-50 p-2 rounded border border-slate-100/40 break-all leading-relaxed">
            {currentHash ? formatHash(currentHash, 10, 10) : '0xNone'}
          </span>
        </div>

        {/* Attested Hash */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">
            Attested Monad Hash
          </span>
          <span className="text-slate-700 font-mono text-xs font-semibold select-all mt-1 bg-slate-50 p-2 rounded border border-slate-100/40 break-all leading-relaxed">
            {attestedHash ? formatHash(attestedHash, 10, 10) : '0xNone'}
          </span>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex items-start gap-3 mt-4 ${
        isMatch 
          ? 'bg-emerald-50/50 border-emerald-50 text-emerald-800' 
          : 'bg-amber-50/50 border-amber-50/50 text-amber-800'
      }`}>
        {!isMatch && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
        <div className="text-xs leading-normal">
          <p className="font-bold mb-0.5">
            {isMatch ? 'Evidence Lock Secure' : 'Integrity Alert'}
          </p>
          <p className={isMatch ? 'text-emerald-700/80' : 'text-amber-700/80'}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
