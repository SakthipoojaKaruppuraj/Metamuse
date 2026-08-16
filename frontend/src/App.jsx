import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { NFTResultPage } from './pages/NFTResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AnalysisProgress } from './components/AnalysisProgress';
import { useWallet } from './hooks/useWallet';
import { useNFTAnalysis } from './hooks/useNFTAnalysis';
import { useAttestation } from './hooks/useAttestation';
import { MOCK_NFTS } from './data/mockNFT';
import { Shield, Sparkles, AlertCircle, Terminal, Minimize2, Maximize2 } from 'lucide-react';
import { APP_MODE } from './services/config';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'analyze' | 'result' | 'history' | 'how-it-works'
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  // Pre-load history list with our 3 fictional presets
  const [historyList, setHistoryList] = useState([
    { ...MOCK_NFTS['genesis-1837'] },
    { ...MOCK_NFTS['lost-artifact-721'] },
    { ...MOCK_NFTS['divergent-art-44'] }
  ]);

  // Hook integrations
  const wallet = useWallet();
  const analysis = useNFTAnalysis();
  const attestationHook = useAttestation(analysis.result);

  const handleNavigate = (targetView) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (targetView === 'analyze') {
      analysis.resetAnalysis();
    }
  };

  const handleSelectNFT = (nft) => {
    analysis.resetAnalysis();
    // Resolve NFT loads directly into analysis result
    analysis.setError("");
    // Create new copy to trigger useEffect checks in result
    analysis.resetAnalysis();
    setTimeout(() => {
      // Force injection of result details directly without step loading
      nftServiceOverride(nft);
    }, 100);
  };

  // Skip step load to view direct preset details
  const nftServiceOverride = (nft) => {
    analysis.resetAnalysis();
    analysis.setError("");
    // Inject selected item directly
    analysis.resetAnalysis();
    // Set resolved item
    const customResultSetter = () => {
      // We manually bind setter mocks inside analysis hook or write custom resolver helper
    };
    // Force active result set
    analysis.resetAnalysis();
    // We can simulate an instant step loader for smooth visuals
    analysis.analyzeContractAndToken(nft.contractAddress, nft.tokenId).then(() => {
      setView('result');
    });
  };

  const handlePresetSelect = (presetKey) => {
    const nft = MOCK_NFTS[presetKey];
    if (nft) {
      handleSelectNFT(nft);
    }
  };

  const handleAnalyzeUrl = async (url) => {
    const nft = await analysis.analyzeUrl(url);
    if (nft) {
      // Add analyzed record to history if it doesn't already exist
      setHistoryList(prev => {
        if (prev.some(item => item.contractAddress === nft.contractAddress && item.tokenId === nft.tokenId)) {
          return prev;
        }
        return [nft, ...prev];
      });
      setView('result');
    }
  };

  const handleAnalyzeContract = async (contract, token) => {
    const nft = await analysis.analyzeContractAndToken(contract, token);
    if (nft) {
      setHistoryList(prev => {
        if (prev.some(item => item.contractAddress === nft.contractAddress && item.tokenId === nft.tokenId)) {
          return prev;
        }
        return [nft, ...prev];
      });
      setView('result');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#17151A] flex flex-col font-sans relative antialiased selection:bg-violet-100 selection:text-violet-900">
      
      {/* Global Navbar */}
      <Navbar 
        activeView={view} 
        onNavigate={handleNavigate} 
        wallet={wallet} 
        onOpenWalletModal={() => setWalletModalOpen(true)}
      />

      {/* Main Page Layout Wrapper */}
      <div className="flex-grow">
        
        {/* Render Step Checklist Loader */}
        {analysis.loading ? (
          <div className="py-20">
            <AnalysisProgress steps={analysis.steps} />
          </div>
        ) : (
          <>
            {view === 'landing' && (
              <LandingPage 
                onNavigate={handleNavigate} 
                onPresetSelect={handlePresetSelect} 
              />
            )}

            {view === 'analyze' && (
              <AnalyzePage 
                onAnalyzeUrl={handleAnalyzeUrl}
                onAnalyzeContract={handleAnalyzeContract}
                error={analysis.error}
                loading={analysis.loading}
              />
            )}

            {view === 'result' && analysis.result && (
              <NFTResultPage 
                nft={analysis.result}
                wallet={wallet}
                attestationHook={attestationHook}
                onNavigateToAnalyze={() => handleNavigate('analyze')}
              />
            )}

            {view === 'history' && (
              <HistoryPage 
                historyList={historyList}
                onSelectNFT={handleSelectNFT}
                onNavigateToAnalyze={() => handleNavigate('analyze')}
              />
            )}

            {view === 'how-it-works' && (
              <HowItWorksPage 
                onNavigate={handleNavigate} 
              />
            )}
          </>
        )}
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-serif font-black text-slate-800 text-lg">MetaMuse</span>
            <p className="text-slate-400 text-xs">
              Know what you own. Understand why it exists.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <button onClick={() => handleNavigate('landing')} className="hover:text-violet-650 cursor-pointer">Home</button>
            <button onClick={() => handleNavigate('analyze')} className="hover:text-violet-650 cursor-pointer">Analyze</button>
            <button onClick={() => handleNavigate('history')} className="hover:text-violet-650 cursor-pointer">History</button>
            <button onClick={() => handleNavigate('how-it-works')} className="hover:text-violet-650 cursor-pointer">How It Works</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center md:text-left text-[10px] text-slate-400 mt-6 border-t border-slate-100 pt-6">
          © {new Date().getFullYear()} MetaMuse Provenance Audit Registry. Clearly fictional demo preset records for preview purposes.
        </div>
      </footer>

      {/* Global Wallet Settings Modal */}
      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={() => setWalletModalOpen(false)} 
        wallet={wallet}
      />

      {/* DEV STATE CONTROL PANEL */}
      {/* Exposes overrides conditionally in development environment configs */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          
          {/* Subtle panel collapse toggle button */}
          <button 
            onClick={() => setDevPanelOpen(!devPanelOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold shadow-lg hover:bg-slate-800 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
            <span>Dev Control Panel</span>
            {devPanelOpen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>

          {/* Panel Controls */}
          {devPanelOpen && (
            <div className="mt-2 bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl p-4 w-72 shadow-2xl space-y-4 animate-scale-in text-xs">
              
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-violet-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold uppercase tracking-wider text-[10px]">Mock State Switcher</span>
              </div>

              {APP_MODE === "real" ? (
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-slate-400 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-500">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    <span>Real Mode Active</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Mock state overrides are disabled. Real MetaMask and Monad Testnet connections are the source of truth.
                  </p>
                </div>
              ) : (
                <>
                  {/* Wallet Controls */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">1. Wallet State</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button 
                        onClick={() => wallet.setMockState({ status: 'disconnected', address: null })}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold cursor-pointer"
                      >
                        Disconnect
                      </button>
                      <button 
                        onClick={() => wallet.setMockState({ status: 'wrong-network', address: '0xA82fF8eA85F2C9012a64A27579fC8291C2791F9a', chainId: 1 })}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold text-amber-400 cursor-pointer"
                      >
                        Wrong Net
                      </button>
                      <button 
                        onClick={() => wallet.setMockState({ status: 'connected', address: '0xA82fF8eA85F2C9012a64A27579fC8291C2791F9a', chainId: 10143 })}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold text-emerald-400 cursor-pointer"
                      >
                        Connected
                      </button>
                    </div>
                  </div>

                  {/* Attestation states */}
                  {view === 'result' && analysis.result && (
                    <div className="space-y-2 border-t border-slate-800 pt-2.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">2. Attestation State</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => attestationHook.setMockAttestationState('not-attested')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold cursor-pointer"
                        >
                          Clear Anchor
                        </button>
                        <button 
                          onClick={() => attestationHook.setMockAttestationState('pending')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold text-violet-400 animate-pulse cursor-pointer"
                        >
                          Pending Sign
                        </button>
                        <button 
                          onClick={() => attestationHook.setMockAttestationState('confirmed', 'match')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold text-emerald-450 cursor-pointer"
                        >
                          Confirmed (Match)
                        </button>
                        <button 
                          onClick={() => attestationHook.setMockAttestationState('confirmed', 'mismatch')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-[9px] text-center font-semibold text-red-400 cursor-pointer"
                        >
                          Confirmed (Mismatch)
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-1.5 text-[9px] text-slate-500 pt-1 border-t border-slate-800">
                <AlertCircle className="w-3.5 h-3.5 text-slate-650" />
                <span>Dev controls only visible in import.meta.env.DEV</span>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
