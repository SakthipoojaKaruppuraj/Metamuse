'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { analysisSteps } from '@/lib/data'
import { cn } from '@/lib/utils'

export function AnalysisProgress({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState(2)

  useEffect(() => {
    if (active >= analysisSteps.length) {
      const t = setTimeout(onComplete, 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActive((a) => a + 1), 900)
    return () => clearTimeout(t)
  }, [active, onComplete])

  const progress = Math.min(
    100,
    Math.round((active / analysisSteps.length) * 100),
  )

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_20px_50px_-30px_rgba(23,21,26,0.3)]">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex size-11 items-center justify-center rounded-2xl bg-lavender">
            <Loader2 className="size-5 animate-spin text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Uncovering the story…
            </h2>
            <p className="text-sm text-muted-foreground">
              Tracing the NFT across its on-chain and contextual evidence.
            </p>
          </div>
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-6 space-y-1">
          {analysisSteps.map((step, i) => {
            const done = i < active
            const current = i === active
            return (
              <li
                key={step}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                  current && 'bg-lavender',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-5 items-center justify-center rounded-full border text-xs',
                    done
                      ? 'border-success bg-success text-success-foreground'
                      : current
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground',
                  )}
                >
                  {done ? (
                    <Check className="size-3" />
                  ) : current ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    done
                      ? 'text-foreground'
                      : current
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {step}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
