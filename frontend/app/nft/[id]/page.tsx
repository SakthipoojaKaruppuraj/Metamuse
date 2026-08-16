'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockNFTs } from '@/lib/data'
import { ResultHeader } from '@/components/result/result-header'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'
import { ProvenanceTimeline } from '@/components/result/provenance-timeline'
import { ProvenanceGraph } from '@/components/provenance/provenance-graph'
import { ProjectContext } from '@/components/result/project-context'
import { AttestCta } from '@/components/result/attest-cta'
import { EvidenceCard } from '@/components/evidence/evidence-card'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Network,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'

export default function NFTResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const nft = mockNFTs[id]
  const [techOpen, setTechOpen] = useState(false)
  const [evidenceFilter, setEvidenceFilter] = useState<string>('all')

  if (!nft) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">NFT Audit Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested asset record does not exist in our registry database.
        </p>
        <Button asChild className="mt-6">
          <Link href="/analyze">
            <ArrowLeft className="size-4 mr-2" />
            Back to Analyze
          </Link>
        </Button>
      </div>
    )
  }

  // Helper to parse citations dynamically into clickable anchor links
  const renderClickableCitations = (text: string) => {
    const regex = /\[(\d+)\]/g
    const parts = text.split(regex)
    
    if (parts.length === 1) return text
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <a
            key={index}
            href={`#ev-${part}`}
            className="inline-flex items-center justify-center font-bold text-primary hover:underline px-0.5"
          >
            [{part}]
          </a>
        )
      }
      return part
    })
  }

  const filteredEvidence = nft.evidence.filter(
    (item) => evidenceFilter === 'all' || item.type === evidenceFilter
  )

  return (
    <div className="relative pb-24">
      {/* Sticky Anchor Navigation Bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-between gap-4 overflow-x-auto text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <div className="flex items-center gap-6">
              <a href="#overview" className="hover:text-primary transition-colors py-3">Overview</a>
              <a href="#provenance" className="hover:text-primary transition-colors py-3">Provenance</a>
              <a href="#artwork" className="hover:text-primary transition-colors py-3">Artwork Context</a>
              <a href="#evidence" className="hover:text-primary transition-colors py-3">Evidence</a>
              <a href="#attestation" className="hover:text-primary transition-colors py-3">Attestation</a>
            </div>
            <Link href="/analyze" className="text-primary hover:text-primary/80 flex items-center gap-1 shrink-0 py-3">
              <ArrowLeft className="size-3.5" />
              Analyze another
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* SECTION 1: HEADER & IDENTITY */}
        <section id="overview" className="scroll-mt-32 space-y-8">
          <ResultHeader nft={nft} />
          
          {/* WHY THIS NFT EXISTS */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="relative overflow-hidden p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <Eyebrow>Why this exists</Eyebrow>
              </div>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground">
                {renderClickableCitations(nft.whyThisExists)}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                This report is compiled from verified blockchain facts, project sources, and artwork features. Use citations [1] [2] to inspect backing evidence cards.
              </p>
            </Card>

            <Card className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <Eyebrow>Provenance confidence</Eyebrow>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-semibold tracking-tight text-foreground">
                    {nft.provenanceConfidence}
                  </span>
                  <span className="mb-1.5 text-lg text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${nft.provenanceConfidence}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {nft.provenanceConfidence >= 90
                    ? 'High confidence. Provenance matches deployment registries with zero tracking gaps.'
                    : nft.provenanceConfidence >= 70
                    ? 'Moderate confidence. Provenance matches verified creators but holds structural changes.'
                    : 'Low confidence. Creator signatures are unverified or base metadata is mutable.'}
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION 2: PROVENANCE */}
        <section id="provenance" className="scroll-mt-32 border-t border-border pt-12 space-y-8">
          <div>
            <Eyebrow>History & Connections</Eyebrow>
            <SectionHeading className="mt-1">Provenance Tracker</SectionHeading>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Lifecycle Timeline</h3>
              <ProvenanceTimeline nft={nft} />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Relational Provenance Graph</h3>
              <ProvenanceGraph nft={nft} className="h-[360px]" />
            </div>
          </div>
        </section>

        {/* SECTION 3: ARTWORK CONTEXT */}
        <section id="artwork" className="scroll-mt-32 border-t border-border pt-12 space-y-8">
          <div>
            <Eyebrow>Artwork Analysis</Eyebrow>
            <SectionHeading className="mt-1">What are you looking at?</SectionHeading>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Artwork Fingerprint</h3>
                <p className="mt-2 text-sm text-foreground font-mono bg-secondary/50 rounded-xl p-3 border border-border">
                  Keccak-256: {nft.imageHash}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Declared Visual Traits</h4>
                    <ul className="mt-2 space-y-1.5">
                      {nft.visualTraits.map((t) => (
                        <li key={t.label} className="text-xs text-foreground flex justify-between border-b border-border pb-1">
                          <span className="text-muted-foreground">{t.label}:</span>
                          <span className="font-semibold">{t.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Metadata Declared Traits</h4>
                    <ul className="mt-2 space-y-1.5">
                      {nft.metadataTraits.map((t) => (
                        <li key={t.label} className="text-xs text-foreground flex justify-between border-b border-border pb-1">
                          <span className="text-muted-foreground">{t.label}:</span>
                          <span className="font-semibold">{t.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {nft.related && (
                <Card className="p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visual Similarity Scan</h3>
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-border bg-card">
                      <img src={nft.related.image} alt="Related artwork" className="object-cover size-full" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Matches {nft.related.collection} {nft.related.tokenId}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {nft.related.similarity}% visual similarity
                        </span>
                        <ConfidenceBadge confidence="inferred" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal">
                        Visual matching identifies geometric overlap with related templates. Similarity is inferred by the analysis engine and does not establish copyright or ownership.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <Eyebrow>Trust Warning</Eyebrow>
                <h4 className="mt-2 text-sm font-bold text-foreground">Provenance vs. Metadata</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Metadata traits represent creator declarations. Provenance audits inspect transaction signatures to determine whether the creator account has verified on-chain validity.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 4: PROJECT CONTEXT */}
        <section className="border-t border-border pt-12 space-y-6">
          <div>
            <Eyebrow>Project Context</Eyebrow>
            <h2 className="text-xl font-bold text-foreground">Social & Creator Context</h2>
          </div>
          <ProjectContext nft={nft} />
        </section>

        {/* SECTION 5: EVIDENCE LEDGER */}
        <section id="evidence" className="scroll-mt-32 border-t border-border pt-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Eyebrow>Evidence Ledger</Eyebrow>
              <SectionHeading className="mt-1">Backed Claims</SectionHeading>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
              {[
                { value: 'all', label: 'All' },
                { value: 'on-chain', label: 'On-chain' },
                { value: 'metadata', label: 'Metadata' },
                { value: 'project', label: 'Project' },
                { value: 'artwork', label: 'Artwork' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setEvidenceFilter(filter.value)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    evidenceFilter === filter.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredEvidence.map((item, index) => (
              <div key={item.id} id={item.id} className="scroll-mt-36">
                <EvidenceCard item={{ ...item, id: `${index + 1}` }} />
              </div>
            ))}
            {filteredEvidence.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center sm:col-span-2">
                No matching claims in this category.
              </p>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href={`/nft/${nft.id}/evidence`}>
                View Full Evidence Page
              </Link>
            </Button>
          </div>
        </section>

        {/* SECTION 6: PROVENANCE CONFIDENCE BREAKDOWN */}
        <section className="border-t border-border pt-12 space-y-8">
          <div>
            <Eyebrow>Provenance Confidence</Eyebrow>
            <h2 className="text-xl font-bold text-foreground">Score Explanation</h2>
            <p className="text-xs text-muted-foreground mt-1">
              How our scoring system breaks down confidence parameters for this asset.
            </p>
          </div>

          <Card className="p-6 divide-y divide-border">
            {[
              {
                label: 'On-chain evidence',
                status: nft.provenanceConfidence >= 80 ? 'Strong' : 'Weak',
                desc: 'Mints and deployers resolve to verified cryptographic hashes.',
                ok: nft.provenanceConfidence >= 80
              },
              {
                label: 'Metadata completeness',
                status: nft.tokenUri.startsWith('ipfs') ? 'Strong' : 'Mutable',
                desc: 'IPFS pinning protects against host content updates.',
                ok: nft.tokenUri.startsWith('ipfs')
              },
              {
                label: 'Creator validation',
                status: nft.creator !== '0x0000000000000000000000000000000000000000' ? 'Verified' : 'Anonymous',
                desc: 'Deployed contract maps back to identified creator wallets.',
                ok: nft.creator !== '0x0000000000000000000000000000000000000000'
              },
              {
                label: 'Project context',
                status: nft.id !== 'example-collection-721' ? 'Source-backed' : 'Unknown',
                desc: 'Official website claims and socials align with deployer keys.',
                ok: nft.id !== 'example-collection-721'
              },
              {
                label: 'Artwork relationship',
                status: nft.id === 'example-divergent-44' ? 'Altered' : 'Inferred',
                desc: 'Fingerprint similarity scan confirms template correlation.',
                ok: nft.id !== 'example-divergent-44'
              }
            ].map((check) => (
              <div key={check.label} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">{check.label}</h4>
                  <p className="text-xs text-muted-foreground">{check.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    check.ok 
                      ? 'bg-success/15 text-success' 
                      : 'bg-destructive/15 text-destructive'
                  }`}>
                    {check.status}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </section>

        {/* SECTION 7: ATTESTATION */}
        <section id="attestation" className="scroll-mt-32 border-t border-border pt-12">
          <AttestCta nft={nft} />
        </section>

        {/* SECTION 8: COLLAPSIBLE TECHNICAL DETAILS */}
        <section className="border-t border-border pt-12 space-y-4">
          <button
            onClick={() => setTechOpen(!techOpen)}
            className="flex items-center justify-between w-full text-left font-bold text-sm text-foreground py-2 border-b border-border cursor-pointer hover:text-primary transition-colors"
          >
            <span>TECHNICAL BLOCKCHAIN DETAILS</span>
            {techOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          
          {techOpen && (
            <Card className="p-6 grid gap-4 sm:grid-cols-2 text-xs font-mono bg-secondary/30 border border-border animate-fade-in">
              <div>
                <p className="font-semibold text-muted-foreground">Contract Address:</p>
                <p className="text-foreground select-all mt-1">{nft.contract}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Token Standard:</p>
                <p className="text-foreground mt-1">{nft.standard}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Token URI:</p>
                <p className="text-foreground select-all mt-1 truncate" title={nft.tokenUri}>{nft.tokenUri}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Image URI:</p>
                <p className="text-foreground select-all mt-1 truncate" title={nft.imageUri}>{nft.imageUri}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Image SHA-256 Fingerprint:</p>
                <p className="text-foreground select-all mt-1">{nft.imageHash}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">Mint Transaction Hash:</p>
                <p className="text-foreground select-all mt-1">{nft.mintTx}</p>
              </div>
            </Card>
          )}
        </section>

      </div>
    </div>
  )
}
