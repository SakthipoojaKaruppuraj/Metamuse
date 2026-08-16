import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp, Image as ImageIcon, Sparkles, BookOpen } from 'lucide-react';
import { NFTIdentityCard } from '../components/NFTIdentityCard';
import { WhyThisNFTExists } from '../components/WhyThisNFTExists';
import { ProvenanceGraph } from '../components/ProvenanceGraph';
import { ProvenanceConfidence } from '../components/ProvenanceConfidence';
import { SourceCard } from '../components/SourceCard';
import { AttestationCard } from '../components/AttestationCard';
import { VerificationCard } from '../components/VerificationCard';
import { formatAddress } from '../utils/formatAddress';
import { formatHash } from '../utils/formatHash';
import { provenanceService } from '../services/provenanceService';

export function NFTResultPage({ nft, wallet, attestationHook, onNavigateToAnalyze }) {
  if (!nft) return null;

  const [activeSection, setActiveSection] = useState('overview');
  const [techOpen, setTechOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [evidenceFilter, setEvidenceFilter] = useState('all'); // 'all' | 'on-chain' | 'metadata' | 'project' | 'artwork'

  const graphData = provenanceService.getProvenanceGraph(nft);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'provenance', label: 'Provenance' },
    { id: 'evidence', label: 'Evidence & Context' },
    { id: 'attestation', label: 'Monad Attestation' }
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // Monitor scrolling to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(`section-${section.id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter evidence sources
  const filteredEvidence = nft.evidence.filter(item => {
    if (evidenceFilter === 'all') return true;
    return item.type.toLowerCase() === evidenceFilter;
  });

  // Calculate evidence statistics
  const stats = {
    total: nft.evidence.length,
    onChain: nft.evidence.filter(e => e.type === 'on-chain').length,
    metadata: nft.evidence.filter(e => e.type === 'metadata').length,
    project: nft.evidence.filter(e => e.type === 'project').length,
    artwork: nft.evidence.filter(e => e.type === 'artwork').length
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-100 pb-6 mb-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded border border-violet-100/50">
              {nft.network} Ethereum
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
              ERC-721
            </span>
            {nft.id.startsWith('custom-') && (
              <span className="text-[10px] tracking-wider uppercase font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-100 animate-pulse">
                Sandbox Mode
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mt-2.5">
            {nft.name}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Collection: <span className="text-slate-600 font-semibold">{nft.collectionName}</span>
          </p>
        </div>

        {/* Action Handles */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleCopy(nft.contractAddress, 'header-contract')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
          >
            {copiedField === 'header-contract' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            Copy Contract
          </button>
          
          <a 
            href={nft.openseaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-100 rounded-xl text-xs font-bold transition-all"
          >
            View on OpenSea
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* 2. GRID LAYOUT WITH STICKY SIDE NAV */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sticky Left Navigation (Desktops only) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-4 px-2">
              Assessment Story
            </span>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleScrollTo(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    activeSection === sec.id 
                      ? 'bg-violet-50 text-violet-700 shadow-[0_2px_4px_rgba(153,111,214,0.05)] border-l-4 border-violet-500 pl-2' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
            <h5 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Verification State
            </h5>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                <span className="text-slate-500">Confidence</span>
                <span className="font-bold text-slate-800">{nft.confidence.score}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Monad Registry</span>
                <span className={`font-bold ${
                  attestationHook.attestation ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {attestationHook.attestation ? 'Attested' : 'Not Attested'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-16">
          
          {/* ==================== SECTION: OVERVIEW ==================== */}
          <section id="section-overview" className="scroll-mt-24 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Artwork Container Card */}
              <div className="md:col-span-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative group">
                <div className="rounded-xl overflow-hidden aspect-square bg-slate-50 border border-slate-100/50 flex items-center justify-center relative">
                  <img 
                    src={nft.artworkUrl} 
                    alt={nft.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Subtle fingerprint indicator overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[8px] font-mono px-2 py-1 rounded">
                    FP: {formatHash(nft.imageHash || "0xIMAGE", 6, 6)}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between text-xs border-t border-slate-50 pt-3">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    Metadata Checksum
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>

              {/* Core Assessment Explanation */}
              <div className="md:col-span-7">
                <WhyThisNFTExists 
                  explanation={nft.explanation} 
                  sourcesCount={nft.evidence.length}
                />
              </div>

            </div>

            {/* Standard Details Identity Card */}
            <NFTIdentityCard nft={nft} />
          </section>


          {/* ==================== SECTION: PROVENANCE ==================== */}
          <section id="section-provenance" className="scroll-mt-24 space-y-8 border-t border-slate-100 pt-12">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase font-bold text-violet-500">
                Audited Path logs
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-800 mt-1">
                Custody Provenance
              </h2>
            </div>

            {/* Interactive SVG Provenance Graph */}
            <ProvenanceGraph graphData={graphData} />

            {/* Provenance Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-6">
                Chronological Provenance Timeline
              </h3>

              <div className="relative pl-6 border-l border-slate-100 space-y-8">
                {nft.provenanceEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center shadow-[0_2px_4px_rgba(153,111,214,0.15)]" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                            {evt.event}
                          </h4>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {evt.status}
                          </span>
                        </div>
                        <p className="text-slate-450 text-[10px] mt-1">
                          Actor Wallet: <span className="font-mono text-slate-650 font-semibold">{formatAddress(evt.wallet, 8)}</span>
                        </p>
                      </div>

                      <div className="flex md:flex-col items-start md:items-end justify-between text-xs">
                        <span className="text-slate-500 font-semibold">{evt.date}</span>
                        <a 
                          href={`https://etherscan.io/tx/${evt.tx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 font-mono hover:underline font-bold text-[10px] flex items-center gap-0.5 mt-0.5"
                        >
                          {formatHash(evt.tx, 6, 4)}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* ==================== SECTION: EVIDENCE & CONTEXT ==================== */}
          <section id="section-evidence" className="scroll-mt-24 space-y-8 border-t border-slate-100 pt-12">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase font-bold text-violet-500">
                Audited Verification Assets
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-800 mt-1">
                Evidence & Context
              </h2>
            </div>

            {/* Artwork Context (Image traits and similarity scan) */}
            {nft.artworkContext && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Artwork Characteristics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Traits List */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      Visual & Metadata Attributes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nft.artworkContext.traits.map((trait, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                          <span className="text-[8px] uppercase font-bold text-slate-400">{trait.type} Trait</span>
                          <p className="font-semibold text-slate-700 text-xs mt-0.5">{trait.name}</p>
                          <p className="font-bold text-violet-600 text-xs mt-0.5">{trait.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Similarity analysis card */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-3.5">
                    <h5 className="font-bold text-slate-700 text-xs">Style Sim Scanner</h5>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
                      <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                        <img src={nft.artworkContext.similarity.artworkUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold">Closest match</p>
                        <p className="text-xs font-bold text-slate-700">{nft.artworkContext.similarity.nftName}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          {nft.artworkContext.similarity.score}
                        </span>
                        <span className="text-[8px] font-bold block text-slate-400 mt-0.5">INFERRED</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Disclaimer: {nft.artworkContext.similarity.disclaimer}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Project Creator Context */}
            {nft.projectContext && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Project Context
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-bold uppercase">Creator / Studio</p>
                    <p className="text-slate-800 font-serif text-lg font-bold leading-tight">{nft.projectContext.creatorName}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{nft.projectContext.description}</p>
                  </div>
                  <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Project Purpose</p>
                      <p className="text-slate-700 text-xs font-semibold mt-0.5">{nft.projectContext.purpose}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Historical Context</p>
                      <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{nft.projectContext.historicalContext}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence summary counters */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Evidence stats header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-5">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Evidence summary
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {stats.total} Sources
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {stats.onChain} On-chain Facts
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {stats.project + stats.metadata} External Sources
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                      {stats.artwork} Artwork Scan
                    </span>
                  </div>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  {['all', 'on-chain', 'metadata', 'project', 'artwork'].map(f => (
                    <button
                      key={f}
                      onClick={() => setEvidenceFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        evidenceFilter === f 
                          ? 'bg-white text-violet-600 shadow-sm border border-slate-100' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredEvidence.map((src) => (
                  <div key={src.id} id={`evidence-card-${src.id}`} className="scroll-mt-28 transition-all duration-300">
                    <SourceCard source={src} />
                  </div>
                ))}
              </div>
            </div>

            {/* Provenance Confidence Breakdown Component */}
            <ProvenanceConfidence confidence={nft.confidence} />
          </section>


          {/* ==================== SECTION: MONAD ATTESTATION ==================== */}
          <section id="section-attestation" className="scroll-mt-24 space-y-8 border-t border-slate-100 pt-12">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider uppercase font-bold text-violet-500">
                Attestation registry anchor
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-800 mt-1">
                Monad Testnet Registry
              </h2>
            </div>

            {/* Attestation card coordinating state machines */}
            <AttestationCard 
              nft={nft} 
              wallet={wallet} 
              attestationHook={attestationHook} 
            />

            {/* Verification card comparison matches */}
            {attestationHook.attestation && (
              <VerificationCard verification={attestationHook.verification} />
            )}

            {/* 11. Collapsible Technical Details (Strictly secondary) */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setTechOpen(!techOpen)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-700 hover:bg-slate-100/50 transition-colors text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>Raw Technical Blockchain Details</span>
                {techOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {techOpen && (
                <div className="p-5 border-t border-slate-100 bg-white text-xs space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Contract Address</span>
                        <p className="font-mono text-slate-700 break-all select-all">{nft.contractAddress}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Token ID</span>
                        <p className="font-mono text-slate-700 select-all">{nft.tokenId}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Token Standard</span>
                        <p className="font-semibold text-slate-700">{nft.tokenStandard}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Token URI</span>
                        <p className="font-mono text-slate-500 break-all select-all">{nft.tokenUri}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Metadata URI</span>
                        <p className="font-mono text-slate-500 break-all select-all">{nft.metadataUri}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Image Hash (SHA-256 fingerprint)</span>
                        <p className="font-mono text-slate-700 break-all select-all">{nft.imageHash || 'Not calculated'}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Metadata Hash (Keccak-256)</span>
                        <p className="font-mono text-slate-700 break-all select-all">{nft.metadataHash || 'Not calculated'}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Mint Transaction Hash</span>
                        <p className="font-mono text-slate-700 break-all select-all">{nft.mintTx}</p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400">Registry Anchor status</span>
                        <p className="font-bold text-slate-700">{attestationHook.attestation ? 'Attested' : 'Not Attested'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Analysis navigation controls */}
          <div className="flex justify-center border-t border-slate-100 pt-8">
            <button
              onClick={onNavigateToAnalyze}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Analyze Another NFT
            </button>
          </div>

        </main>
      </div>
      
    </div>
  );
}
