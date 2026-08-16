import { Link2 } from 'lucide-react'
import { Card } from '@/components/ui/surface'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'
import { ExplorerLink } from '@/components/ui/badges'
import type { EvidenceItem, EvidenceType } from '@/lib/data'
import { cn } from '@/lib/utils'

const TYPE_LABEL: Record<EvidenceType, string> = {
  'on-chain': 'On-chain',
  metadata: 'Metadata',
  project: 'Project context',
  artwork: 'Artwork analysis',
}

const TYPE_STYLE: Record<EvidenceType, string> = {
  'on-chain': 'bg-lavender text-primary',
  metadata: 'bg-info/10 text-info',
  project: 'bg-secondary text-foreground',
  artwork: 'bg-warning/10 text-warning',
}

export function EvidenceCard({
  item,
  className,
}: {
  item: EvidenceItem
  className?: string
}) {
  const showDisclaimer =
    item.confidence === 'inferred' || item.confidence === 'ai-interpretation'

  return (
    <Card className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            TYPE_STYLE[item.type],
          )}
        >
          {TYPE_LABEL[item.type]}
        </span>
        <ConfidenceBadge confidence={item.confidence} />
      </div>

      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Claim
        </p>
        <p className="mt-1.5 text-base font-medium leading-snug text-foreground text-pretty">
          {item.claim}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.detail}
      </p>

      {showDisclaimer && (
        <p className="rounded-lg border border-dashed border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
          Similarity and interpretation do not establish ownership or copyright.
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link2 className="size-3.5" />
          <span>{item.source}</span>
        </div>
        {item.sourceHref && (
          <ExplorerLink href={item.sourceHref}>Open source</ExplorerLink>
        )}
      </div>
    </Card>
  )
}
