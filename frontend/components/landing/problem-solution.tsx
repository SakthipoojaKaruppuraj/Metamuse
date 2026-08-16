import { Wallet, Tags, BookOpen, Route, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/surface'

const PROBLEM_CARDS = [
  {
    icon: Wallet,
    title: 'Ownership',
    body: 'You can verify who owns the NFT.',
    known: true,
  },
  {
    icon: Tags,
    title: 'Metadata',
    body: 'You can see traits, attributes, and artwork.',
    known: true,
  },
  {
    icon: BookOpen,
    title: 'Context',
    body: 'But the story behind the artwork is often missing.',
    known: false,
  },
  {
    icon: Route,
    title: 'Provenance',
    body: 'The path from creation to the current asset can be difficult to understand.',
    known: false,
  },
]

export function Problem() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="The problem"
        title="Ownership is not understanding."
        description="Marketplaces prove what you own. They rarely explain what you're actually looking at."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEM_CARDS.map((card) => (
          <Card
            key={card.title}
            className="flex flex-col gap-4 p-6 transition-colors hover:border-primary/30"
          >
            <span
              className={
                'inline-flex size-10 items-center justify-center rounded-xl ' +
                (card.known
                  ? 'bg-lavender text-primary'
                  : 'bg-secondary text-muted-foreground')
              }
            >
              <card.icon className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

const PIPELINE = [
  'OpenSea NFT',
  'NFT Identity',
  'Metadata + Artwork',
  'On-chain Provenance',
  'Project Research',
  'Evidence',
  'AI Explanation',
  'Monad Attestation',
]

const STEPS = [
  {
    n: '01',
    title: 'Identify',
    body: 'Pinpoint the exact NFT from an OpenSea URL or contract and token ID.',
  },
  {
    n: '02',
    title: 'Trace',
    body: 'Reconstruct on-chain provenance and resolve metadata and artwork.',
  },
  {
    n: '03',
    title: 'Explain',
    body: 'Combine evidence and context into a clear, sourced explanation.',
  },
  {
    n: '04',
    title: 'Verify',
    body: 'Anchor the provenance assessment on Monad Testnet.',
  },
]

export function Solution() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The MetaMuse solution"
          title="From NFT to meaning."
          description="A single pipeline turns a technical blockchain identity into an understandable, evidence-backed story."
        />

        <div className="mt-12 flex flex-wrap items-center gap-2">
          {PIPELINE.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground">
                {step}
              </span>
              {i < PIPELINE.length - 1 && (
                <ArrowRight className="size-4 shrink-0 text-primary/50" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.n} className="p-6">
              <p className="font-mono text-sm font-semibold text-primary">
                {step.n}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
