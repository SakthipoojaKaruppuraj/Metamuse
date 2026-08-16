'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link as LinkIcon, Hash, ArrowRight, Route, BookOpen, FileSearch, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Tabs } from '@/components/ui/surface'
import { AnalysisProgress } from './analysis-progress'
import { validateOpenSeaUrl } from '@/lib/utils'

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
  const [validationError, setValidationError] = useState('')
  const [targetId, setTargetId] = useState('example-genesis-1837')
  const [activeUrl, setActiveUrl] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (tab === 'url') {
      const check = validateOpenSeaUrl(url)
      if (!check.isValid) {
        setValidationError(check.error || 'Please enter a valid OpenSea NFT URL.')
        return
      }
      setValidationError('')
      setTargetId(check.id || 'example-genesis-1837')
      setActiveUrl(url)
    } else {
      if (!contract || !tokenId) {
        setValidationError('Please fill in both Contract Address and Token ID.')
        return
      }
      const hexRegex = /^0x[a-fA-F0-9]{40}$/
      if (!hexRegex.test(contract)) {
        setValidationError('Contract address must be a valid 40-character hex string (e.g. 0x...).')
        return
      }
      setValidationError('')
      
      let id = 'example-genesis-1837'
      if (contract.toLowerCase() === '0x8c7b4a2757279fc8291c2ea64a2757279fc829a2' || tokenId === '721') {
        id = 'example-collection-721'
      } else if (contract.toLowerCase() === '0x5f60789ac9012a64a27579fc8291c2791f9a79bc' || tokenId === '44') {
        id = 'example-divergent-44'
      }
      setTargetId(id)
      setActiveUrl(`https://opensea.io/assets/ethereum/${contract.toLowerCase()}/${tokenId}`)
    }
    setMode('loading')
  }

  const handleComplete = (analysisId: string, nftData: any) => {
    if (nftData) {
      localStorage.setItem(`nft:${analysisId}`, JSON.stringify(nftData))
    }
    router.push(`/nft/${analysisId}`)
  }

  const handleError = (errorMsg: string) => {
    setValidationError(errorMsg)
    setMode('idle')
  }

  if (mode === 'loading') {
    return (
      <AnalysisProgress 
        openSeaUrl={activeUrl}
        onComplete={handleComplete}
        onError={handleError}
      />
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
            onValueChange={(val) => {
              setTab(val)
              setValidationError('')
            }}
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
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="https://opensea.io/assets/ethereum/0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2/1837"
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Currently supported: OpenSea • Ethereum (Only ERC-721 supported for the MVP)
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
                    onChange={(e) => {
                      setContract(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    placeholder="0x7A3F4C9d2B8E1a05C6f3D9E2b7A1c4F5e6D091C2"
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
                  onChange={(e) => {
                    setTokenId(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  placeholder="1837"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </div>
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Network: Ethereum • ERC-721 standard.
              </p>
            </div>
          )}

          {validationError && (
            <div className="mt-4 flex items-start gap-2 text-xs font-semibold text-destructive bg-destructive/5 border border-destructive/20 rounded-xl p-3 animate-fade-in">
              <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <Button type="submit" className="mt-5 h-11 px-5 cursor-pointer">
            Analyze NFT
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {/* Try a demo presets */}
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Try a demo NFT</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              {
                id: 'example-genesis-1837',
                title: 'Demo Genesis #1837',
                status: 'High confidence • Attested',
                contract: '0x7A3F4C9d2B8E1a05C6f3D9E2b7A1c4F5e6D091C2',
                tokenId: '1837',
                url: 'https://opensea.io/assets/ethereum/0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2/1837'
              },
              {
                id: 'example-collection-721',
                title: 'Lost Artifact #721',
                status: 'Low confidence • Not attested',
                contract: '0x8c7B4a2757279fC8291C2eA64a2757279fc829A2',
                tokenId: '721',
                url: 'https://opensea.io/assets/ethereum/0x8c7b4a2757279fc8291c2ea64a2757279fc829a2/721'
              },
              {
                id: 'example-divergent-44',
                title: 'Divergent Art #44',
                status: 'Verification mismatch',
                contract: '0x5F60789aC9012a64A27579fC8291C2791F9a79BC',
                tokenId: '44',
                url: 'https://opensea.io/assets/ethereum/0x5f60789ac9012a64a27579fc8291c2791f9a79bc/44'
              }
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => {
                  if (tab === 'url') {
                    setUrl(p.url)
                  } else {
                    setContract(p.contract)
                    setTokenId(p.tokenId)
                  }
                  setTargetId(p.id)
                  setValidationError('')
                }}
                className="flex flex-col items-start gap-1 rounded-xl border border-border bg-card p-3 text-left hover:border-primary/50 hover:bg-secondary/40 transition-all cursor-pointer"
              >
                <span className="text-xs font-semibold text-foreground">{p.title}</span>
                <span className="text-[10px] text-muted-foreground">{p.status}</span>
              </button>
            ))}
          </div>
        </div>
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
