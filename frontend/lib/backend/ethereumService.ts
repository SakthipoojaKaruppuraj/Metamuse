import { createPublicClient, http, fallback, type Address } from 'viem'
import { mainnet } from 'viem/chains'

// Initialize Ethereum Mainnet Public Client with fallback endpoints for resilience
const userRpc = process.env.ETHEREUM_RPC_URL
const rpcTransports = [
  ...(userRpc ? [http(userRpc)] : []),
  http('https://eth.llamarpc.com'),
  http('https://rpc.ankr.com/eth'),
  http('https://ethereum-rpc.publicnode.com'),
  http('https://1rpc.io/eth'),
  http('https://gateway.tenderly.co/public/mainnet'),
]

export const ethereumPublicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(rpcTransports),
})

const ERC721_ABI = [
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
  },
] as const

/**
 * Checks if a contract bytecode exists on Ethereum Mainnet.
 */
export async function validateContractCode(contractAddress: `0x${string}`): Promise<boolean> {
  try {
    const code = await ethereumPublicClient.getBytecode({
      address: contractAddress,
    })
    return !!code && code.length > 2
  } catch (err) {
    console.error('Failed to get contract bytecode:', err)
    return false
  }
}

/**
 * Resolves the current canonical owner of the ERC-721 token on-chain.
 */
export async function getOwnerOf(
  contractAddress: `0x${string}`,
  tokenId: string
): Promise<string | null> {
  try {
    const owner = await ethereumPublicClient.readContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
    })
    return owner
  } catch (err) {
    console.warn(`ownerOf query failed for ${contractAddress} [${tokenId}]:`, err)
    return null
  }
}

/**
 * Resolves the tokenURI pointer of the ERC-721 token on-chain.
 */
export async function getTokenURI(
  contractAddress: `0x${string}`,
  tokenId: string
): Promise<string | null> {
  try {
    const uri = await ethereumPublicClient.readContract({
      address: contractAddress,
      abi: ERC721_ABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    })
    return uri
  } catch (err) {
    console.warn(`tokenURI query failed for ${contractAddress} [${tokenId}]:`, err)
    return null
  }
}

/**
 * Safe asset/metadata URL resolver. 
 * Converts IPFS and Arweave protocol URLs to public HTTP gateways,
 * and validates inputs to prevent SSRF vulnerabilities.
 */
export function resolveAssetUrl(uri: string): string {
  if (!uri) return ''
  const trimmed = uri.trim()

  if (trimmed.startsWith('ipfs://')) {
    const ipfsHash = trimmed.replace('ipfs://', '').replace('/ipfs/', '')
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }

  if (trimmed.startsWith('ar://')) {
    const arHash = trimmed.replace('ar://', '')
    return `https://arweave.net/${arHash}`
  }

  return trimmed
}

/**
 * Fetches token metadata JSON securely from the resolved URI,
 * strictly filtering schemas and hostnames to prevent SSRF loops.
 */
export async function fetchTokenMetadataFromURI(uri: string): Promise<any> {
  const resolved = resolveAssetUrl(uri)
  if (!resolved) {
    throw new Error('TOKEN_URI_FAILED')
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(resolved)
  } catch {
    throw new Error('TOKEN_URI_FAILED')
  }

  // SSRF Safety: Strictly validate protocols and reject private network domains/IPs
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('TOKEN_URI_FAILED')
  }

  const hostname = parsedUrl.hostname.toLowerCase()
  const forbiddenHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
  if (
    forbiddenHosts.includes(hostname) ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.16.') ||
    hostname.startsWith('172.31.')
  ) {
    throw new Error('TOKEN_URI_FAILED')
  }

  try {
    const response = await fetch(resolved, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000), // 5-second timeout limit
    })
    if (!response.ok) {
      throw new Error('TOKEN_URI_FAILED')
    }
    return await response.json()
  } catch (err) {
    console.warn(`Metadata fetch failed from resolved URL ${resolved}:`, err)
    throw new Error('TOKEN_URI_FAILED')
  }
}
