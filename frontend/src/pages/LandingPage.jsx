import React from 'react';
import { Eye, FileCheck, ArrowRight, ShieldCheck, Database, FileText, CheckCircle2, HelpCircle, Network, ArrowRightLeft } from 'lucide-react';
import { MONAD_TESTNET } from '../services/config';

export function LandingPage({ onNavigate, onPresetSelect }) {
  return (
    <div className="space-y-24 pb-20 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 text-center">
        <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100/50">
          NFT PROVENANCE • CONTEXT • EVIDENCE
        </span>
        
        <h1 className="font-serif text-4xl md:text-6xl font-black text-slate-800 tracking-tight mt-6 leading-[1.1] max-w-4xl mx-auto">
          NFTs tell you what you own.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">MetaMuse tells you why it exists.</span>
        </h1>

        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
          MetaMuse analyzes an NFT's on-chain history, metadata, artwork, and project context to explain what it represents, where it came from, and why it was created.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => onNavigate('analyze')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            Analyze an NFT
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            How it works
          </button>
        </div>

        {/* Hero Visual Card: Live Mock assessment Preview */}
        <div className="max-w-4xl mx-auto mt-16 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative text-left">
          
          <span className="absolute right-6 top-6 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
            Preview Demo
          </span>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Artwork visual preview */}
            <div className="md:col-span-4 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square shadow-sm flex items-center justify-center relative group">
              <img 
                src="https://picsum.photos/id/1025/400/400" 
                alt="Demo NFT Artwork"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Assessment Details */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">
                  Collection: MetaMuse Demo Genesis
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-800 mt-1">
                  MetaMuse Demo Genesis #1837
                </h3>
              </div>

              <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-xl">
                <span className="text-[9px] uppercase tracking-wider font-bold text-violet-500">
                  Why This NFT Exists
                </span>
                <p className="text-slate-600 text-xs leading-relaxed mt-1">
                  This NFT belongs to MetaMuse Demo Genesis, a digital identity collection created to explore how ownership and identity can be represented through programmable digital art...
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                  <FileText className="w-3 h-3" />
                  5 Evidence Sources
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" />
                  95% Provenance Confidence
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  Not Yet Attested
                </span>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => onPresetSelect('genesis-1837')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  Explore Assessment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-serif text-3xl font-bold text-slate-800">
            Ownership is not understanding.
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Marketplaces prove what you own. They rarely explain what you're actually looking at.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4 border border-violet-100/50">
              01
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Ownership</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              You can verify who owns the NFT based on ledger registrations.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4 border border-violet-100/50">
              02
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Metadata</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              You can see traits, attributes, and stored artwork CIDs.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4 border border-violet-100/50">
              03
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Context</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              But the story behind the artwork—its meaning and creators—is missing.
            </p>
          </div>
          {/* Card 4 */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4 border border-violet-100/50">
              04
            </div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Provenance</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              The paths from the contract deploy to current custody are complex.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION PIPELINE */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-slate-800">
              From NFT to meaning.
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              How MetaMuse converts a block registry ID into an audited, explainable story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <span className="text-5xl font-black text-violet-100 absolute -top-5 -left-2 z-0 font-serif">01</span>
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-sm mb-2 mt-4">Identify</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Enter an OpenSea URL. We validate parameters and extract the ERC-721 target credentials.
                </p>
              </div>
            </div>
            <div className="relative">
              <span className="text-5xl font-black text-violet-100 absolute -top-5 -left-2 z-0 font-serif">02</span>
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-sm mb-2 mt-4">Trace</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  We parse on-chain transactions, contract signatures, IPFS metadata logs, and artist archives.
                </p>
              </div>
            </div>
            <div className="relative">
              <span className="text-5xl font-black text-violet-100 absolute -top-5 -left-2 z-0 font-serif">03</span>
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-sm mb-2 mt-4">Explain</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  We analyze the collected details, compiling a structured, cited report answering why the asset was created.
                </p>
              </div>
            </div>
            <div className="relative">
              <span className="text-5xl font-black text-violet-100 absolute -top-5 -left-2 z-0 font-serif">04</span>
              <div className="relative z-10">
                <h4 className="font-bold text-slate-800 text-sm mb-2 mt-4">Verify</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Anchor the audited package checksums on {MONAD_TESTNET.name} for tamper-proof verification checks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MONAD ATTESTATION SUMMARY */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none text-white font-black text-9xl">
            L1
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Verifiable Anchoring
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold">
                Anchored to Monad
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                By anchoring our assessed evidence checksums on Monad Testnet, MetaMuse creates a tamper-proof provenance register. Anyone can verify that the metadata remains unchanged.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('analyze')}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Test Attestation Flow
                </button>
              </div>
            </div>

            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Attested State</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Verified</span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 font-bold block">Attestation ID</span>
                <span className="text-slate-300 font-mono text-[10px]">0x19BCbC8eA...214a</span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 font-bold block">Chain Commit Registry</span>
                <span className="text-slate-300 text-[10px] font-semibold">{MONAD_TESTNET.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-6 text-center py-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          Don't just know what you own.<br />
          <span className="text-violet-600">Understand it.</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-4 leading-normal">
          Uncover the stories, timelines, and verified context behind any Ethereum OpenSea NFT now.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => onNavigate('analyze')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            Analyze NFT
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            See How It Works
          </button>
        </div>
      </section>
      
    </div>
  );
}
