import { keccak256, stringToHex } from 'viem'
import type { NFT } from './data'

/**
 * This is a temporary frontend demo commitment. The canonical MetaMuse 
 * evidence/provenance hashing protocol will be defined by the backend 
 * protocol and must remain backward-compatible or versioned.
 */

export function canonicalizeDemoEvidence(nft: NFT): string {
  // Deterministic order of keys for the evidence commitment
  const evidenceObj = {
    version: 1,
    nftContract: nft.contract.toLowerCase(),
    tokenId: nft.tokenId,
    collection: nft.collection,
    metadataUri: nft.tokenUri || '',
    imageUri: nft.imageUri || '',
    creator: nft.creator.toLowerCase(),
    evidence: nft.evidence.map((e) => ({
      id: e.id,
      claim: e.claim,
      type: e.type,
      confidence: e.confidence,
      source: e.source,
      detail: e.detail,
    })),
  }
  return JSON.stringify(evidenceObj)
}

export function canonicalizeDemoProvenance(nft: NFT): string {
  // Deterministic order of keys for the provenance commitment
  const provenanceObj = {
    version: 1,
    nftContract: nft.contract.toLowerCase(),
    tokenId: nft.tokenId,
    creator: nft.creator.toLowerCase(),
    mintTransaction: nft.mintTx || '',
    provenanceEvents: nft.provenance.map((p) => ({
      id: p.id,
      event: p.event,
      date: p.date,
      wallet: p.wallet,
      txHash: p.txHash,
      confidence: p.confidence,
      note: p.note || '',
    })),
  }
  return JSON.stringify(provenanceObj)
}

export function generateDemoCommitments(nft: NFT): {
  evidenceHash: `0x${string}`
  provenanceHash: `0x${string}`
} {
  const evidenceStr = canonicalizeDemoEvidence(nft)
  const provenanceStr = canonicalizeDemoProvenance(nft)

  return {
    evidenceHash: keccak256(stringToHex(evidenceStr)),
    provenanceHash: keccak256(stringToHex(provenanceStr)),
  }
}
