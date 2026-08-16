'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockNFTs, attestedExample } from '@/lib/data'
import { useWallet } from '@/components/wallet/wallet-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { 
  ArrowLeft, 
  BadgeCheck, 
  Loader2, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react'

export default function AttestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const nft = mockNFTs[id]
  const wallet = useWallet()
  const router = useRouter()

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [attestStatus, setAttestStatus] = useState<'idle' | 'pending' | 'confirmed' | 'failed'>('idle')
  const [simulateSuccess, setSimulateSuccess] = useState(true)
  const [txHash, setTxHash] = useState('')
  const [blockNumber, setBlockNumber] = useState('')
  const [timestamp, setTimestamp] = useState('')

  if (!nft) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">NFT Audit Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The requested NFT record does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/analyze">Back to Analyze</Link>
        </Button>
      </div>
    )
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const triggerAttest = async () => {
    setAttestStatus('pending')
    await new Promise((r) => setTimeout(r, 1800)) // simulate Monad block inclusion

    if (simulateSuccess) {
      setTxHash('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''))
      setBlockNumber((182000 + Math.floor(Math.random() * 5000)).toString())
      setTimestamp(new Date().toLocaleString())
      setAttestStatus('confirmed')
      // Mutate the mock data local reference to show attested status on result page
      nft.attested = true
      nft.attestation = {
        network: 'Monad Testnet',
        txHash: '0xABC3d4E5f60718293a4B5c6D7e8F90a1b2C3d123',
        block: '#182734',
        attestor: wallet.address || '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F',
        evidenceHash: nft.imageHash,
        provenanceHash: '0x19BC2d4E5f6071829304a5B6c7D8e9F0a1bcA21',
        timestamp: new Date().toLocaleDateString(),
        evidencePackage: `ipfs://QmEv1dence7Package9Hash2For8${nft.id}`
      }
    } else {
      setAttestStatus('failed')
    }
  }

  // Determine current active display state
  const isWalletConnected = wallet.status === 'connected' && wallet.address
  const isWrongNetwork = wallet.status === 'wrong-network'
  const isSwitchingNetwork = wallet.status === 'switching'
  const isConnecting = wallet.status === 'connecting'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link href={`/nft/${nft.id}`} className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1.5 mb-4">
          <ArrowLeft className="size-4" />
          Back to NFT Results
        </Link>
        <Eyebrow>Provenance Attestation</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Anchor Report on Monad
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a public, tamper-evident commitment to this provenance assessment on Monad Testnet.
        </p>
      </div>

      {/* NFT Summary Card */}
      <Card className="p-4 flex items-center gap-4 border-primary/20 bg-primary/5">
        <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-border bg-card">
          <img src={nft.image} alt={nft.collection} className="object-cover size-full" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{nft.collection} {nft.tokenId}</h3>
          <p className="text-xs font-mono text-muted-foreground truncate max-w-sm">{nft.contract}</p>
        </div>
      </Card>

      {/* Main Attestation Controls Block */}
      {attestStatus === 'confirmed' ? (
        <Card className="p-6 border-success/30 bg-success/5 space-y-6 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-success text-success-foreground">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground uppercase tracking-wide">Provenance Attested</h2>
              <span className="text-[10px] uppercase font-bold text-success bg-success/15 px-2 py-0.5 rounded-full border border-success/10">
                Monad Testnet • Demo State
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            The cryptographic commitment for this audit report was successfully written to the Monad registry address. This record is permanent and immutable.
          </p>

          <dl className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2 border-t border-border pt-4 text-xs font-mono">
            {[
              { label: 'Attestation Transaction', value: txHash || '0xABC3d4E5f60718293a4B5c6D7e8F90a1b2C3d123', copy: true },
              { label: 'Explorer Block', value: `#${blockNumber || '182734'}`, copy: false },
              { label: 'Signer Attestor Address', value: wallet.address || '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F', copy: true },
              { label: 'Evidence SHA-256 Fingerprint', value: nft.imageHash, copy: true },
              { label: 'Provenance Hash Commitment', value: '0x19BC2d4E5f6071829304a5B6c7D8e9F0a1bcA21', copy: true },
              { label: 'Timestamp (UTC)', value: timestamp || new Date().toLocaleString(), copy: false },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="text-[10px] text-muted-foreground uppercase font-sans font-bold tracking-wider">{row.label}</dt>
                <dd className="flex items-center gap-1.5 text-foreground truncate select-all">
                  <span className="truncate">{row.value}</span>
                  {row.copy && (
                    <button
                      onClick={() => handleCopy(row.value, row.label)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {copiedField === row.label ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                    </button>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href={`/verify?id=${nft.id}`}>
                Verify Attestation Match
              </Link>
            </Button>
            <a
              href="https://testnet.monadexplorer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              View on Monad Explorer (Demo Link)
              <ExternalLink className="size-3.5 ml-1.5" />
            </a>
          </div>
        </Card>
      ) : attestStatus === 'pending' ? (
        <Card className="p-6 py-12 text-center flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-primary animate-spin" />
          <div>
            <h3 className="font-bold text-foreground">Waiting for Monad Confirmation</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mx-auto leading-relaxed">
              Hashing audit contents and broadcasting transaction to Monad Testnet nodes. Please confirm the signature request in MetaMask.
            </p>
          </div>
        </Card>
      ) : attestStatus === 'failed' ? (
        <Card className="p-6 border-destructive/20 bg-destructive/5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-destructive" />
            <h3 className="font-bold text-foreground">Attestation Transaction Failed</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The transaction was cancelled or rejected by MetaMask. Make sure you accept the gas authorization prompt and try again.
          </p>
          <div className="flex gap-3">
            <Button onClick={triggerAttest}>Try Again</Button>
            <Button variant="outline" onClick={() => setAttestStatus('idle')}>Reset</Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="font-bold text-foreground">Submit Cryptographic Commitment</h3>
          </div>
          
          <div className="space-y-4 text-xs font-mono divide-y divide-border">
            <div className="pt-0 flex justify-between gap-4 py-2">
              <span className="text-muted-foreground font-sans">Evidence Fingerprint:</span>
              <span className="truncate max-w-xs">{nft.imageHash}</span>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <span className="text-muted-foreground font-sans">Evidence package:</span>
              <span className="truncate max-w-xs text-primary">{`ipfs://QmEv1dence7Package9Hash2For8${nft.id}`}</span>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <span className="text-muted-foreground font-sans">Attestation network:</span>
              <span className="font-sans font-bold">Monad Testnet</span>
            </div>
          </div>

          {/* Simulation Toggle in Dev/Mock Mode */}
          <div className="bg-secondary/40 rounded-xl p-3 border border-border flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Demo Simulation Mode:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSimulateSuccess(true)}
                className={`px-2 py-0.5 rounded cursor-pointer ${simulateSuccess ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Success
              </button>
              <button
                onClick={() => setSimulateSuccess(false)}
                className={`px-2 py-0.5 rounded cursor-pointer ${!simulateSuccess ? 'bg-destructive text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                Failure
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            {isWalletConnected ? (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-muted-foreground mb-1">
                  Connected wallet: <span className="font-mono">{wallet.address}</span>
                </p>
                <Button size="lg" onClick={triggerAttest} className="w-full cursor-pointer">
                  Attest on Monad
                </Button>
              </div>
            ) : isWrongNetwork ? (
              <div className="space-y-3 text-center py-2">
                <p className="text-xs text-warning font-semibold">Wrong Network Detected. Switch to Monad Testnet to attest.</p>
                <Button onClick={() => wallet.switchNetwork()} className="w-full cursor-pointer">
                  Switch to Monad Testnet
                </Button>
              </div>
            ) : isSwitchingNetwork ? (
              <Button disabled className="w-full">
                <Loader2 className="size-4 animate-spin mr-2" />
                Switching Wallet Chain...
              </Button>
            ) : isConnecting ? (
              <Button disabled className="w-full">
                <Loader2 className="size-4 animate-spin mr-2" />
                Connecting MetaMask...
              </Button>
            ) : (
              <div className="space-y-3 text-center py-2">
                <p className="text-xs text-muted-foreground">Please connect your MetaMask wallet to submit attestation hashes.</p>
                <Button onClick={() => wallet.connect()} className="w-full cursor-pointer">
                  Connect MetaMask
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

    </div>
  )
}
