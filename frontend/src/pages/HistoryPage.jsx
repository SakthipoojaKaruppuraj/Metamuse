import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Clock, CheckCircle2, Shield, Eye } from 'lucide-react';

export function HistoryPage({ historyList, onSelectNFT, onNavigateToAnalyze }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'attested' | 'not-attested'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'confidence'

  // Filter history
  const filteredList = historyList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tokenId.includes(searchTerm);

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'attested' && item.attestation && item.attestation.status === 'attested') ||
      (statusFilter === 'not-attested' && (!item.attestation || item.attestation.status === 'not-attested'));

    return matchesSearch && matchesStatus;
  });

  // Sort history
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortOrder === 'confidence') {
      return b.confidence.score - a.confidence.score;
    }
    // Default: newest first (assuming presets are in order or we sort by date mock value)
    return b.id.localeCompare(a.id); 
  });

  if (historyList.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-350 mx-auto mb-6">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-800 mb-2">
          No NFT analyses yet.
        </h3>
        <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
          Start by submitting an OpenSea URL to build your first evidence-backed provenance report.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Analyze your first NFT
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-800">
          Analysis History
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Search and view previously evaluated provenance audits.
        </p>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by collection or token ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 px-10 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-450" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Attestations</option>
              <option value="attested">Monad Attested</option>
              <option value="not-attested">Not Attested</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-450" />
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="newest">Sort by Newest</option>
              <option value="confidence">Sort by Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Audits */}
      <div className="space-y-4">
        {sortedList.length > 0 ? (
          sortedList.map((item) => {
            const isAttested = item.attestation && item.attestation.status === 'attested';

            return (
              <div 
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                
                {/* Left: Thumbnail & Name info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img 
                      src={item.artworkUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-450">
                      {item.network} • {item.tokenStandard}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight mt-0.5">
                      {item.name}
                    </h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">
                      Audited on {item.mintDate}
                    </p>
                  </div>
                </div>

                {/* Right: Confidence Score & Attestation Tag */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0 border-slate-50">
                  
                  {/* Confidence block */}
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Confidence
                    </span>
                    <span className={`text-sm font-black mt-0.5 ${
                      item.confidence.score >= 90 ? 'text-emerald-600' :
                      item.confidence.score >= 70 ? 'text-violet-600' : 'text-amber-600'
                    }`}>
                      {item.confidence.score}% score
                    </span>
                  </div>

                  {/* Attestation Tag */}
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Monad Registry
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 ${
                      isAttested 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {isAttested ? <CheckCircle2 className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {isAttested ? 'Attested' : 'Not Attested'}
                    </span>
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={() => onSelectNFT(item)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-400 hover:text-violet-600 border border-slate-100 hover:border-violet-100 transition-colors cursor-pointer"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs">
            No audits matched your search filters.
          </div>
        )}
      </div>

    </div>
  );
}
