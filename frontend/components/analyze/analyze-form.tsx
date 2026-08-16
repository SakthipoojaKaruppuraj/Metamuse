'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link as LinkIcon, Hash, ArrowRight, Route, BookOpen, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Tabs } from '@/components/ui/surface'
import { AnalysisProgress } from './analysis-progress'
import { primaryNFT } from '@/lib/data'

type Mode = 'idle' | 'loading'

const FEATURES = [
  {
    icon: Route,
    title: 'On-chain provenance',
    body: 'Every transfer from mint to current owner, reconstructed from the chain.',
  },
  {
    icon: BookOpen,
    title: 'Project context',
    body: 'Who created it, what the collection means, and why it was made.',
  },
  {
    icon: FileSearch,
    title: 'Evidence-backed explanation',
    body: 'Each claim carries a source and a clearly-labeled confidence level.',
  },
]

export function AnalyzeForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('idle')
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [contract, setContract] = useState('')
  const [tokenId, setTokenId] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setMode('loading')
  }

  if (mode === 'loading') {
    return (
      <AnalysisProgress onComplete={() => router.push(`/nft/${primaryNFT.id}`)} />
    )
  }

  return (
    <div className="space-y-12">
      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Identify your NFT
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you&apos;d like to point MetaMuse at the asset.
        </p>

        <div className="mt-5">
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: 'url', label: 'OpenSea URL' },
              { value: 'contract', label: 'Contract + Token ID' },
            ]}
          />
        </div>

        <form onSubmit={submit} className="mt-5">
          {tab === 'url' ? (
            <div>
              <label
                htmlFor="opensea-url"
                className="text-sm font-medium text-foreground"
              >
                Paste OpenSea NFT URL
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
                <LinkIcon className="size-4 shrink-0 text-muted-foreground" />
                <input
                  id="opensea-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://opensea.io/item/ethereum/..."
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Currently supported: OpenSea • Ethereum
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
              <div>
                <label
                  htmlFor="contract"
                  className="text-sm font-medium text-foreground"
                >
                  Contract address
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
                  <Hash className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    id="contract"
                    value={contract}
                    onChange={(e) => setContract(e.target.value)}
                    placeholder="0x7A3F...91C2"
                    className="h-11 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="token-id"
                  className="text-sm font-medium text-foreground"
                >
                  Token ID
                </label>
                <input
                  id="token-id"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="1837"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </div>
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Network: Ethereum • ERC-721 support for the hackathon MVP.
              </p>
            </div>
          )}

          <Button type="submit" className="mt-5 h-11 px-5">
            Analyze NFT
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </Card>

      <div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Your NFT story starts here.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Paste an OpenSea NFT URL to uncover its provenance, context, and
            evidence.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-lavender text-primary">
                <f.icon className="size-5" />
              </span>
              <h4 className="mt-4 text-base font-semibold text-foreground">
                {f.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
