'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { historyEntries } from '@/lib/data'
import { Card } from '@/components/ui/surface'
import { Eyebrow } from '@/components/ui/badges'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, ArrowUpDown, ArrowRight, Clock, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [filterAttested, setFilterAttested] = useState<string>('all') // 'all' | 'attested' | 'unattested'
  const [sortBy, setSortBy] = useState<'date' | 'confidence'>('date')

  const filteredEntries = historyEntries.filter((item) => {
    const matchesSearch = item.collection.toLowerCase().includes(search.toLowerCase()) || item.tokenId.includes(search)
    const matchesAttested = 
      filterAttested === 'all' || 
      (filterAttested === 'attested' && item.attested) ||
      (filterAttested === 'unattested' && !item.attested)
    return matchesSearch && matchesAttested
  }).sort((a, b) => {
    if (sortBy === 'confidence') {
      return b.confidence - a.confidence
    }
    // Sort by Date (standard mock dates)
    return b.analyzedOn.localeCompare(a.analyzedOn)
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <Eyebrow>Audit Archive</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Analysis History
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mock entries representing NFTs previously audited using the MetaMuse explainability layer.
        </p>
      </div>

      {/* Control panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs flex items-center gap-2 rounded-xl border border-input bg-card px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audits..."
            className="h-10 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:justify-end">
          {/* Attestation filter */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 border border-border">
            {[
              { value: 'all', label: 'All' },
              { value: 'attested', label: 'Attested' },
              { value: 'unattested', label: 'Not Attested' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterAttested(tab.value)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterAttested === tab.value
                    ? 'bg-card text-primary shadow-sm border border-border/55'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort trigger */}
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'confidence' : 'date')}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowUpDown className="size-3.5" />
            <span>Sort by {sortBy === 'date' ? 'Date' : 'Confidence'}</span>
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredEntries.map((item) => (
          <Card key={item.id} className="p-4 flex gap-4 hover:border-primary/40 hover:shadow-md transition-all relative overflow-hidden">
            <div className="relative size-20 shrink-0 rounded-xl overflow-hidden border border-border bg-card">
              <img src={item.image} alt={item.collection} className="object-cover size-full" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{item.network} • ERC-721</span>
                  <span className="text-[10px] text-muted-foreground">{item.analyzedOn}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground mt-1 line-clamp-1">
                  {item.collection} {item.tokenId}
                </h3>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-2 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground">{item.confidence}%</span>
                  <span className="text-[10px] text-muted-foreground font-sans">Confidence</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.attested ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/15">
                      <ShieldCheck className="size-3" />
                      Attested
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/15">
                      <Clock className="size-3" />
                      Unanchored
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden navigation click target overlay */}
            <Link href={`/nft/${item.id}`} className="absolute inset-0 z-10" aria-label={`View audit for ${item.collection}`} />
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <Card className="p-12 text-center col-span-full border-dashed flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">No historical audits found matching filter query.</p>
            <Button asChild className="mt-4">
              <Link href="/analyze">
                Analyze your first NFT
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </Card>
        )}
      </div>

    </div>
  )
}
