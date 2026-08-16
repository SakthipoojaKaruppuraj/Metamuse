import Link from 'next/link'
import { ArrowRight, Hash, Link2, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/surface'
import { Button } from '@/components/ui/button'
import { ConfidenceBadge } from '@/components/ui/confidence-badge'
import { ProvenanceGraph } from '@/components/provenance/provenance-graph'
import { EvidenceCard } from '@/components/evidence/evidence-card'
import { primaryNFT, attestedExample } from '@/lib/data'

export function ProvenancePreview() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Provenance"
          title="Trace the story behind the asset."
          description="Every step from creation to the current owner, reconstructed from on-chain evidence."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <ProvenanceGraph withControls={false} />
          <Card className="flex flex-col justify-center gap-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Provenance confidence
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  95%
                </span>
                <ConfidenceBadge confidence="verified" />
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: '95%' }}
                />
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Evidence types
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['On-chain', 'Metadata', 'Project source'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function EvidencePreview() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Evidence"
        title="Every important claim has a source."
        description="MetaMuse separates what is proven on-chain from what is inferred — and never presents an interpretation as a fact."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {primaryNFT.evidence.slice(0, 3).map((item) => (
          <EvidenceCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8">
        <Button
          variant="outline"
          className="h-10 px-4"
          render={<Link href={`/nft/${primaryNFT.id}/evidence`} />}
        >
          View all evidence
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}

const FLOW = [
  { label: 'Provenance Report', Icon: ShieldCheck },
  { label: 'Evidence Hash', Icon: Hash },
  { label: 'Monad', Icon: Link2 },
  { label: 'Public Attestation', Icon: CheckCircle2 },
  { label: 'Independent Verification', Icon: ShieldCheck },
]

export function MonadPreview() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Monad verification"
          title="Make provenance verifiable."
          description="MetaMuse can cryptographically attest the provenance assessment on Monad Testnet. The NFT remains on its original chain — Monad provides a public, tamper-evident record of the assessment."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="flex flex-col justify-center gap-3">
            {FLOW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-lg bg-lavender text-primary">
                    <step.Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {step.label}
                  </span>
                </div>
                {i < FLOW.length - 1 && (
                  <span className="text-xs text-primary/50">→</span>
                )}
              </div>
            ))}
          </div>

          <Card className="border-primary/30 bg-card">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Provenance attested
                </p>
                <p className="text-xs text-muted-foreground">Monad Testnet</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="NFT" value="Ethereum / 0xABC… / #1837" />
              <Row label="Evidence hash" value={attestedExample.evidenceHash} mono />
              <Row label="Attestation" value={attestedExample.txHash} mono />
              <div className="flex items-center justify-between border-t border-border pt-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <ConfidenceBadge confidence="verified" />
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={
          'truncate text-foreground ' + (mono ? 'font-mono text-xs' : '')
        }
      >
        {value}
      </dd>
    </div>
  )
}

const HIW = [
  { n: '01', title: 'Identify', body: 'Paste an OpenSea NFT URL.' },
  {
    n: '02',
    title: 'Trace',
    body: 'We reconstruct its on-chain provenance and metadata.',
  },
  {
    n: '03',
    title: 'Explain',
    body: 'We combine evidence and context to explain why the NFT exists.',
  },
  {
    n: '04',
    title: 'Verify',
    body: 'We anchor the provenance assessment on Monad.',
  },
]

export function HowItWorksStrip() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="How MetaMuse works" title="Four steps to meaning." />
      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {HIW.map((step) => (
          <div key={step.n} className="flex flex-col gap-3 bg-card p-7">
            <p className="font-mono text-sm font-semibold text-primary">
              {step.n}
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-lavender px-6 py-16 text-center sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
          Don&apos;t just know what you own. Understand it.
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="h-12 px-6 text-base" render={<Link href="/analyze" />}>
            Analyze an NFT
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-12 bg-card px-6 text-base"
            render={<Link href="/how-it-works" />}
          >
            See how MetaMuse works
          </Button>
        </div>
      </div>
    </section>
  )
}
