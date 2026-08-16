'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockNFTs } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ShieldAlert, ArrowLeft, CheckCircle2, Copy, Check, FileSearch, HelpCircle } from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || 'example-genesis-1837'
  const nft = mockNFTs[id]

  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  if (!nft) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
        <h2 className="text-lg font-bold text-foreground">NFT Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1">Please select a valid preset below.</p>
      </div>
    )
  }

  // Verification calculations
  const currentHash = nft.imageHash
  const attestedHash = nft.attestation?.evidenceHash || null
  const isAttested = nft.attested && nft.attestation

  let status: 'match' | 'mismatch' | 'unverified' = 'unverified'
  if (isAttested && attestedHash) {
    status = currentHash.toLowerCase() === attestedHash.toLowerCase() ? 'match' : 'mismatch'
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Preset Picker */}
      <div className="flex flex-wrap items-center gap-3 bg-secondary/50 border border-border p-3 rounded-2xl">
        <span className="text-xs font-semibold text-muted-foreground uppercase shrink-0">Selected Audit:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'example-genesis-1837', label: 'Demo Genesis #1837 (Match)' },
            { id: 'example-collection-721', label: 'Lost Artifact #721 (Unanchored)' },
            { id: 'example-divergent-44', label: 'Divergent Art #44 (Mismatch)' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/verify?id=${item.id}`)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                id === item.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Verification Status Card */}
      {status === 'match' ? (
        <Card className="p-6 border-success/30 bg-success/5 space-y-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-success text-success-foreground">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">✓ VERIFICATION MATCH</h2>
              <span className="text-[10px] uppercase font-bold text-success bg-success/15 px-2 py-0.5 rounded-full border border-success/10">
                Demo Verification Successful
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The current calculated provenance evidence hash matches the original attested fingerprint written on Monad Testnet. No tampering detected.
          </p>
        </Card>
      ) : status === 'mismatch' ? (
        <Card className="p-6 border-destructive/30 bg-destructive/5 space-y-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-destructive text-destructive-foreground">
              <ShieldAlert className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">⚠ VERIFICATION MISMATCH</h2>
              <span className="text-[10px] uppercase font-bold text-destructive bg-destructive/15 px-2 py-0.5 rounded-full border border-destructive/10">
                Tampering Detected
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The current evidence package hash differs from the audited fingerprint committed to Monad Testnet. This suggests that the assets, metadata pointer, or properties have been modified since the attestation was registered.
          </p>
        </Card>
      ) : (
        <Card className="p-6 border-amber-500/25 bg-amber-500/5 space-y-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-warning text-warning-foreground">
              <HelpCircle className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">UNANCHORED PROVENANCE</h2>
              <span className="text-[10px] uppercase font-bold text-warning bg-warning/15 px-2 py-0.5 rounded-full border border-warning/10">
                Not Attested
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This asset report has not been registered on Monad Testnet. A live verification check cannot be performed because no historical on-chain commitment exists.
          </p>
        </Card>
      )}

      {/* Comparison Grid */}
      <Card className="p-6 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fingerprint Comparison</h3>
        
        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Current Evidence Hash</span>
            <div className="flex items-center justify-between gap-4 bg-secondary/50 rounded-xl p-3 border border-border">
              <span className="truncate max-w-md select-all text-foreground">{currentHash}</span>
              <button onClick={() => handleCopy(currentHash, 'current')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                {copiedField === 'current' ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">On-chain Attested Hash</span>
            <div className="flex items-center justify-between gap-4 bg-secondary/50 rounded-xl p-3 border border-border">
              <span className="truncate max-w-md select-all text-foreground">{attestedHash || 'No attestation hash found on-chain'}</span>
              {attestedHash && (
                <button onClick={() => handleCopy(attestedHash, 'attested')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  {copiedField === 'attested' ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Metadata Attestation Info */}
      {isAttested && nft.attestation && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Attestation Metadata</h3>
          <dl className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2 text-xs font-mono">
            {[
              { label: 'Attestor Signature', value: nft.attestation.attestor },
              { label: 'Monad Transaction', value: nft.attestation.txHash },
              { label: 'Block Number', value: nft.attestation.block },
              { label: 'Attested On', value: nft.attestation.timestamp },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="text-[10px] text-muted-foreground uppercase font-sans font-bold tracking-wider">{row.label}</dt>
                <dd className="text-foreground select-all truncate">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      {/* Back button */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/nft/${nft.id}`}>
            View Full Report
          </Link>
        </Button>
        {!isAttested && (
          <Button variant="outline" asChild>
            <Link href={`/attest/${nft.id}`}>
              Attest now
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

import { AlertCircle } from 'lucide-react'

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div>
        <Eyebrow>Verification Engine</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Verify Provenance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare the current calculated evidence hash against the Monad Testnet registry to confirm integrity.
        </p>
      </div>

      <Suspense fallback={
        <Card className="p-8 text-center flex items-center justify-center gap-2">
          <Loader2 className="size-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Loading verification state...</span>
        </Card>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  )
}

import { Loader2 } from 'lucide-react'
