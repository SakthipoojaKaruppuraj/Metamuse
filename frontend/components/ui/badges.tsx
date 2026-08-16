import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function NetworkBadge({
  network = 'Ethereum',
  className,
}: {
  network?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground',
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full bg-[#627EEA]"
        aria-hidden="true"
      />
      {network}
    </span>
  )
}

export function ExplorerLink({
  href = '#',
  children,
  className,
}: {
  href?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80',
        className,
      )}
    >
      {children}
      <ArrowUpRight className="size-3.5" />
    </a>
  )
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-xs font-semibold tracking-[0.14em] text-primary uppercase',
        className,
      )}
    >
      {children}
    </p>
  )
}
