import React from 'react';
import { MetaMuseLogo } from './MetaMuseLogo';
import { WalletButton } from './WalletButton';
import { Network } from 'lucide-react';
import { MONAD_TESTNET } from '../services/config';

export function Navbar({ activeView, onNavigate, wallet, onOpenWalletModal }) {
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'history', label: 'History' },
    { id: 'how-it-works', label: 'How It Works' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand logo */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1 focus:outline-none cursor-pointer"
        >
          <MetaMuseLogo />
        </button>

        {/* Center: Navigation Links */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === item.id || (item.id === 'analyze' && activeView === 'result')
                  ? 'bg-white text-violet-600 shadow-sm border border-slate-100/40'
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Network indicator & Wallet button */}
        <div className="flex items-center gap-3">
          {/* Network Indicator Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-550">
            <Network className="w-3.5 h-3.5 text-violet-500" />
            <span>{MONAD_TESTNET.name}</span>
          </div>

          <WalletButton 
            wallet={wallet} 
            onOpenModal={onOpenWalletModal} 
          />
        </div>

      </div>
    </nav>
  );
}
