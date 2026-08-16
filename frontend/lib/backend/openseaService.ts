export interface NFTAsset {
  identity: {
    chainId: number
    contractAddress: `0x${string}`
    tokenId: string
  }
  name: string
  description: string
  image: string
  metadataUri: string
  collection: {
    name: string
    slug: string
    description: string
    image: string
    externalUrl: string
  }
  traits: Array<{ trait_type: string; value: string | number }>
  tokenStandard: string
  currentOwner: string
  sources: Record<string, string>
  openseaUrl: string
}

export interface OpenSeaEvent {
  type: 'MINT' | 'TRANSFER' | 'SALE'
  transactionHash: string
  fromAddress?: string
  toAddress?: string
  buyer?: string
  seller?: string
  price?: string
  paymentToken?: string
  timestamp: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Robust fetch wrapper to query OpenSea API with auth and retries.
 */
async function fetchOpenSea(path: string, retryCount = 0): Promise<any> {
  const apiKey = process.env.OPENSEA_API_KEY
  if (!apiKey) {
    throw new Error('OPENSEA_UNAUTHORIZED')
  }

  const url = `https://api.opensea.io${path}`
  const headers: Record<string, string> = {
    'accept': 'application/json',
    'x-api-key': apiKey,
  }

  const response = await fetch(url, { headers })

  if (response.status === 401 || response.status === 403) {
    throw new Error('OPENSEA_UNAUTHORIZED')
  }

  if (response.status === 429) {
    if (retryCount < 1) {
      await sleep(1000) // wait 1s and retry once
      return fetchOpenSea(path, retryCount + 1)
    }
    throw new Error('OPENSEA_RATE_LIMITED')
  }

  if (response.status === 404) {
    throw new Error('NFT_NOT_FOUND')
  }

  if (!response.ok) {
    throw new Error('OPENSEA_ERROR')
  }

  return await response.json()
}

/**
 * Fetches the NFT asset metadata from OpenSea and normalizes it.
 */
export async function getNFT(
  contractAddress: `0x${string}`,
  tokenId: string
): Promise<NFTAsset> {
  const contractLower = contractAddress.toLowerCase() as `0x${string}`
  
  // 1. Fetch NFT details
  const nftData = await fetchOpenSea(
    `/api/v2/chain/ethereum/contract/${contractLower}/nfts/${tokenId}`
  )

  // 2. Fetch Collection details
  const collectionData = await fetchOpenSea(
    `/api/v2/chain/ethereum/contract/${contractLower}/nfts/${tokenId}/collection`
  )

  const nft = nftData.nft

  return {
    identity: {
      chainId: 1,
      contractAddress: contractLower,
      tokenId,
    },
    name: nft.name || `${collectionData.name} #${tokenId}`,
    description: nft.description || collectionData.description || '',
    image: nft.image_url || '',
    metadataUri: nft.metadata_url || '',
    collection: {
      name: collectionData.name || 'Unknown Collection',
      slug: collectionData.collection || '',
      description: collectionData.description || '',
      image: collectionData.image_url || '',
      externalUrl: collectionData.project_url || '',
    },
    traits: (nft.traits || []).map((t: any) => ({
      trait_type: t.trait_type,
      value: t.value,
    })),
    tokenStandard: (nft.token_standard || 'erc721').toUpperCase(),
    currentOwner: nft.owners && nft.owners.length > 0 ? nft.owners[0].address : '',
    sources: {
      name: 'OPENSEA',
      description: 'OPENSEA',
      image: 'OPENSEA',
      collection: 'OPENSEA',
    },
    openseaUrl: `https://opensea.io/assets/ethereum/${contractLower}/${tokenId}`,
  }
}

/**
 * Fetches and filters marketplace events for the NFT from OpenSea.
 */
export async function getOpenSeaEvents(
  contractAddress: `0x${string}`,
  tokenId: string
): Promise<OpenSeaEvent[]> {
  const contractLower = contractAddress.toLowerCase() as `0x${string}`
  
  try {
    const data = await fetchOpenSea(
      `/api/v2/events/chain/ethereum/contract/${contractLower}/nfts/${tokenId}`
    )
    
    const events = data.asset_events || []
    const normalizedEvents: OpenSeaEvent[] = []

    for (const e of events) {
      const type = e.event_type.toLowerCase()
      const timestamp = Math.floor(new Date(e.event_timestamp || e.created_date).getTime() / 1000)

      if (type === 'mint' && e.transaction) {
        normalizedEvents.push({
          type: 'MINT',
          transactionHash: e.transaction,
          fromAddress: '0x0000000000000000000000000000000000000000',
          toAddress: e.to_address || e.owner || '',
          timestamp,
        })
      } else if (type === 'transfer' && e.transaction) {
        normalizedEvents.push({
          type: 'TRANSFER',
          transactionHash: e.transaction,
          fromAddress: e.from_address || '',
          toAddress: e.to_address || '',
          timestamp,
        })
      } else if (type === 'sale' && e.transaction) {
        normalizedEvents.push({
          type: 'SALE',
          transactionHash: e.transaction,
          buyer: e.buyer || '',
          seller: e.seller || '',
          price: e.payment?.quantity ? (Number(e.payment.quantity) / (10 ** (e.payment.decimals || 18))).toString() : undefined,
          paymentToken: e.payment?.symbol || 'ETH',
          timestamp,
        })
      }
    }

    return normalizedEvents
  } catch (err) {
    // If events fetch fails, log it and return empty events list gracefully
    console.warn('OpenSea events retrieval failed, returning empty lifecycle events:', err)
    return []
  }
}
