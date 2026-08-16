import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { formatAddress } from '../utils/formatAddress';

export function NFTIdentityCard({ nft }) {
  if (!nft) return null;

  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const infoFields = [
    { label: "Collection", value: nft.collectionName, isAddress: false },
    { label: "Token ID", value: `#${nft.tokenId}`, isAddress: false, raw: nft.tokenId },
    { label: "Contract Address", value: nft.contractAddress, isAddress: true },
    { label: "Network", value: nft.network, isAddress: false },
    { label: "Token Standard", value: nft.tokenStandard, isAddress: false },
    { label: "Creator", value: nft.creatorAddress, isAddress: true },
    { label: "Current Owner", value: nft.currentOwner, isAddress: true },
    { label: "Mint Date", value: nft.mintDate, isAddress: false }
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
      <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
        NFT identity & Details
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
        {infoFields.map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {field.label}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-slate-800 text-sm font-semibold select-all leading-tight">
                {field.isAddress ? formatAddress(field.value) : field.value}
              </span>
              
              {(field.isAddress || field.label === "Contract Address") && (
                <button
                  onClick={() => handleCopy(field.value, field.label)}
                  className="p-1 rounded hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                  title={`Copy ${field.label}`}
                >
                  {copiedField === field.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
