import { cn } from '@/lib/utils'

export function MetaMuseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn('size-7', className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      {/* provenance connections */}
      <path
        d="M9 22.5 L9 12 L16 18 L23 12 L23 22.5"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      {/* metadata / muse nodes */}
      <circle cx="9" cy="11" r="2.4" fill="white" />
      <circle cx="23" cy="11" r="2.4" fill="white" />
      <circle cx="16" cy="18.4" r="2.1" fill="white" opacity="0.85" />
    </svg>
  )
}

export function MetaMuseLogo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <MetaMuseMark />
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          MetaMuse
        </span>
      )}
    </span>
  )
}
