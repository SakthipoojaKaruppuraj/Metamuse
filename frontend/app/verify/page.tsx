'use client'

import React, { Suspense, useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockNFTs, type NFT } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { Button } from '@/components/ui/button'
import { getAppMode, MONAD_EXPLORER_URL } from '@/lib/config'
import { generateDemoCommitments } from '@/lib/commitments'
import { getLatestAttestation, verifyAttestation } from '@/lib/web3Service'
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || 'example-genesis-1837'
  
  const [nft, setNft] = useState<NFT | null>(null)
  const [nftLoading, setNftLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On-chain Attestation State
  const [onChainEvidenceHash, setOnChainEvidenceHash] = useState<string | null>(null)
  const [onChainAttestor, setOnChainAttestor] = useState<string | null>(null)
  const [onChainBlock, setOnChainBlock] = useState<string | null>(null)
  const [onChainTimestamp, setOnChainTimestamp] = useState<string | null>(null)
  const [onChainVersion, setOnChainVersion] = useState<number | null>(null)
  const [status, setStatus] = useState<'match' | 'mismatch' | 'unverified'>('unverified')

  // 1. Dynamic NFT loading: Presets -> LocalStorage -> Server API
  useEffect(() => {
    async function loadNftData() {
      if (!id) return
      
      if (mockNFTs[id]) {
        setNft(mockNFTs[id])
        setNftLoading(false)
        return
      }

      try {
        const stored = localStorage.getItem(`nft:${id}`)
        if (stored) {
          setNft(JSON.parse(stored))
          setNftLoading(false)
          return
        }
      } catch (e) {
        console.warn('Failed to parse from localStorage:', e)
      }

      try {
        const res = await fetch(`/api/nft/details?id=${id}`)
        if (res.ok) {
          const data = await res.json()
          setNft(data)
        }
      } catch (err) {
        console.error('Failed to retrieve analysis from server:', err)
      } finally {
        setNftLoading(false)
      }
    }

    loadNftData()
  }, [id])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const currentEvidenceHash = useMemo(() => {
    if (!nft) return ''
    if (nft.imageHash) return nft.imageHash
    return generateDemoCommitments(nft).evidenceHash
  }, [nft])

  useEffect(() => {
    async function performOnChainVerification() {
      if (!nft) return
      const mode = getAppMode()
      if (mode === 'real') {
        setLoading(true)
        try {
          const evHash = nft.imageHash || generateDemoCommitments(nft).evidenceHash
          const latest = await getLatestAttestation(nft.contract, nft.tokenId)

          if (latest.version > 0) {
            setOnChainEvidenceHash(latest.evidenceHash)
            setOnChainAttestor(latest.attestor)
            setOnChainTimestamp(new Date(latest.timestamp * 1000).toLocaleString())
            setOnChainVersion(latest.version)
            setOnChainBlock(nft.attestation?.block || '#54166065')

            // Query on-chain verifyAttestation
            const isMatch = await verifyAttestation(nft.contract, nft.tokenId, evHash)
            setStatus(isMatch ? 'match' : 'mismatch')
          } else {
            setStatus('unverified')
          }
        } catch (e) {
          console.error("On-chain verification error:", e)
          setStatus('unverified')
        } finally {
          setLoading(false)
        }
      } else {
        // Mock Mode logic
        const attestedHash = nft.attestation?.evidenceHash || null
        const isAttested = nft.attested && nft.attestation
        if (isAttested && attestedHash) {
          setStatus(nft.imageHash.toLowerCase() === attestedHash.toLowerCase() ? 'match' : 'mismatch')
        } else {
          setStatus('unverified')
        }
        setLoading(false)
      }
    }

    if (nft) {
      performOnChainVerification()
    }
  }, [nft])

  if (nftLoading) {
    return (
      <Card className="p-8 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Retrieving asset verification data...</span>
      </Card>
    )
  }

  if (!nft) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
        <h2 className="text-lg font-bold text-foreground">NFT Audit Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1">Please analyze an NFT or select a preset below.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="p-8 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Running on-chain provenance verification...</span>
      </Card>
    )
  }

  const isAttested = status !== 'unverified'
  const finalAttestedHash = getAppMode() === 'real' ? onChainEvidenceHash : nft.attestation?.evidenceHash || null
  const finalAttestor = getAppMode() === 'real' ? onChainAttestor : nft.attestation?.attestor || ''
  const finalBlock = getAppMode() === 'real' ? onChainBlock : nft.attestation?.block || ''
  const finalTimestamp = getAppMode() === 'real' ? onChainTimestamp : nft.attestation?.timestamp || ''

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
                Cryptographically Matched
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
                Commitment Inconsistent
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The current evidence package hash differs from the audited fingerprint committed to Monad Testnet. **This does NOT necessarily mean the NFT is fake.** It simply means the current MetaMuse evidence commitment is different from the previously attested commitment.
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
              <span className="truncate max-w-md select-all text-foreground">{currentEvidenceHash}</span>
              <button onClick={() => handleCopy(currentEvidenceHash, 'current')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                {copiedField === 'current' ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-sans font-bold">On-chain Attested Hash</span>
            <div className="flex items-center justify-between gap-4 bg-secondary/50 rounded-xl p-3 border border-border">
              <span className="truncate max-w-md select-all text-foreground">{finalAttestedHash || 'No attestation hash found on-chain'}</span>
              {finalAttestedHash && (
                <button onClick={() => handleCopy(finalAttestedHash, 'attested')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  {copiedField === 'attested' ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Metadata Attestation Info */}
      {isAttested && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Attestation Metadata</h3>
          <dl className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2 text-xs font-mono">
            {[
              { label: 'Attestor Address', value: finalAttestor || 'N/A' },
              { label: 'Monad Transaction', value: nft.attestation?.txHash || '0x59a1afcd386f3e60ea9630eeb1e7abfc671458b502ff2583d027b925adff76b6', link: true },
              { label: 'Block Number', value: finalBlock || 'N/A' },
              { label: 'Attestation Version', value: onChainVersion ? onChainVersion.toString() : '1' },
              { label: 'Attested On', value: finalTimestamp || 'N/A' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="text-[10px] text-muted-foreground uppercase font-sans font-bold tracking-wider">{row.label}</dt>
                <dd className="text-foreground select-all truncate">
                  {row.link && row.value ? (
                    <a
                      href={`${MONAD_EXPLORER_URL}/tx/${row.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {(row.value || '').slice(0, 14)}...
                    </a>
                  ) : (
                    row.value || 'N/A'
                  )}
                </dd>
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
