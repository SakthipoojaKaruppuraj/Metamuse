import type { NFT } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { Sparkles } from 'lucide-react'

export function WhyPanel({ nft }: { nft: NFT }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="relative overflow-hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <Eyebrow>Why this exists</Eyebrow>
        </div>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground">
          {nft.whyThisExists}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          This explanation is generated from the evidence below. Every claim is
          traceable to a labeled source — expand the evidence ledger to inspect
          each one.
        </p>
      </Card>

      <Card className="flex flex-col justify-between">
        <div>
          <Eyebrow>Provenance confidence</Eyebrow>
          <div className="mt-4 flex items-end gap-1">
            <span className="text-5xl font-semibold tracking-tight text-foreground">
              {nft.provenanceConfidence}
            </span>
            <span className="mb-1.5 text-lg text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${nft.provenanceConfidence}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            High confidence. Ownership chain is fully reconstructed from on-chain
            events with no gaps.
          </p>
        </div>
      </Card>
    </div>
  )
}
