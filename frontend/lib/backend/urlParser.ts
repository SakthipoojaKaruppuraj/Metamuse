import { isAddress } from 'viem'

export interface ParsedNFTIdentity {
  chain: string
  contractAddress: `0x${string}`
  tokenId: string
}

export interface ParseResult {
  isValid: boolean
  error?: string
  data?: ParsedNFTIdentity
}

/**
 * Parses and validates an OpenSea Ethereum NFT URL.
 * Expected pattern: https://opensea.io/assets/ethereum/0x.../id
 */
export function parseOpenSeaUrl(url: string): ParseResult {
  if (!url) {
    return { isValid: false, error: 'INVALID_OPENSEA_URL' }
  }

  // SSRF & protocol validation: strictly check protocol and domain
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return { isValid: false, error: 'INVALID_OPENSEA_URL' }
  }

  if (parsedUrl.protocol !== 'https:') {
    return { isValid: false, error: 'INVALID_OPENSEA_URL' }
  }

  if (parsedUrl.hostname !== 'opensea.io' && parsedUrl.hostname !== 'www.opensea.io') {
    return { isValid: false, error: 'INVALID_OPENSEA_URL' }
  }

  // Path segments validation: /assets/{chain}/{contractAddress}/{tokenId}
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
  if (pathSegments.length < 4 || pathSegments[0] !== 'assets') {
    return { isValid: false, error: 'INVALID_OPENSEA_URL' }
  }

  const chain = pathSegments[1].toLowerCase()
  const contractRaw = pathSegments[2]
  const tokenId = pathSegments[3]

  if (chain !== 'ethereum') {
    return { isValid: false, error: 'UNSUPPORTED_CHAIN' }
  }

  if (!isAddress(contractRaw)) {
    return { isValid: false, error: 'INVALID_CONTRACT' }
  }

  // Token ID must be a numeric integer
  const tokenIdRegex = /^\d+$/
  if (!tokenIdRegex.test(tokenId)) {
    return { isValid: false, error: 'INVALID_TOKEN_ID' }
  }

  return {
    isValid: true,
    data: {
      chain,
      contractAddress: contractRaw.toLowerCase() as `0x${string}`,
      tokenId,
    },
  }
}
