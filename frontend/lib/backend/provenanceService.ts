import { parseAbiItem, type Address } from 'viem'
import { ethereumPublicClient } from './ethereumService'
import { getOpenSeaEvents, type OpenSeaEvent } from './openseaService'
import { serverCache } from './cache'

export interface ProvenanceTimelineEvent {
  type: 'MINT' | 'TRANSFER' | 'BURN' | 'SALE'
  from: string
  to: string
  transactionHash: string
  blockNumber: number
  timestamp: number
  price?: string
  paymentToken?: string
  source: 'ON_CHAIN' | 'OPENSEA'
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

export interface CreatorCandidate {
  address: string
  role: 'CONTRACT_DEPLOYER' | 'MINT_RECIPIENT' | 'COLLECTION_ATTRIBUTED_CREATOR' | 'UNKNOWN'
  evidence: string
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

export interface ProvenanceRecord {
  identity: {
    chainId: number
    contractAddress: `0x${string}`
    tokenId: string
  }
  contractDeployment: {
    deployer: string | null
    blockNumber: number | null
    timestamp: number | null
  }
  mint: {
    transactionHash: string | null
    blockNumber: number | null
    timestamp: number | null
    minter: string | null
  }
  transfers: ProvenanceTimelineEvent[]
  sales: ProvenanceTimelineEvent[]
  currentOwner: string
  creatorCandidates: CreatorCandidate[]
  sources: string[]
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

// Scanning boundaries configuration
const CHUNK_SIZE = 150000n
const MAX_BLOCKS_SCANNED = 3000000n // Search up to ~3M blocks (approx 1.2 years)

/**
 * Resolves and caches block timestamps to prevent RPC duplicate fetch limits.
 */
async function getBlockTimestamp(blockNumber: bigint): Promise<number> {
  const cacheKey = `timestamp:${blockNumber.toString()}`
  const cached = serverCache.get<number>(cacheKey)
  if (cached !== null) return cached

  try {
    const block = await ethereumPublicClient.getBlock({ blockNumber })
    const ts = Number(block.timestamp)
    serverCache.set(cacheKey, ts)
    return ts
  } catch (err) {
    console.warn(`Failed to fetch timestamp for block ${blockNumber}:`, err)
    return 0
  }
}

/**
 * Queries Ethereum Mainnet log events backwards in chunked block ranges
 * until the mint event is found or we hit MAX_BLOCKS_SCANNED.
 */
async function getOnChainTransferLogs(
  contractAddress: `0x${string}`,
  tokenId: string
): Promise<any[]> {
  try {
    const latestBlock = await ethereumPublicClient.getBlockNumber()
    let toBlock = latestBlock
    let fromBlock = toBlock - CHUNK_SIZE
    let logs: any[] = []
    let scannedBlocks = 0n

    const transferAbi = parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
    )

    // Try direct query from block 0 to latest first (highly efficient with tokenId filter)
    try {
      const quickLogs = await ethereumPublicClient.getLogs({
        address: contractAddress,
        event: transferAbi,
        args: { tokenId: BigInt(tokenId) },
        fromBlock: 0n,
        toBlock: latestBlock,
      })
      const hasMint = quickLogs.some(
        (log) => log.args.from === '0x0000000000000000000000000000000000000000'
      )
      if (hasMint) {
        return quickLogs
      }
      logs = quickLogs
    } catch (err) {
      console.log('Direct log query from block 0 failed, falling back to scanning...', err)
    }

    // Backup: scan backwards if direct query failed or did not return the mint log
    if (logs.length === 0) {
      try {
        const quickLogs = await ethereumPublicClient.getLogs({
          address: contractAddress,
          event: transferAbi,
          args: { tokenId: BigInt(tokenId) },
          fromBlock: toBlock - 300000n,
          toBlock,
        })
        
        const hasMint = quickLogs.some(
          (log) => log.args.from === '0x0000000000000000000000000000000000000000'
        )
        if (hasMint) {
          return quickLogs
        }
        logs = quickLogs
        toBlock = toBlock - 300001n
        fromBlock = toBlock - CHUNK_SIZE
        scannedBlocks += 300000n
      } catch {
        console.log('EVM RPC bulk query limit hit, falling back to chunked query loop...')
      }
    }

    while (scannedBlocks < MAX_BLOCKS_SCANNED && toBlock > 0n) {
      if (fromBlock < 0n) fromBlock = 0n
      
      try {
        const chunkLogs = await ethereumPublicClient.getLogs({
          address: contractAddress,
          event: transferAbi,
          args: { tokenId: BigInt(tokenId) },
          fromBlock,
          toBlock,
        })

        logs = [...chunkLogs, ...logs]

        // Stop scanning early if we resolved the mint event
        const hasMint = chunkLogs.some(
          (log) => log.args.from === '0x0000000000000000000000000000000000000000'
        )
        if (hasMint) {
          break
        }
      } catch (err) {
        console.warn(`Chunked log query failed for range ${fromBlock} - ${toBlock}:`, err)
        break
      }

      scannedBlocks += (toBlock - fromBlock + 1n)
      toBlock = fromBlock - 1n
      fromBlock = toBlock - CHUNK_SIZE
    }

    return logs
  } catch (err) {
    console.error('Failed to reconstruct transfer logs from EVM RPC:', err)
    return []
  }
}

/**
 * Reconstructs lifecycle, timeline events, and candidate creators.
 */
export async function reconstructProvenance(
  contractAddress: `0x${string}`,
  tokenId: string,
  openseaOwner: string,
  collectionCreatorAddr?: string
): Promise<ProvenanceRecord> {
  const contractLower = contractAddress.toLowerCase() as `0x${string}`
  
  // 1. Fetch OpenSea Events & EVM logs in parallel
  const [osEvents, evmLogs] = await Promise.all([
    getOpenSeaEvents(contractLower, tokenId),
    getOnChainTransferLogs(contractLower, tokenId),
  ])

  const transfers: ProvenanceTimelineEvent[] = []
  const sales: ProvenanceTimelineEvent[] = []

  let mintTxHash: string | null = null
  let mintBlock: number | null = null
  let mintTimestamp: number | null = null
  let minterAddress: string | null = null

  // 2. Reconstruct transfer events from verified on-chain logs
  for (const log of evmLogs) {
    const from = (log.args.from || '').toLowerCase()
    const to = (log.args.to || '').toLowerCase()
    const blockNumber = Number(log.blockNumber)
    const transactionHash = log.transactionHash
    const timestamp = await getBlockTimestamp(log.blockNumber)

    const isMint = from === '0x0000000000000000000000000000000000000000'
    const isBurn = to === '0x0000000000000000000000000000000000000000'

    if (isMint) {
      mintTxHash = transactionHash
      mintBlock = blockNumber
      mintTimestamp = timestamp
      minterAddress = to

      transfers.push({
        type: 'MINT',
        from,
        to,
        transactionHash,
        blockNumber,
        timestamp,
        source: 'ON_CHAIN',
        confidence: 'VERIFIED',
      })
    } else if (isBurn) {
      transfers.push({
        type: 'BURN',
        from,
        to,
        transactionHash,
        blockNumber,
        timestamp,
        source: 'ON_CHAIN',
        confidence: 'VERIFIED',
      })
    } else {
      transfers.push({
        type: 'TRANSFER',
        from,
        to,
        transactionHash,
        blockNumber,
        timestamp,
        source: 'ON_CHAIN',
        confidence: 'VERIFIED',
      })
    }
  }

  // 3. Process OpenSea events (sales)
  for (const e of osEvents) {
    if (e.type === 'SALE') {
      sales.push({
        type: 'SALE',
        from: e.seller || '',
        to: e.buyer || '',
        transactionHash: e.transactionHash,
        blockNumber: 0, // OS API doesn't guarantee blocks
        timestamp: e.timestamp,
        price: e.price,
        paymentToken: e.paymentToken,
        source: 'OPENSEA',
        confidence: 'SOURCE-BACKED',
      })
    }
  }

  // Sort timeline events chronologically
  transfers.sort((a, b) => a.timestamp - b.timestamp)
  sales.sort((a, b) => a.timestamp - b.timestamp)

  // 4. Resolve creator candidates
  const creatorCandidates: CreatorCandidate[] = []

  // Candidate 1: Mint Recipient
  if (minterAddress) {
    creatorCandidates.push({
      address: minterAddress,
      role: 'MINT_RECIPIENT',
      evidence: `Token minter in transaction ${mintTxHash}`,
      confidence: 'SOURCE-BACKED',
    })
  }

  // Candidate 2: Collection creator returned from OpenSea
  if (collectionCreatorAddr) {
    const collectionCreatorLower = collectionCreatorAddr.toLowerCase()
    creatorCandidates.push({
      address: collectionCreatorLower,
      role: 'COLLECTION_ATTRIBUTED_CREATOR',
      evidence: 'Sourced from OpenSea collection registration data',
      confidence: 'SOURCE-BACKED',
    })

    // If Mint Recipient matches Collection Attributed Creator, elevate to VERIFIED
    if (minterAddress === collectionCreatorLower) {
      const matchIndex = creatorCandidates.findIndex(c => c.role === 'MINT_RECIPIENT')
      if (matchIndex >= 0) {
        creatorCandidates[matchIndex].confidence = 'VERIFIED'
        creatorCandidates[matchIndex].evidence = 'Minter address matches the registered collection creator address.'
      }
    }
  }

  // Contract Deployer placeholder (marked as unresolved/unknown for the MVP to avoid RPC lookup loops)
  creatorCandidates.push({
    address: '0x0000000000000000000000000000000000000000',
    role: 'CONTRACT_DEPLOYER',
    evidence: 'Contract deployer block history unresolved for MVP',
    confidence: 'UNKNOWN',
  })

  // Determine current active owner from RPC or fall back to OpenSea
  const finalOwner = openseaOwner || (transfers.length > 0 ? transfers[transfers.length - 1].to : '')

  return {
    identity: {
      chainId: 1,
      contractAddress: contractLower,
      tokenId,
    },
    contractDeployment: {
      deployer: null,
      blockNumber: null,
      timestamp: null,
    },
    mint: {
      transactionHash: mintTxHash,
      blockNumber: mintBlock,
      timestamp: mintTimestamp,
      minter: minterAddress,
    },
    transfers,
    sales,
    currentOwner: finalOwner,
    creatorCandidates,
    sources: ['ON_CHAIN', 'OPENSEA'],
    confidence: mintTxHash ? 'VERIFIED' : 'SOURCE-BACKED',
  }
}
