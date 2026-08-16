'use client'

import { useState } from 'react'
import type { NFT } from '@/lib/data'
import { Tabs } from '@/components/ui/surface'
import { SectionHeading } from '@/components/ui/section-heading'
import { EvidenceCard } from '@/components/evidence/evidence-card'
import { ProvenanceTimeline } from './provenance-timeline'
import { ProjectContext } from './project-context'
import { ArtworkAnalysis } from './artwork-analysis'

const TABS = [
  { value: 'evidence', label: 'Evidence ledger' },
  { value: 'provenance', label: 'Provenance' },
  { value: 'context', label: 'Project context' },
  { value: 'artwork', label: 'Artwork' },
]

export function AnalysisTabs({ nft }: { nft: NFT }) {
  const [tab, setTab] = useState('evidence')

  return (
    <section aria-label="Analysis" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="The breakdown"
          title="Every claim, traced to its source"
          className="max-w-xl"
        />
        <Tabs
          tabs={TABS}
          value={tab}
          onValueChange={setTab}
          className="overflow-x-auto"
        />
      </div>

      {tab === 'evidence' && (
        <div className="grid gap-4 md:grid-cols-2">
          {nft.evidence.map((item) => (
            <EvidenceCard key={item.id} item={item} />
          ))}
        </div>
      )}
      {tab === 'provenance' && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ProvenanceTimeline nft={nft} />
        </div>
      )}
      {tab === 'context' && <ProjectContext nft={nft} />}
      {tab === 'artwork' && <ArtworkAnalysis nft={nft} />}
    </section>
  )
}
