import React from 'react';
import { Wallet, ShieldAlert, Loader2 } from 'lucide-react';
import { formatAddress } from '../utils/formatAddress';

/**
 * WalletButton
 * Renders connection button reflecting active MetaMask state.
 */
export function WalletButton({ wallet, onOpenModal }) {
  const { address, status, connect, switchNetwork } = wallet;

  if (status === 'connecting') {
    return (
      <button 
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-xs font-semibold"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (status === 'switching-network') {
    return (
      <button 
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-xs font-semibold animate-pulse"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Switching...
      </button>
    );
  }

  if (status === 'wrong-network') {
    return (
      <button 
        onClick={switchNetwork}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm animate-shake"
      >
        <ShieldAlert className="w-3.5 h-3.5 animate-bounce" />
        Switch Chain
      </button>
    );
  }

  if (status === 'connected' && address) {
    return (
      <div className="flex items-center gap-2.5">
        <button 
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {/* Connection Dot Indicator */}
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
          <span>{formatAddress(address, 4)}</span>
        </button>
      </div>
    );
  }

  // Disconnected state
  return (
    <button 
      onClick={connect}
      className="inline-flex items-center gap-2 px-4.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
    >
      <Wallet className="w-3.5 h-3.5" />
      Connect MetaMask
    </button>
  );
}
