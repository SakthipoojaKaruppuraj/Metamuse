import React, { useState } from 'react';
import { X, Copy, Check, LogOut, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';
import { formatAddress } from '../utils/formatAddress';
import { MONAD_TESTNET } from '../services/config';

/**
 * WalletModal
 * Full connection info overlay for MetaMask wallet options.
 */
export function WalletModal({ isOpen, onClose, wallet }) {
  if (!isOpen) return null;

  const { address, status, connect, disconnect, switchNetwork } = wallet;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const isWrong = status === 'wrong-network';
  const isConnected = status === 'connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-2xl border border-slate-100 max-w-sm w-full p-6 shadow-xl relative z-10 animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
          {isConnected ? 'Wallet Account' : 'Connect Wallet'}
        </h3>
        
        <p className="text-slate-500 text-xs mb-5 leading-relaxed">
          {isConnected 
            ? 'Your wallet is connected to MetaMuse.' 
            : 'Connect MetaMask to create and verify provenance attestations on Monad Testnet.'}
        </p>

        {isConnected && address ? (
          // Connected view
          <div className="space-y-4">
            {/* Address Row */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">
                  Connected Account
                </span>
                <p className="text-slate-800 font-mono text-sm font-semibold mt-0.5">
                  {formatAddress(address, 8)}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Network Info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Network: {MONAD_TESTNET.name}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={handleDisconnect}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </div>
        ) : isWrong ? (
          // Wrong network view
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs leading-normal">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Wrong Network Connection</p>
                <p className="text-amber-700/80 mt-0.5">Please switch your wallet network chain to Monad Testnet to perform blockchain actions.</p>
              </div>
            </div>

            <button 
              onClick={switchNetwork}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Switch to Monad Testnet
            </button>
            
            {address && (
              <button 
                onClick={handleDisconnect}
                className="w-full py-2.5 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Disconnect Account
              </button>
            )}
          </div>
        ) : (
          // Disconnected list
          <div className="space-y-3">
            {/* MetaMask Connector */}
            <button 
              onClick={connect}
              className="w-full flex items-center justify-between p-4 bg-violet-50 hover:bg-violet-100 border border-violet-100 hover:border-violet-200 rounded-xl transition-all text-left"
            >
              <div className="flex items-center gap-3">
                {/* Simulated Metamask Icon */}
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                  MM
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    MetaMask
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Connect using browser extension
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-violet-100/50 text-violet-600 font-bold px-2 py-0.5 rounded">
                Recommended
              </span>
            </button>

            <button 
              onClick={onClose}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
