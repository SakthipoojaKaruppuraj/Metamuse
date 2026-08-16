import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Eyebrow, NetworkBadge } from '@/components/ui/badges'
import { primaryNFT } from '@/lib/data'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-lavender/70 via-surface to-background"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pt-24 lg:pb-28">
        <div>
          <Eyebrow>NFT Provenance • Context • Evidence</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            NFTs tell you what you own.{' '}
            <span className="text-primary">
              MetaMuse tells you why it exists.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            MetaMuse analyzes an NFT&apos;s on-chain history, metadata, artwork,
            and project context to explain what it represents, where it came
            from, and why it was created.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-12 px-6 text-base"
              render={<Link href="/analyze" />}
            >
              Analyze an NFT
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 text-base"
              render={<Link href="/how-it-works" />}
            >
              How it works
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <FileSearch className="size-4 text-primary" />
              Evidence-backed analysis
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Verifiable on Monad
            </span>
          </div>
        </div>

        <HeroCard />
      </div>
    </section>
  )
}

function HeroCard() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary/5 blur-2xl"
        aria-hidden="true"
      />
      <div className="rounded-3xl border border-border bg-card p-4 shadow-[0_24px_60px_-24px_rgba(23,21,26,0.22)]">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={primaryNFT.image}
            alt="Example Genesis #1837 artwork"
            width={720}
            height={720}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>
        <div className="flex items-center justify-between px-2 pt-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {primaryNFT.collection}
            </p>
            <p className="text-xs text-muted-foreground">
              Token {primaryNFT.tokenId}
            </p>
          </div>
          <NetworkBadge network="Ethereum" />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
            Why this NFT exists
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            A digital identity collection created to explore how ownership and
            identity can be represented through programmable digital art.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
            <div>
              <p className="text-base font-semibold text-foreground">5</p>
              <p className="text-[11px] text-muted-foreground">
                Evidence sources
              </p>
            </div>
            <div className="border-x border-border">
              <p className="text-base font-semibold text-foreground">95%</p>
              <p className="text-[11px] text-muted-foreground">
                Provenance confidence
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warning">
                <span className="size-1.5 rounded-full bg-warning" />
                Pending
              </span>
              <p className="text-[11px] text-muted-foreground">
                Not yet attested
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
