import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Award, Loader2, ExternalLink, Copy, Check, Link } from 'lucide-react';
import { MONAD_TESTNET } from '../services/config';
import { formatAddress } from '../utils/formatAddress';
import { formatHash } from '../utils/formatHash';

export function AttestationCard({ nft, wallet, attestationHook }) {
  const { address, status: walletStatus, connect, switchNetwork } = wallet;
  const { attestation, attestStatus, attest, txDetails, verify, error: attestError } = attestationHook;

  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleAttest = () => {
    if (address) {
      attest(address);
    }
  };

  const activeAttestation = attestation || txDetails;

  // Render State 5: Transaction Confirmed
  if (activeAttestation) {
    return (
      <div className="bg-white border-2 border-emerald-500/20 rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden animate-fade-in">
        {/* Success watermark */}
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 opacity-[0.03] text-emerald-600 pointer-events-none font-bold text-9xl">
          ✓
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Registry Anchored
            </span>
            <h3 className="font-bold text-slate-800 text-lg leading-tight mt-1">
              Provenance Attested
            </h3>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          This provenance assessment is permanently anchored. The proof package hash has been registered in the MetaMuse Provenance Registry on Monad Testnet.
        </p>

        {/* Attestation Grid Details */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 md:p-5 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">Network</span>
            <span className="text-slate-700 font-bold">{MONAD_TESTNET.name}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">Transaction Hash</span>
            <div className="flex items-center gap-1.5">
              <a 
                href={`${MONAD_TESTNET.explorerUrl}/tx/${activeAttestation.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 font-mono hover:underline font-bold flex items-center gap-1"
              >
                {formatHash(activeAttestation.txHash, 6, 6)}
                <ExternalLink className="w-3 h-3" />
              </a>
              <button 
                onClick={() => handleCopy(activeAttestation.txHash, "tx")} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                {copiedField === "tx" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">Block Anchored</span>
            <span className="text-slate-700 font-mono font-semibold">#{activeAttestation.blockNumber}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-medium">Attestor Wallet</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-700 font-mono font-semibold">{formatAddress(activeAttestation.attestor, 6)}</span>
              <button 
                onClick={() => handleCopy(activeAttestation.attestor, "attestor")} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                {copiedField === "attestor" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Evidence Root Hash</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-700 font-mono font-semibold">{formatHash(activeAttestation.evidenceHash, 6, 6)}</span>
              <button 
                onClick={() => handleCopy(activeAttestation.evidenceHash, "evidenceHash")} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                {copiedField === "evidenceHash" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Verification Trigger and Actions */}
        <div className="flex flex-wrap gap-3">
          <a 
            href={`${MONAD_TESTNET.explorerUrl}/tx/${activeAttestation.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            View on Explorer
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button 
            onClick={verify}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-50 text-violet-700 border border-violet-100 rounded-xl text-xs font-semibold hover:bg-violet-100 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify Registry Match
          </button>
        </div>
      </div>
    );
  }

  // Render State 4: Transaction Pending
  if (attestStatus === "pending") {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center text-center py-12 animate-pulse">
        <div className="relative mb-5">
          <div className="w-14 h-14 rounded-full border-4 border-violet-100 animate-ping absolute" />
          <div className="w-14 h-14 rounded-full border-4 border-violet-100 flex items-center justify-center bg-violet-50 text-violet-600 relative z-10">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-1">
          Anchoring Provenance...
        </h3>
        <p className="text-slate-400 text-xs max-w-xs leading-normal">
          Waiting for Monad block confirmation. This takes roughly 2 seconds on the high-speed L1 pipeline. Please sign the transaction in MetaMask.
        </p>
      </div>
    );
  }

  // Render State 6: Transaction Failed / Configuration Mismatch / ABI Missing
  if (attestStatus === "failed" || attestError) {
    let title = "Transaction Failed";
    let desc = "The Monad contract signature request was rejected or failed. Ensure your wallet has gas funds and try again.";
    let showTryAgain = true;

    if (attestError === "CONTRACT_NOT_CONFIGURED") {
      title = "Monad registry contract is not configured.";
      desc = "Connect MetaMask and configure the deployed MetaMuse Provenance Registry contract address in src/services/config.js to enable on-chain attestation.";
      showTryAgain = false;
    } else if (attestError === "CONTRACT_ABI_NOT_CONFIGURED") {
      title = "Monad registry integration is not ready yet.";
      desc = "The deployed contract ABI has not been configured. The ABI will be generated and copied to src/services/abis/NFTProvenanceRegistryABI.js once the Solidity contract is compiled.";
      showTryAgain = false;
    } else if (attestError === "USER_REJECTED") {
      title = "Transaction Rejected";
      desc = "Transaction was cancelled in MetaMask.";
    } else if (attestError === "RPC_ERROR") {
      title = "RPC Connection Error";
      desc = "Unable to reach Monad Testnet RPC endpoint. Please verify your internet connection or try again.";
    } else if (attestError === "TRANSACTION_REVERTED") {
      title = "Transaction Reverted";
      desc = "Monad Testnet rejected the attestation transaction. Ensure the transaction params are correct.";
    } else if (attestError === "UNKNOWN_ERROR") {
      title = "Transaction Failed";
      desc = "Something went wrong. Please try again.";
    }

    return (
      <div className="bg-white border-2 border-red-500/20 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {title}
          </h3>
        </div>
        <p className="text-slate-500 text-xs mb-5 leading-relaxed">
          {desc}
        </p>
        <div className="flex gap-3">
          {showTryAgain && (
            <button 
              onClick={handleAttest}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
          <button 
            onClick={() => {
              attestationHook.setMockAttestationState('not-attested');
            }}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Status
          </button>
        </div>
      </div>
    );
  }

  // Render State 7: MetaMask not detected (NO_METAMASK)
  if (walletStatus === "no-metamask" || wallet.error === "NO_METAMASK") {
    return (
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 mb-4 animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm mb-1">
          MetaMask Not Detected
        </h4>
        <p className="text-slate-400 text-xs max-w-xs mb-5 leading-normal">
          MetaMask extension was not found. Please install the MetaMask extension to run on-chain attestation commits.
        </p>
        <a 
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  // Render State 1: Disconnected
  if (walletStatus === "disconnected") {
    return (
      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50 mb-4">
          <Link className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm mb-1">
          Provenance Attestation
        </h4>
        <p className="text-slate-400 text-xs max-w-xs mb-5 leading-normal">
          Connect your MetaMask wallet to cryptographically attest this provenance assessment on Monad Testnet.
        </p>
        <button 
          onClick={connect}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  // Render State 2: Wrong Network / Switching Chain
  if (walletStatus === "wrong-network" || walletStatus === "switching-network") {
    const isSwitching = walletStatus === "switching-network";
    return (
      <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 mb-4">
          {isSwitching ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
        </div>
        <h4 className="font-bold text-amber-900 text-sm mb-1">
          {isSwitching ? 'Switching Network...' : 'Wrong Network Detected'}
        </h4>
        <p className="text-amber-700/70 text-xs max-w-xs mb-5 leading-normal">
          MetaMuse attests provenance exclusively on {MONAD_TESTNET.name}. Click below to configure or switch your wallet chain automatically.
        </p>
        <button 
          onClick={switchNetwork}
          disabled={isSwitching}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
        >
          {isSwitching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSwitching ? 'Accepting Switch...' : 'Switch to Monad Testnet'}
        </button>
      </div>
    );
  }

  // Render State 3: Connected & Ready
  if (walletStatus === "connected" && !activeAttestation && attestStatus === "idle") {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl border border-violet-100 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">
              Ready to Attest Provenance
            </h4>
            <p className="text-slate-400 text-xs mt-1 max-w-md leading-relaxed">
              Anchor this assessed report to Monad. Doing so posts a cryptographic commitment hash of the audited evidence under your current wallet signature.
            </p>
          </div>
        </div>
        <button 
          onClick={handleAttest}
          className="w-full md:w-auto px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm whitespace-nowrap cursor-pointer"
        >
          Attest on Monad
        </button>
      </div>
    );
  }

  return null;
}
