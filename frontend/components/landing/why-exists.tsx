import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { primaryNFT } from '@/lib/data'

const CHIPS = [
  'Official Project',
  'Creator Statement',
  'Mint Transaction',
  'Metadata',
  'Artwork Analysis',
]

export function WhyExists() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Why this NFT exists"
        title={
          <>
            Finally, an answer to:
            <br />
            why does this NFT exist?
          </>
        }
      />

      <div className="mt-12 grid gap-6 overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative bg-lavender/50 p-6 sm:p-8">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={primaryNFT.image}
              alt="Example Genesis #1837 artwork"
              width={640}
              height={640}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lavender px-2.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Evidence-backed
          </div>
          <p className="mt-4 text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
            Why this NFT exists
          </p>
          <p className="mt-3 text-xl leading-relaxed text-foreground text-pretty">
            This NFT belongs to the MetaMuse Demo Genesis collection, a digital identity
            set created to explore how ownership and identity can be represented
            through programmable digital art.
          </p>
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Based on 5 sources
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-6 h-10 w-fit px-4"
            render={<Link href={`/nft/${primaryNFT.id}`} />}
          >
            See the full analysis
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
