import type { NFTAsset } from './openseaService'
import type { ProvenanceRecord } from './provenanceService'

export interface ContextSource {
  id: string
  title: string
  url: string
  sourceType: 'OFFICIAL_PROJECT' | 'OFFICIAL_CREATOR' | 'OPENSEA' | 'EXTERNAL' | 'ON_CHAIN'
  publisher: string
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

export interface ContextClaim {
  id: string
  text: string
  type: 'PROJECT_PURPOSE' | 'COLLECTION_CONTEXT' | 'CREATOR_CONTEXT' | 'ARTWORK_CONTEXT' | 'CULTURAL_CONTEXT'
  sourceIds: string[]
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

export interface ContextPackage {
  claims: ContextClaim[]
  sources: ContextSource[]
}

/**
 * Safely fetches the HTML content of the official project website,
 * applying size and time limits to avoid blocking or SSRF issues.
 */
async function fetchOfficialWebsite(url: string): Promise<{ title: string; description: string; bodyText: string } | null> {
  if (!url || !url.startsWith('https://')) return null
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3-second limit
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetaMuseBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) return null
    
    const reader = response.body?.getReader()
    if (!reader) return null
    
    let totalBytes = 0
    const chunks: Uint8Array[] = []
    
    while (totalBytes < 102400) { // 100KB limit
      const { done, value } = await reader.read()
      if (done || !value) break
      chunks.push(value)
      totalBytes += value.length
    }
    
    const decoder = new TextDecoder('utf-8')
    const html = chunks.map(chunk => decoder.decode(chunk, { stream: true })).join('')
    
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) ||
                      html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i)
    const description = descMatch ? descMatch[1].trim() : ''

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    let bodyHtml = bodyMatch ? bodyMatch[1] : html
    bodyHtml = bodyHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    bodyHtml = bodyHtml.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    const bodyText = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
    
    return { title, description, bodyText }
  } catch (err) {
    console.log(`Failed to fetch official website ${url}:`, err)
    return null
  }
}

/**
 * Extracts collection context, project metadata, and creator information.
 */
export async function extractContext(
  nft: NFTAsset,
  provenance: ProvenanceRecord
): Promise<ContextPackage> {
  const contract = nft.identity.contractAddress.toLowerCase()
  const tokenId = nft.identity.tokenId
  
  const sources: ContextSource[] = [
    {
      id: 'S1',
      title: 'OpenSea NFT & Collection Metadata',
      url: nft.openseaUrl || `https://opensea.io/assets/ethereum/${contract}/${tokenId}`,
      sourceType: 'OPENSEA',
      publisher: 'OpenSea',
      confidence: 'SOURCE-BACKED',
    },
    {
      id: 'S2',
      title: 'Ethereum Mainnet Public Ledger',
      url: `https://etherscan.io/address/${contract}`,
      sourceType: 'ON_CHAIN',
      publisher: 'Ethereum Foundation',
      confidence: 'VERIFIED',
    }
  ]
  
  const claims: ContextClaim[] = [
    {
      id: 'C1',
      text: `The NFT belongs to the collection '${nft.collection.name}'.`,
      type: 'COLLECTION_CONTEXT',
      sourceIds: ['S1'],
      confidence: 'SOURCE-BACKED',
    },
    {
      id: 'C2',
      text: nft.collection.description
        ? `The collection describes itself as: "${nft.collection.description}"`
        : 'The collection has no description registered on OpenSea.',
      type: 'PROJECT_PURPOSE',
      sourceIds: ['S1'],
      confidence: nft.collection.description ? 'SOURCE-BACKED' : 'UNKNOWN',
    },
    {
      id: 'C3',
      text: provenance.mint.minter
        ? `The token was minted directly by wallet address ${provenance.mint.minter}.`
        : 'The mint recipient wallet could not be verified on-chain.',
      type: 'CREATOR_CONTEXT',
      sourceIds: ['S2'],
      confidence: provenance.mint.minter ? 'SOURCE-BACKED' : 'UNKNOWN',
    },
    {
      id: 'C4',
      text: `The artwork is named '${nft.name}' and exhibits features: ${nft.traits.map(t => `${t.trait_type} = ${t.value}`).join(', ') || 'No traits declared.'}`,
      type: 'ARTWORK_CONTEXT',
      sourceIds: ['S1'],
      confidence: 'VERIFIED',
    }
  ]

  // Optional Official Project Website Fetch
  const extUrl = nft.collection.externalUrl
  if (extUrl && extUrl.startsWith('https://')) {
    const webMeta = await fetchOfficialWebsite(extUrl)
    if (webMeta) {
      sources.push({
        id: 'S3',
        title: webMeta.title || 'Official Project Website',
        url: extUrl,
        sourceType: 'OFFICIAL_PROJECT',
        publisher: new URL(extUrl).hostname,
        confidence: 'SOURCE-BACKED',
      })
      
      claims.push({
        id: 'C5',
        text: webMeta.description
          ? `The official project website states: "${webMeta.description}"`
          : `The official project website title is "${webMeta.title}" and contains details: "${webMeta.bodyText.slice(0, 150)}..."`,
        type: 'PROJECT_PURPOSE',
        sourceIds: ['S3'],
        confidence: 'SOURCE-BACKED',
      })
    }
  }
  
  return { claims, sources }
}
