'use client'

import Image from 'next/image'
import type { NFT } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { NetworkBadge, Eyebrow, ExplorerLink } from '@/components/ui/badges'
import { CopyButton } from '@/components/ui/copy-button'
import { BadgeCheck, Clock } from 'lucide-react'

function DataRow({
  label,
  value,
  copy,
  href,
}: {
  label: string
  value: string
  copy?: string
  href?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-mono text-sm text-foreground">
        {href ? (
          <ExplorerLink href={href}>{value}</ExplorerLink>
        ) : (
          <span>{value}</span>
        )}
        {copy ? <CopyButton value={copy} /> : null}
      </span>
    </div>
  )
}

export function ResultHeader({ nft }: { nft: NFT }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            src={nft.image || '/placeholder.svg'}
            alt={`Artwork for ${nft.collection} ${nft.tokenId}`}
            width={840}
            height={840}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            {nft.attested ? (
              <>
                <BadgeCheck className="size-4 text-success" />
                <span className="text-sm font-medium text-foreground">
                  Attested on-chain
                </span>
              </>
            ) : (
              <>
                <Clock className="size-4 text-warning" />
                <span className="text-sm font-medium text-foreground">
                  Not yet attested
                </span>
              </>
            )}
          </div>
          <ExplorerLink href={nft.openseaUrl}>View on OpenSea</ExplorerLink>
        </div>
      </div>

      <div className="flex flex-col">
        <Eyebrow>Identity report</Eyebrow>
        <h1 className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {nft.collection}{' '}
          <span className="text-muted-foreground">{nft.tokenId}</span>
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <NetworkBadge network={nft.network} />
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {nft.standard}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {nft.sourcesCount} sources
          </span>
        </div>

        <Card className="mt-6 divide-y divide-border p-4 sm:p-5">
          <DataRow label="Contract" value={nft.contractShort} copy={nft.contract} href={nft.openseaUrl} />
          <DataRow label="Token ID" value={nft.tokenId} />
          <DataRow label="Creator" value={nft.creatorShort} copy={nft.creator} />
          <DataRow label="Owner" value={nft.ownerShort} copy={nft.owner} />
          <DataRow label="Minted" value={nft.minted} />
          <DataRow label="Mint Tx" value={`${nft.mintTx.slice(0, 6)}...${nft.mintTx.slice(-4)}`} copy={nft.mintTx} href="#" />
          <DataRow label="Token URI" value={nft.tokenUri} copy={nft.tokenUri} />
        </Card>
      </div>
    </div>
  )
}
