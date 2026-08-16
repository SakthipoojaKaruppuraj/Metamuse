import {
  BadgeCheck,
  FileText,
  Sparkles,
  CircleHelp,
  GitBranch,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Confidence } from '@/lib/data'

const CONFIG: Record<
  Confidence,
  { label: string; className: string; Icon: typeof BadgeCheck }
> = {
  verified: {
    label: 'Verified',
    className: 'bg-success/10 text-success border-success/20',
    Icon: BadgeCheck,
  },
  'source-backed': {
    label: 'Source-backed',
    className: 'bg-info/10 text-info border-info/20',
    Icon: FileText,
  },
  inferred: {
    label: 'Inferred',
    className: 'bg-warning/10 text-warning border-warning/25',
    Icon: GitBranch,
  },
  'ai-interpretation': {
    label: 'AI interpretation',
    className:
      'bg-muted text-muted-foreground border-border border-dashed',
    Icon: Sparkles,
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-muted text-muted-foreground border-border',
    Icon: CircleHelp,
  },
}

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: Confidence
  className?: string
}) {
  const { label, className: variant, Icon } = CONFIG[confidence]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        variant,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  )
}
