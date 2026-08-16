import React, { useState } from 'react';
import { Search, AlertCircle, Sparkles, Link, Hash } from 'lucide-react';

export function AnalyzePage({ onAnalyzeUrl, onAnalyzeContract, error, steps, loading }) {
  const [activeTab, setActiveTab] = useState('opensea'); // 'opensea' | 'contract'
  const [openseaUrl, setOpenseaUrl] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');

  const handleOSSubmit = (e) => {
    e.preventDefault();
    onAnalyzeUrl(openseaUrl);
  };

  const handleContractSubmit = (e) => {
    e.preventDefault();
    onAnalyzeContract(contractAddress, tokenId);
  };

  // Preset fills to make testing smooth
  const applyPreset = (presetType) => {
    if (presetType === 'genesis') {
      setActiveTab('opensea');
      setOpenseaUrl('https://opensea.io/assets/ethereum/0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2/1837');
    } else if (presetType === 'artifact') {
      setActiveTab('contract');
      setContractAddress('0x3F91A279Fc8291C2eA64a2757279fC8291C292B');
      setTokenId('721');
    } else if (presetType === 'divergent') {
      setActiveTab('opensea');
      setOpenseaUrl('https://opensea.io/assets/ethereum/0x9e2a2757279fc8291c2ea64a2757279fc8291a7b/44');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-slate-800">
          Analyze an NFT
        </h1>
        <p className="text-slate-500 text-sm">
          Give MetaMuse an OpenSea NFT credentials and we'll audit its story.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        
        {/* Tab Buttons */}
        <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100/50 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('opensea')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'opensea' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            OpenSea URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contract' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Contract & ID
          </button>
        </div>

        {/* Tab Panel 1: OpenSea */}
        {activeTab === 'opensea' ? (
          <form onSubmit={handleOSSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="os-input" className="text-[10px] uppercase font-bold text-slate-400">
                Paste OpenSea NFT URL
              </label>
              <div className="relative">
                <input 
                  id="os-input"
                  type="text"
                  placeholder="https://opensea.io/assets/ethereum/0x7a3f2d79.../1837"
                  value={openseaUrl}
                  onChange={(e) => setOpenseaUrl(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold p-3 bg-red-50/50 border border-red-50 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !openseaUrl}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Analyze NFT
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              Currently supported: OpenSea • Ethereum network only
            </p>
          </form>
        ) : (
          // Tab Panel 2: Contract Address
          <form onSubmit={handleContractSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="contract-input" className="text-[10px] uppercase font-bold text-slate-400">
                  Contract Address
                </label>
                <input 
                  id="contract-input"
                  type="text"
                  placeholder="0x7A3F2d79F9C0143891C2eA64a2757279fC..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="token-input" className="text-[10px] uppercase font-bold text-slate-400">
                  Token ID
                </label>
                <input 
                  id="token-input"
                  type="text"
                  placeholder="1837"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:bg-white transition-colors"
                />
              </div>

            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold p-3 bg-red-50/50 border border-red-50 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !contractAddress || !tokenId}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Analyze NFT
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              ERC-721 token standards supported on Ethereum network
            </p>
          </form>
        )}
      </div>

      {/* Preset Quick Links */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          Test Fictional Preset Demos
        </span>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => applyPreset('genesis')}
            className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-violet-200 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span>MetaMuse Demo Genesis #1837 (High Verification)</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-100">
              Preset A
            </span>
          </button>
          <button
            onClick={() => applyPreset('artifact')}
            className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-violet-200 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span>MetaMuse Lost Artifact #721 (Inferred Info)</span>
            <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-100">
              Preset B
            </span>
          </button>
          <button
            onClick={() => applyPreset('divergent')}
            className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-violet-200 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span>MetaMuse Divergent Art #44 (Verification Mismatch)</span>
            <span className="text-[9px] bg-violet-50 text-violet-600 font-bold px-2 py-0.5 rounded border border-violet-100">
              Preset C
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
