'use client'

import { useState } from 'react'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Boxes,
  Image as ImageIcon,
  Sparkles,
  Wallet,
  Coins
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { primaryNFT, type NFT } from '@/lib/data'

export function ProvenanceGraph({
  nft = primaryNFT,
  withControls = true,
  className,
}: {
  nft?: NFT
  withControls?: boolean
  className?: string
}) {
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const nodes = [
    { 
      id: 'creator', 
      label: 'Creator', 
      sub: nft.creatorShort, 
      Icon: User, 
      desc: `Artist/Deployer: ${nft.creator}` 
    },
    { 
      id: 'collection', 
      label: 'Collection', 
      sub: nft.collection.slice(0, 15) + (nft.collection.length > 15 ? '…' : ''), 
      Icon: Boxes, 
      desc: `Registry Contract Address: ${nft.contract}` 
    },
    { 
      id: 'mint', 
      label: 'Mint Event', 
      sub: nft.minted, 
      Icon: Coins, 
      desc: `Minted in tx: ${nft.mintTx.slice(0, 10)}…` 
    },
    { 
      id: 'nft', 
      label: `Token ${nft.tokenId}`, 
      sub: nft.standard, 
      Icon: Sparkles, 
      primary: true, 
      desc: `Unique assets tokenized on Ethereum` 
    },
    { 
      id: 'artwork', 
      label: 'Artwork', 
      sub: 'IPFS pinned', 
      Icon: ImageIcon, 
      desc: `Visual Fingerprint Hash: ${nft.imageHash.slice(0, 10)}…` 
    },
    { 
      id: 'owner', 
      label: 'Custodian', 
      sub: nft.ownerShort, 
      Icon: Wallet, 
      desc: `Current Custody Wallet: ${nft.owner}` 
    },
  ]

  const edges = [
    { from: 'creator', label: 'created', to: 'collection' },
    { from: 'collection', label: 'contains', to: 'nft' },
    { from: 'mint', label: 'minted', to: 'nft' },
    { from: 'nft', label: 'renders', to: 'artwork' },
    { from: 'nft', label: 'owned by', to: 'owner' },
  ]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-surface',
        className,
      )}
    >
      {withControls && (
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(2)))}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(2)))}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1)
              setSelectedNode(null)
            }}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
            aria-label="Reset view"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      )}

      {/* Node Info Overlay Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-900 text-white rounded-xl p-3 text-xs border border-slate-800 animate-slide-up shadow-lg">
          <p className="font-bold">{nodes.find(n => n.id === selectedNode)?.label} Info:</p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono break-all">
            {nodes.find(n => n.id === selectedNode)?.desc}
          </p>
        </div>
      )}

      <div className="overflow-x-auto p-8">
        <div
          className="mx-auto flex min-w-[760px] items-center justify-center gap-3 transition-transform duration-300 py-10"
          style={{ transform: `scale(${zoom})` }}
        >
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={cn(
                  'flex w-28 flex-col items-center gap-2 rounded-2xl border p-4 text-center cursor-pointer transition-all hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary/45',
                  node.primary
                    ? 'border-primary/40 bg-lavender'
                    : selectedNode === node.id
                    ? 'border-primary bg-secondary/80'
                    : 'border-border bg-card',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-9 items-center justify-center rounded-xl',
                    node.primary
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-primary',
                  )}
                >
                  <node.Icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-bold leading-tight text-foreground">
                    {node.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground truncate max-w-[80px]">
                    {node.sub}
                  </p>
                </div>
              </button>

              {/* Edge connect text line */}
              {i < nodes.length - 1 && (
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1">
                    {edges.find(e => e.from === node.id)?.label || 'linked'}
                  </span>
                  <div className="h-px w-8 bg-gradient-to-r from-primary/60 to-primary/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
