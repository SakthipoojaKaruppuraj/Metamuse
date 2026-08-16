'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Database, 
  GitFork, 
  SearchCode, 
  MessageSquare, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      label: 'Identify NFT',
      title: 'Paste open sea pointer URL',
      body: 'Identify the target NFT via its OpenSea item link or direct Contract + Token ID inputs (Ethereum chain supported).',
      Icon: Search,
      badge: 'Production-ready'
    },
    {
      num: '02',
      label: 'Retrieve Asset',
      title: 'Extract metadata and artwork CIDs',
      body: 'Query the target contract, resolve the token URI, and retrieve metadata attributes and visual files.',
      Icon: Database,
      badge: 'Production-ready'
    },
    {
      num: '03',
      label: 'Trace Lifecycle',
      title: 'Reconstruct historical provenance chain',
      body: 'Audit transfer events and deployment transactions to reconstruct the timeline from mint to the current custodian.',
      Icon: GitFork,
      badge: 'Mocked in MVP'
    },
    {
      num: '04',
      label: 'Research Context',
      title: 'Collect external project claims',
      body: 'Index statements, official documentation, creator socials, and website data related to the collection.',
      Icon: SearchCode,
      badge: 'Mocked in MVP'
    },
    {
      num: '05',
      label: 'Explain History',
      title: 'Formulate why this exists report',
      body: 'Verify claims, score the confidence metric, and write an editorial report explaining why the NFT exists.',
      Icon: MessageSquare,
      badge: 'Mocked in MVP'
    },
    {
      num: '06',
      label: 'Attest on Monad',
      title: 'Cryptographic commitment anchor',
      body: 'Write a fingerprint hash of the completed evidence report to the Monad registry contract under your wallet signature.',
      Icon: ShieldCheck,
      badge: 'Attestation Prepared'
    },
    {
      num: '07',
      label: 'Verify Integrity',
      title: 'Zero-trust authenticity check',
      body: 'Compare local evidence pointers against the Monad Testnet attested hashes to identify metadata updates or changes.',
      Icon: FileCheck2,
      badge: 'Attestation Prepared'
    }
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Eyebrow>Technical Explanation</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          How MetaMuse Works
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MetaMuse analyzes an NFT and transforms its технический blockchain identity into an evidence-backed story. Here is the 7-step reconstruction pipeline.
        </p>
      </div>

      {/* Production Disclaimer Notice */}
      <Card className="p-4 flex items-start gap-3 border-violet-500/25 bg-violet-500/5 text-xs text-foreground">
        <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-primary">Hackathon MVP Sandbox Note</p>
          <p className="text-muted-foreground leading-normal">
            Currently, steps 1, 2, and the Web3 integration bindings (MetaMask connection, chain switching, and attestation checks) are fully developed. Provenance retrieval and AI explainability engine reports represent mock presets designed for sandbox evaluation. In production, these steps will resolve dynamically using crawler nodes.
          </p>
        </div>
      </Card>

      {/* Steps vertical tree grid */}
      <div className="relative border-l border-border pl-6 ml-4 space-y-12">
        {steps.map((s, idx) => (
          <div key={s.num} className="relative">
            {/* Step node indicator icon */}
            <span className="absolute -left-[45px] top-1.5 inline-flex size-9 items-center justify-center rounded-xl bg-card border border-border text-primary shadow-sm">
              <s.Icon className="size-4.5" />
            </span>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-2xl font-black text-primary/30 tracking-tight font-mono">{s.num}</span>
                <h3 className="text-lg font-bold text-foreground">{s.label}</h3>
                <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  s.badge === 'Production-ready'
                    ? 'bg-success/10 text-success border-success/15'
                    : s.badge === 'Attestation Prepared'
                    ? 'bg-primary/10 text-primary border-primary/15'
                    : 'bg-secondary text-muted-foreground border-border'
                }`}>
                  {s.badge}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">{s.title}</h4>
              <p className="text-xs leading-relaxed text-muted-foreground max-w-2xl">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="text-center pt-6">
        <Button asChild size="lg">
          <Link href="/analyze">
            Analyze your NFT now
            <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </Button>
      </div>

    </div>
  )
}
