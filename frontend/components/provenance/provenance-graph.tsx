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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NODES = [
  { id: 'creator', label: 'Creator', sub: '0x3F82…C901', Icon: User },
  { id: 'collection', label: 'Collection', sub: 'Example Genesis', Icon: Boxes },
  { id: 'nft', label: 'NFT #1837', sub: 'ERC-721', Icon: Sparkles, primary: true },
  { id: 'artwork', label: 'Artwork', sub: 'IPFS pinned', Icon: ImageIcon },
  { id: 'owner', label: 'Current Owner', sub: '0x91B2…AA73', Icon: Wallet },
]

const EDGES = [
  { from: 'Creator', label: 'created', to: 'Collection' },
  { from: 'Collection', label: 'contains', to: 'NFT' },
  { from: 'NFT', label: 'renders', to: 'Artwork' },
  { from: 'NFT', label: 'owned by', to: 'Owner' },
]

export function ProvenanceGraph({
  withControls = true,
  className,
}: {
  withControls?: boolean
  className?: string
}) {
  const [zoom, setZoom] = useState(1)

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
            onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.15).toFixed(2)))}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Zoom in"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Zoom out"
          >
            <ZoomOut className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Reset view"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      )}

      <div className="overflow-x-auto p-8">
        <div
          className="mx-auto flex min-w-[640px] items-center justify-center gap-3 transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {NODES.map((node, i) => (
            <div key={node.id} className="flex items-center gap-3">
              <div
                className={cn(
                  'flex w-32 flex-col items-center gap-2 rounded-2xl border p-4 text-center',
                  node.primary
                    ? 'border-primary/40 bg-lavender'
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
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    {node.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {node.sub}
                  </p>
                </div>
              </div>
              {i < NODES.length - 1 && (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {EDGES[i]?.label}
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
