'use client'

import { useEffect, useState, useRef } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { analysisSteps } from '@/lib/data'
import { cn } from '@/lib/utils'
import { getAppMode } from '@/lib/config'

interface AnalysisProgressProps {
  openSeaUrl: string
  onComplete: (analysisId: string, nftData: any) => void
  onError: (errorMsg: string) => void
}

export function AnalysisProgress({ openSeaUrl, onComplete, onError }: AnalysisProgressProps) {
  const [active, setActive] = useState(0)
  const isDoneRef = useRef(false)
  const analysisIdRef = useRef<string | null>(null)
  const nftDataRef = useRef<any>(null)
  const errorRef = useRef<string | null>(null)

  // 1. Perform backend analysis request on mount
  useEffect(() => {
    let activeTimer: NodeJS.Timeout
    const mode = getAppMode()

    async function runAnalysis() {
      if (mode === 'real') {
        try {
          const res = await fetch('/api/nft/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ openSeaUrl }),
          })

          const data = await res.json()
          if (!res.ok || data.error) {
            let userMsg = 'Analysis failed. Please verify the URL.'
            const err = data.error
            if (err === 'INVALID_OPENSEA_URL') userMsg = 'Invalid OpenSea URL. Please check the address.'
            else if (err === 'UNSUPPORTED_CHAIN') userMsg = 'Unsupported blockchain. MetaMuse currently supports Ethereum Mainnet only.'
            else if (err === 'INVALID_CONTRACT') userMsg = 'Contract bytecode not found. Please verify contract address.'
            else if (err === 'OPENSEA_RATE_LIMITED') userMsg = 'OpenSea rate limit reached. Please wait a minute and retry.'
            else if (err === 'OPENSEA_UNAUTHORIZED') userMsg = 'Backend API credentials not configured.'
            else if (err === 'NFT_NOT_FOUND') userMsg = 'NFT asset not found on OpenSea.'
            else if (err === 'TOKEN_URI_FAILED') userMsg = 'Failed to fetch on-chain token metadata.'

            errorRef.current = userMsg
            isDoneRef.current = true
          } else {
            analysisIdRef.current = data.analysisId
            nftDataRef.current = data.nft
            isDoneRef.current = true
          }
        } catch (e) {
          console.error(e)
          errorRef.current = 'Failed to communicate with the analysis server.'
          isDoneRef.current = true
        }
      } else {
        // Mock Mode: Wait 3 seconds then resolve based on presets
        await new Promise((r) => setTimeout(r, 3000))
        let mockId = 'example-genesis-1837'
        if (openSeaUrl.includes('721')) {
          mockId = 'example-collection-721'
        } else if (openSeaUrl.includes('44')) {
          mockId = 'example-divergent-44'
        }
        analysisIdRef.current = mockId
        isDoneRef.current = true
      }
    }

    runAnalysis()

    // 2. Animate step-by-step progress
    function tick() {
      setActive((prev) => {
        // If completed or failed, rush the progress steps to the end
        if (isDoneRef.current) {
          if (prev >= analysisSteps.length - 1) {
            if (errorRef.current) {
              onError(errorRef.current)
            } else if (analysisIdRef.current) {
              onComplete(analysisIdRef.current, nftDataRef.current)
            }
            return prev
          }
          activeTimer = setTimeout(tick, 200)
          return prev + 1
        }

        // Pause at stage 6 ("Calculating confidence") until backend resolves
        if (prev >= 6) {
          activeTimer = setTimeout(tick, 300)
          return prev
        }

        activeTimer = setTimeout(tick, 600)
        return prev + 1
      })
    }

    activeTimer = setTimeout(tick, 600)

    return () => {
      clearTimeout(activeTimer)
    }
  }, [openSeaUrl, onComplete, onError])

  const progress = Math.min(
    100,
    Math.round(((active + 1) / analysisSteps.length) * 100)
  )

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
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
            className="h-full rounded-full bg-primary transition-all duration-300"
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
