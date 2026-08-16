import { 
  createPublicClient, 
  createWalletClient, 
  custom, 
  http, 
  type Address,
  type Hash
} from 'viem'
import { defineChain } from 'viem/utils'
import { 
  MONAD_PROVENANCE_REGISTRY_ADDRESS, 
  MONAD_CHAIN_ID, 
  MONAD_RPC_URL, 
  MONAD_EXPLORER_URL 
} from './config'
import NFTProvenanceRegistryABI from './NFTProvenanceRegistry.abi.json'

// Define the Monad Testnet custom chain
export const monadTestnet = defineChain({
  id: MONAD_CHAIN_ID,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
    public: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'MonadVision', url: MONAD_EXPLORER_URL },
  },
})

// Create single public client for RPC reads
export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(MONAD_RPC_URL),
})

export interface AttestationRecord {
  evidenceHash: `0x${string}`
  provenanceHash: `0x${string}`
  attestor: string
  timestamp: number
  version: number
}

let globalMetaMaskProvider: any = null

if (typeof window !== 'undefined') {
  // Listen for announced wallet providers (EIP-6963)
  window.addEventListener('eip6963:announceProvider', (event: any) => {
    const detail = event?.detail
    if (
      detail?.info?.rdns === 'io.metamask' || 
      String(detail?.info?.name || '').toLowerCase().includes('metamask')
    ) {
      globalMetaMaskProvider = detail.provider
    }
  })
  // Request providers to announce themselves
  window.dispatchEvent(new Event('eip6963:requestProvider'))
}

/**
 * Safely resolves the MetaMask provider using EIP-6963 or fallback injection.
 */
export function getMetaMaskProvider() {
  if (globalMetaMaskProvider) {
    return globalMetaMaskProvider
  }

  if (typeof window === 'undefined' || !window.ethereum) {
    return null
  }
  // Fallback to window.ethereum.providers array
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const metamaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask)
    if (metamaskProvider) {
      return metamaskProvider
    }
  }
  // Fallback to checking if injected window.ethereum is MetaMask
  if (window.ethereum.isMetaMask) {
    return window.ethereum
  }
  return window.ethereum
}

// Browser-safe Wallet Client getter
export function getWalletClient() {
  const provider = getMetaMaskProvider()
  if (!provider) {
    return null
  }
  return createWalletClient({
    chain: monadTestnet,
    transport: custom(provider),
  })
}

/**
 * Normalizes EVM errors to human-readable strings.
 */
export function normalizeError(error: any): string {
  if (!error) return 'UNKNOWN_ERROR'
  const msg = String(error.message || error).toLowerCase()

  if (msg.includes('user rejected') || msg.includes('user_rejected') || msg.includes('user denied')) {
    return 'USER_REJECTED'
  }
  if (msg.includes('chain') && (msg.includes('switch') || msg.includes('add'))) {
    return 'WRONG_NETWORK'
  }
  if (msg.includes('revert') || msg.includes('execution reverted')) {
    return 'TRANSACTION_REVERTED'
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('rpc')) {
    return 'RPC_ERROR'
  }
  return 'UNKNOWN_ERROR'
}

/**
 * Reads the latest attestation for a given NFT from the registry.
 */
export async function getLatestAttestation(
  nftContract: string,
  tokenId: string
): Promise<AttestationRecord> {
  const data = await publicClient.readContract({
    address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
    abi: NFTProvenanceRegistryABI,
    functionName: 'getLatestAttestation',
    args: [nftContract as Address, BigInt(tokenId)],
  }) as {
    evidenceHash: `0x${string}`
    provenanceHash: `0x${string}`
    attestor: string
    timestamp: bigint
    version: bigint
  }

  return {
    evidenceHash: data.evidenceHash,
    provenanceHash: data.provenanceHash,
    attestor: data.attestor,
    timestamp: Number(data.timestamp),
    version: Number(data.version),
  }
}

/**
 * Reads the complete attestation history for a given NFT.
 */
export async function getAttestationHistory(
  nftContract: string,
  tokenId: string
): Promise<AttestationRecord[]> {
  const data = await publicClient.readContract({
    address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
    abi: NFTProvenanceRegistryABI,
    functionName: 'getAttestationHistory',
    args: [nftContract as Address, BigInt(tokenId)],
  }) as Array<{
    evidenceHash: `0x${string}`
    provenanceHash: `0x${string}`
    attestor: string
    timestamp: bigint
    version: bigint
  }>

  return data.map((item) => ({
    evidenceHash: item.evidenceHash,
    provenanceHash: item.provenanceHash,
    attestor: item.attestor,
    timestamp: Number(item.timestamp),
    version: Number(item.version),
  }))
}

/**
 * Checks on-chain if the provided evidence commitment matches the latest one.
 */
export async function verifyAttestation(
  nftContract: string,
  tokenId: string,
  currentEvidenceHash: string
): Promise<boolean> {
  return await publicClient.readContract({
    address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
    abi: NFTProvenanceRegistryABI,
    functionName: 'verifyAttestation',
    args: [nftContract as Address, BigInt(tokenId), currentEvidenceHash as Hash],
  }) as boolean
}

/**
 * Submits an attestation transaction via MetaMask.
 */
export async function attestProvenance(
  nftContract: string,
  tokenId: string,
  evidenceHash: string,
  provenanceHash: string
): Promise<{ transactionHash: `0x${string}`; blockNumber: bigint; status: 'success' | 'reverted' }> {
  const walletClient = getWalletClient()
  if (!walletClient) {
    throw new Error('NO_METAMASK')
  }

  // Request accounts connection
  const [address] = await walletClient.requestAddresses()
  if (!address) {
    throw new Error('USER_REJECTED')
  }

  // Submit write transaction
  const hash = await walletClient.writeContract({
    account: address,
    address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
    abi: NFTProvenanceRegistryABI,
    functionName: 'attestProvenance',
    args: [nftContract as Address, BigInt(tokenId), evidenceHash as Hash, provenanceHash as Hash],
  })

  // Wait for block confirmation receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash })

  return {
    transactionHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    status: receipt.status,
  }
}
