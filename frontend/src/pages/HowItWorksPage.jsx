import React from 'react';
import { Eye, ShieldCheck, Link, Database, Code, CheckSquare } from 'lucide-react';
import { MONAD_TESTNET } from '../services/config';

export function HowItWorksPage({ onNavigate }) {
  const steps = [
    {
      icon: <Link className="w-5 h-5" />,
      title: "1. NFT Identification",
      desc: "Paste an OpenSea URL. Our parser extracts the chain (Ethereum only for MVP), the token registry address, and the ID. It strictly rejects invalid paths and foreign marketplaces to ensure safety."
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "2. Blockchain Evidence Trace",
      desc: "We query Ethereum logs to trace raw transactions: verifying the deployment block, verifying the mint transaction, and mapping the custody transfer timeline from deployer to owner."
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "3. Metadata & Artwork Audit",
      desc: "We scan the Token URI and fetch the metadata files (from IPFS, Arweave, or servers). We calculate image fingerprints, hash CIDs, and search for visual style matches to scan for tampering."
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      title: "4. Creator Context & Research",
      desc: "We query web archives, creator registries, portfolios, and social metadata to collect claims explaining why the collection was built, why it exists, and who signed off on its launch."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "5. Cited Explanation & Anchoring",
      desc: `We structure all collected data and compose a verified story citing footnote evidence. The audit hash is anchored onto ${MONAD_TESTNET.name} using MetaMask, establishing a public proof checkpoint.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 animate-fade-in">
      
      <div className="text-center space-y-4">
        <span className="text-[10px] tracking-widest uppercase font-bold text-violet-600 bg-violet-50 px-3.5 py-1.5 rounded-full border border-violet-100/50">
          Auditing Pipeline
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
          How MetaMuse Works
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          From blockchain hashes to human meaning: a breakdown of the MetaMuse validation pipeline.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base mb-1.5">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-violet-50/50 border border-violet-100 rounded-3xl p-8 text-center space-y-4">
        <h4 className="font-serif text-xl font-bold text-slate-800">
          Ready to trace your first NFT?
        </h4>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-normal">
          Evaluate any OpenSea NFT or input contract details to query the evidence ledger.
        </p>
        <button
          onClick={() => onNavigate('analyze')}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
        >
          Open Analyzer
        </button>
      </div>

    </div>
  );
}
