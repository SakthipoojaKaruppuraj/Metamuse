import Link from 'next/link'
import type { NFT } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ExplorerLink } from '@/components/ui/badges'
import { CopyButton } from '@/components/ui/copy-button'
import { BadgeCheck, ShieldCheck, ArrowRight } from 'lucide-react'

export function AttestCta({ nft }: { nft: NFT }) {
  if (nft.attested && nft.attestation) {
    const a = nft.attestation
    return (
      <section
        aria-label="Attestation"
        className="rounded-2xl border border-success/25 bg-success/5 p-6 sm:p-8"
      >
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-5 text-success" />
          <h2 className="text-xl font-semibold text-foreground">
            Attested on {a.network}
          </h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This report was hashed and its fingerprint written on-chain. Anyone
          can re-run the analysis and confirm it matches this permanent record.
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {[
            ['Attestation Tx', a.txHash, true],
            ['Block', a.block, false],
            ['Evidence hash', a.evidenceHash, false],
            ['Provenance hash', a.provenanceHash, false],
          ].map(([label, value, link]) => (
            <div key={label as string} className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="flex items-center gap-1.5 font-mono text-sm text-foreground">
                {link ? (
                  <ExplorerLink href="#">
                    {(value as string).slice(0, 10)}...
                  </ExplorerLink>
                ) : (
                  <span>{value}</span>
                )}
                <CopyButton value={value as string} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/verify?id=${nft.id}`}>
              Verify this report
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <ExplorerLink href="#" className="text-foreground">
              View on Monad explorer
            </ExplorerLink>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-label="Attestation"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Make this report permanent
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Attesting hashes the evidence package and provenance graph, then
            writes the fingerprint to Monad. The report becomes independently
            verifiable — no trust in MetaMuse required.
          </p>
        </div>
        <Button size="lg" asChild className="lg:justify-self-end">
          <Link href={`/attest?id=${nft.id}`}>
            Attest on Monad
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
