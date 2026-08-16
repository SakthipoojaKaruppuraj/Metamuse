import type { NFT } from '@/lib/data'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'
import { ExplorerLink } from '@/components/ui/badges'
import { CopyButton } from '@/components/ui/copy-button'

export function ProvenanceTimeline({ nft }: { nft: NFT }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {nft.provenance.map((event) => (
        <li key={event.id} className="relative">
          <span
            className="absolute -left-[27px] top-1.5 size-3 rounded-full border-2 border-card bg-primary"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {event.date}
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {event.event}
            </h3>
            <ConfidenceBadge confidence={event.confidence} />
          </div>
          {event.note ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {event.note}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
              {event.wallet}
              {event.wallet !== '—' ? <CopyButton value={event.wallet} /> : null}
            </span>
            {event.txHash !== '—' ? (
              <span className="flex items-center gap-1.5 font-mono">
                <ExplorerLink href="#">{event.txHash}</ExplorerLink>
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
