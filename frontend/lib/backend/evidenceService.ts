import { keccak256, stringToHex } from 'viem'
import type { ContextClaim, ContextSource } from './contextService'

export interface EvidenceSource {
  id: string
  type: string
  title: string
  url: string
  sourceClass: 'ON_CHAIN' | 'OPENSEA' | 'COLLECTION' | 'PROJECT' | 'INFERRED'
  confidence: 'VERIFIED' | 'SOURCE-BACKED' | 'INFERRED' | 'UNKNOWN'
}

export interface EvidencePackage {
  schemaVersion: number
  identity: {
    chainId: number
    contractAddress: string
    tokenId: string
  }
  metadataEvidence: {
    name: string
    description: string
    image: string
    metadataUri: string
    tokenStandard: string
  }
  collectionEvidence: {
    name: string
    slug: string
    description: string
    image: string
    externalUrl: string
  }
  provenanceEvidence: {
    mintTx: string | null
    mintBlock: number | null
    mintMinter: string | null
    transferCount: number
    saleCount: number
  }
  creatorEvidence: {
    creator: string
    candidates: any[]
  }
  ownershipEvidence: {
    owner: string
  }
  sources: EvidenceSource[]
  contextClaims?: ContextClaim[]
  contextSources?: ContextSource[]
  explanationClaims?: any[]
}

/**
 * Calculates MetaMuse Evidence Confidence score (0 to 100).
 * Based on updated weight parameters:
 * - On-chain contract validation: 25
 * - Metadata: 20
 * - Mint: 20
 * - Transfers: 15
 * - Collection context: 10
 * - Creator evidence: 5
 * - Official source: 5
 */
export function calculateConfidence(
  hasOnChainCode: boolean,
  hasMetadata: boolean,
  hasMint: boolean,
  hasTransfers: boolean,
  hasCollectionContext: boolean,
  hasCreatorEvidence: boolean,
  hasOfficialSource: boolean
): number {
  let score = 0

  if (hasOnChainCode) score += 25
  if (hasMetadata) score += 20
  if (hasMint) score += 20
  if (hasTransfers) score += 15
  if (hasCollectionContext) score += 10
  if (hasCreatorEvidence) score += 5
  if (hasOfficialSource) score += 5

  return score
}

/**
 * Generates the citation-annotated deterministic explanation text.
 */
export function generateExplanation(
  collectionName: string,
  contractAddress: string,
  tokenId: string,
  minter: string | null,
  transferCount: number,
  ownerAddress: string
): string {
  const shortContract = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
  const shortMinter = minter ? `${minter.slice(0, 6)}...${minter.slice(-4)}` : 'Unknown minter'
  const shortOwner = `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`

  return `This NFT belongs to the ${collectionName} collection.[1] On-chain verification confirms it exists on Ethereum at contract ${shortContract} under token ID ${tokenId}.[2] Reconstructed transaction history reveals the token was initially minted by ${shortMinter} [2] and has since been transferred ${transferCount} times to its current owner ${shortOwner}.[2]`
}

/**
 * Deterministically serializes the evidence package.
 * Sorts sources, claims, and other arrays to ensure identical hashing regardless of runtime ordering.
 */
export function canonicalizeEvidence(evidence: EvidencePackage): string {
  const sortedSources = [...evidence.sources].sort((a, b) => a.id.localeCompare(b.id))
  
  const sortedContextClaims = evidence.contextClaims 
    ? [...evidence.contextClaims].sort((a, b) => a.id.localeCompare(b.id))
    : []
    
  const sortedContextSources = evidence.contextSources
    ? [...evidence.contextSources].sort((a, b) => a.id.localeCompare(b.id))
    : []
  
  const canonicalObj = {
    schemaVersion: evidence.schemaVersion,
    nftContract: evidence.identity.contractAddress.toLowerCase(),
    tokenId: evidence.identity.tokenId.toString(),
    collection: evidence.collectionEvidence.name,
    metadataUri: evidence.metadataEvidence.metadataUri,
    imageUri: evidence.metadataEvidence.image,
    creator: evidence.creatorEvidence.creator,
    evidenceItems: sortedSources.map((s) => ({
      id: s.id,
      type: s.type,
      title: s.title,
      url: s.url,
    })),
    contextClaims: sortedContextClaims.map((c) => ({
      id: c.id,
      text: c.text,
      type: c.type,
      sourceIds: [...c.sourceIds].sort(),
      confidence: c.confidence,
    })),
    contextSources: sortedContextSources.map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      sourceType: s.sourceType,
      publisher: s.publisher,
      confidence: s.confidence,
    }))
  }
  
  return JSON.stringify(canonicalObj)
}

/**
 * Deterministically serializes the provenance tracking records.
 */
export function canonicalizeProvenance(provenance: any): string {
  const sortedTransfers = [...provenance.transfers].sort((a, b) => a.timestamp - b.timestamp)
  
  const canonicalObj = {
    schemaVersion: 1,
    nftContract: provenance.identity.contractAddress.toLowerCase(),
    tokenId: provenance.identity.tokenId.toString(),
    mintTransaction: provenance.mint.transactionHash || '',
    minter: provenance.mint.minter || '',
    transfers: sortedTransfers.map((t: any) => ({
      from: t.from.toLowerCase(),
      to: t.to.toLowerCase(),
      txHash: t.transactionHash,
    })),
  }
  
  return JSON.stringify(canonicalObj)
}

/**
 * Hashes the canonicalized evidence package.
 */
export function generateEvidenceHash(evidence: EvidencePackage): `0x${string}` {
  const str = canonicalizeEvidence(evidence)
  return keccak256(stringToHex(str))
}

/**
 * Hashes the canonicalized provenance record.
 */
export function generateProvenanceHash(provenance: any): `0x${string}` {
  const str = canonicalizeProvenance(provenance)
  return keccak256(stringToHex(str))
}
