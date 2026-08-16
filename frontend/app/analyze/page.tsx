import type { Metadata } from 'next'
import { Eyebrow } from '@/components/ui/badges'
import { AnalyzeForm } from '@/components/analyze/analyze-form'

export const metadata: Metadata = {
  title: 'Analyze an NFT — MetaMuse',
  description:
    'Give MetaMuse an OpenSea NFT and uncover its provenance, context, and evidence.',
}

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Eyebrow>Analyze</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analyze an NFT
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Give MetaMuse an OpenSea NFT and we&apos;ll uncover its story.
        </p>
      </div>
      <AnalyzeForm />
    </div>
  )
}
