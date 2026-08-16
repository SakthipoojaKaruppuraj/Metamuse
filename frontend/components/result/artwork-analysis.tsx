import Image from 'next/image'
import type { NFT } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'

function TraitGrid({
  title,
  traits,
  confidence,
}: {
  title: string
  traits: NFT['visualTraits']
  confidence: 'ai-interpretation' | 'source-backed'
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <ConfidenceBadge confidence={confidence} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {traits.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-border bg-secondary/60 px-3 py-2.5"
          >
            <dt className="text-xs text-muted-foreground">{t.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {t.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

export function ArtworkAnalysis({ nft }: { nft: NFT }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TraitGrid
          title="Visual traits (interpreted)"
          traits={nft.visualTraits}
          confidence="ai-interpretation"
        />
        <TraitGrid
          title="Metadata traits (declared)"
          traits={nft.metadataTraits}
          confidence="source-backed"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Image
              src={nft.related.image || '/placeholder.svg'}
              alt={`Related artwork ${nft.related.collection} ${nft.related.tokenId}`}
              width={120}
              height={120}
              className="size-20 rounded-xl border border-border object-cover"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Visually related
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {nft.related.collection} {nft.related.tokenId}
              </p>
              <p className="text-sm text-muted-foreground">
                {nft.related.similarity}% perceptual similarity
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground sm:ml-auto sm:max-w-xs">
            Similarity is computed from artwork fingerprints. It does not
            establish copyright, ownership, or endorsement.
          </p>
        </div>
      </Card>
    </div>
  )
}
