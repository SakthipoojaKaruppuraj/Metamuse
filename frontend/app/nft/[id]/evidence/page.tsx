'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { mockNFTs } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { EvidenceCard } from '@/components/evidence/evidence-card'
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'

export default function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const nft = mockNFTs[id]
  const [activeFilter, setActiveFilter] = useState<string>('all')

  if (!nft) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">NFT Audit Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested asset record does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/analyze">Back to Analyze</Link>
        </Button>
      </div>
    )
  }

  const filteredEvidence = nft.evidence.filter(
    (item) => activeFilter === 'all' || item.type === activeFilter
  )

  // Count summaries
  const onChainCount = nft.evidence.filter(item => item.type === 'on-chain').length
  const metadataCount = nft.evidence.filter(item => item.type === 'metadata').length
  const projectCount = nft.evidence.filter(item => item.type === 'project').length
  const artworkCount = nft.evidence.filter(item => item.type === 'artwork').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Breadcrumb Back Button */}
      <div>
        <Link href={`/nft/${nft.id}`} className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1.5 mb-4">
          <ArrowLeft className="size-4" />
          Back to Analysis Report
        </Link>
        <Eyebrow>Evidence Ledger</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Full Evidence Audit
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed backing evidence for {nft.collection} {nft.tokenId}.
        </p>
      </div>

      {/* Summary Summary Row */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'On-chain facts', count: onChainCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Metadata URI checks', count: metadataCount, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
          { label: 'Project context cards', count: projectCount, color: 'bg-violet-50 text-violet-700 border-violet-100' },
          { label: 'Artwork analyses', count: artworkCount, color: 'bg-amber-50 text-amber-700 border-amber-100' }
        ].map((stat) => (
          <div key={stat.label} className={`border rounded-2xl p-4 text-center ${stat.color}`}>
            <span className="text-2xl font-bold tracking-tight block">{stat.count}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 mt-1 block">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter and Content list */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-border bg-card p-1 max-w-sm">
          {[
            { value: 'all', label: 'All' },
            { value: 'on-chain', label: 'On-chain' },
            { value: 'metadata', label: 'Metadata' },
            { value: 'project', label: 'Project' },
            { value: 'artwork', label: 'Artwork' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === tab.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvidence.map((item, index) => (
            <EvidenceCard key={item.id} item={{ ...item, id: `${index + 1}` }} />
          ))}
        </div>

        {filteredEvidence.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground text-sm">
            No active evidence records match the selected filter category.
          </Card>
        )}
      </div>

    </div>
  )
}
