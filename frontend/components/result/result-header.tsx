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
  const collectionName = nft?.collection || 'NFT Collection'
  const tokenId = nft?.tokenId || '#0'
  const image = nft?.image || '/placeholder.svg'
  const network = nft?.network || 'Ethereum'
  const standard = nft?.standard || 'ERC-721'
  const sourcesCount = nft?.sourcesCount ?? 0
  const contract = nft?.contract || ''
  const contractShort = nft?.contractShort || (contract ? `${contract.slice(0, 6)}...${contract.slice(-4)}` : 'N/A')
  const creator = nft?.creator || ''
  const creatorShort = nft?.creatorShort || (creator ? `${creator.slice(0, 6)}...${creator.slice(-4)}` : 'N/A')
  const owner = nft?.owner || ''
  const ownerShort = nft?.ownerShort || (owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : 'N/A')
  const minted = nft?.minted || 'Unknown'
  const mintTx = nft?.mintTx || ''
  const mintTxShort = mintTx && mintTx.length >= 10 ? `${mintTx.slice(0, 6)}...${mintTx.slice(-4)}` : mintTx || 'N/A'
  const tokenUri = nft?.tokenUri || 'N/A'
  const openseaUrl = nft?.openseaUrl || '#'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            src={image}
            alt={`Artwork for ${collectionName} ${tokenId}`}
            width={840}
            height={840}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            {nft?.attested ? (
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
          <ExplorerLink href={openseaUrl}>View on OpenSea</ExplorerLink>
        </div>
      </div>

      <div className="flex flex-col">
        <Eyebrow>Identity report</Eyebrow>
        <h1 className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {collectionName}{' '}
          <span className="text-muted-foreground">{tokenId}</span>
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <NetworkBadge network={network} />
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {standard}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {sourcesCount} sources
          </span>
        </div>

        <Card className="mt-6 divide-y divide-border p-4 sm:p-5">
          <DataRow label="Contract" value={contractShort} copy={contract} href={openseaUrl} />
          <DataRow label="Token ID" value={tokenId} />
          <DataRow label="Creator" value={creatorShort} copy={creator} />
          <DataRow label="Owner" value={ownerShort} copy={owner} />
          <DataRow label="Minted" value={minted} />
          <DataRow 
            label="Mint Tx" 
            value={mintTxShort} 
            copy={mintTx || undefined} 
            href={mintTx.startsWith('0x') ? `https://etherscan.io/tx/${mintTx}` : undefined} 
          />
          <DataRow label="Token URI" value={tokenUri} copy={tokenUri} />
        </Card>
      </div>
    </div>
  )
}
