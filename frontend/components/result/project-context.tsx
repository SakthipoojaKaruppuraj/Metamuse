import type { NFT } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'
import { ExplorerLink } from '@/components/ui/badges'

export function ProjectContext({ nft }: { nft: NFT }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {nft.projectContext.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {item.label}
            </span>
            <ConfidenceBadge confidence={item.confidence} />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          <div className="mt-4 border-t border-border pt-3">
            {item.sourceHref ? (
              <ExplorerLink href={item.sourceHref}>{item.source}</ExplorerLink>
            ) : (
              <span className="text-sm text-muted-foreground">
                Source: {item.source}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
