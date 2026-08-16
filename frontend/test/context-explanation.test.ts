import test from 'node:test'
import assert from 'node:assert'
import { extractContext } from '../lib/backend/contextService'
import { generateExplanation, buildDeterministicFallback } from '../lib/backend/explanationService'
import { 
  calculateConfidence, 
  canonicalizeEvidence, 
  generateEvidenceHash, 
  generateProvenanceHash,
  type EvidencePackage
} from '../lib/backend/evidenceService'
import type { NFTAsset } from '../lib/backend/openseaService'
import type { ProvenanceRecord } from '../lib/backend/provenanceService'

const mockNftAsset: NFTAsset = {
  identity: {
    chainId: 1,
    contractAddress: '0x524cab2ec69124574082676e6f654a18df49a048',
    tokenId: '1',
  },
  name: 'Lil Pudgy #1',
  description: 'A cute lil pudgy penguin.',
  image: 'https://i.seadn.io/gae/lilpudgy1.png',
  metadataUri: 'ipfs://QmLilPudgy1',
  collection: {
    name: 'Lil Pudgys',
    slug: 'lilpudgys',
    description: 'Lil Pudgys are a collection of 22,222 cute penguin NFTs.',
    image: 'https://opensea.io/lilpudgys.png',
    externalUrl: 'https://pudgypenguins.com',
  },
  traits: [
    { trait_type: 'Background', value: 'Blue' },
    { trait_type: 'Body', value: 'Penguin' },
  ],
  tokenStandard: 'ERC721',
  currentOwner: '0xc89255e2d634cb36a7cf73b5e4070beffef26574',
  sources: { opensea: 'https://opensea.io' },
  openseaUrl: 'https://opensea.io/assets/ethereum/0x524cab2ec69124574082676e6f654a18df49a048/1',
}

const mockProvenanceRecord: ProvenanceRecord = {
  identity: {
    chainId: 1,
    contractAddress: '0x524cab2ec69124574082676e6f654a18df49a048',
    tokenId: '1',
  },
  contractDeployment: {
    deployer: '0x121c42443b663afad01caedf842284c7ef4c79b4',
    blockNumber: 13837900,
    timestamp: 1639000000,
  },
  mint: {
    transactionHash: '0x891234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    blockNumber: 13837943,
    timestamp: 1639000100,
    minter: '0x121c42443b663afad01caedf842284c7ef4c79b4',
  },
  transfers: [
    {
      type: 'MINT',
      from: '0x0000000000000000000000000000000000000000',
      to: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      transactionHash: '0x891234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      blockNumber: 13837943,
      timestamp: 1639000100,
      source: 'ON_CHAIN',
      confidence: 'VERIFIED',
    },
    {
      type: 'TRANSFER',
      from: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      to: '0xc89255e2d634cb36a7cf73b5e4070beffef26574',
      transactionHash: '0xtransferhash123',
      blockNumber: 14000000,
      timestamp: 1640000000,
      source: 'ON_CHAIN',
      confidence: 'VERIFIED',
    },
  ],
  sales: [],
  currentOwner: '0xc89255e2d634cb36a7cf73b5e4070beffef26574',
  creatorCandidates: [
    {
      address: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      role: 'MINT_RECIPIENT',
      evidence: 'Token minter in transaction 0x89...',
      confidence: 'VERIFIED',
    },
  ],
  sources: ['ON_CHAIN', 'OPENSEA'],
  confidence: 'VERIFIED',
}

test('Phase 6: Context Research Service Tests', async (t) => {
  await t.test('should extract context claims and sources from NFT metadata', async () => {
    const context = await extractContext(mockNftAsset, mockProvenanceRecord)
    
    assert.ok(context.sources.length >= 2, 'Should contain at least OpenSea and EVM sources')
    assert.ok(context.claims.length >= 4, 'Should contain claims for collection, purpose, creator, and artwork')
    
    const collectionClaim = context.claims.find(c => c.type === 'COLLECTION_CONTEXT')
    assert.ok(collectionClaim)
    assert.ok(collectionClaim.text.includes('Lil Pudgys'))
    
    const purposeClaim = context.claims.find(c => c.type === 'PROJECT_PURPOSE')
    assert.ok(purposeClaim)
    assert.ok(purposeClaim.text.includes('22,222 cute penguin NFTs'))
  })

  await t.test('should handle missing collection description gracefully', async () => {
    const assetNoDesc = {
      ...mockNftAsset,
      collection: { ...mockNftAsset.collection, description: '' },
    }
    const context = await extractContext(assetNoDesc, mockProvenanceRecord)
    const purposeClaim = context.claims.find(c => c.type === 'PROJECT_PURPOSE')
    assert.ok(purposeClaim)
    assert.strictEqual(purposeClaim.confidence, 'UNKNOWN')
  })
})

test('Phase 6: Confidence Calculation Tests', async (t) => {
  await t.test('should calculate max confidence of 100 when all features pass', () => {
    const maxScore = calculateConfidence(true, true, true, true, true, true, true)
    assert.strictEqual(maxScore, 100)
  })

  await t.test('should calculate partial confidence score correctly', () => {
    // 25 (Code) + 20 (Metadata) + 20 (Mint) = 65
    const partialScore = calculateConfidence(true, true, true, false, false, false, false)
    assert.strictEqual(partialScore, 65)
  })
})

test('Phase 6: Explanation Service & Deterministic Fallback Tests', async (t) => {
  await t.test('should generate a valid deterministic fallback explanation', () => {
    const context = {
      claims: [
        {
          id: 'C1',
          text: "The NFT belongs to the collection 'Lil Pudgys'.",
          type: 'COLLECTION_CONTEXT' as const,
          sourceIds: ['S1'],
          confidence: 'SOURCE-BACKED' as const,
        },
      ],
      sources: [
        {
          id: 'S1',
          title: 'OpenSea NFT & Collection Metadata',
          url: mockNftAsset.openseaUrl,
          sourceType: 'OPENSEA' as const,
          publisher: 'OpenSea',
          confidence: 'SOURCE-BACKED' as const,
        },
      ],
    }

    const explanation = buildDeterministicFallback(mockNftAsset, mockProvenanceRecord, context)
    
    assert.ok(explanation.summary.includes('Lil Pudgys'))
    assert.ok(explanation.whyItExists.includes('Lil Pudgys'))
    assert.ok(explanation.whyItExists.includes('[1]')) // Citation check
    assert.ok(explanation.verifiedFacts.length > 0)
    assert.ok(explanation.sourceBackedInterpretations.length > 0)
    assert.ok(explanation.inferredInterpretations.length > 0)
    assert.ok(explanation.unknowns.length > 0)
  })

  await t.test('should fallback to deterministic explanation if AI API key is missing', async () => {
    // Save original env
    const origKey = process.env.GEMINI_API_KEY
    delete process.env.GEMINI_API_KEY
    
    const context = await extractContext(mockNftAsset, mockProvenanceRecord)
    const dummyEvidence: EvidencePackage = {
      schemaVersion: 1,
      identity: { chainId: 1, contractAddress: mockNftAsset.identity.contractAddress, tokenId: '1' },
      metadataEvidence: { name: mockNftAsset.name, description: mockNftAsset.description, image: mockNftAsset.image, metadataUri: mockNftAsset.metadataUri, tokenStandard: mockNftAsset.tokenStandard },
      collectionEvidence: { name: mockNftAsset.collection.name, slug: mockNftAsset.collection.slug, description: mockNftAsset.collection.description, image: mockNftAsset.collection.image, externalUrl: mockNftAsset.collection.externalUrl },
      provenanceEvidence: { mintTx: mockProvenanceRecord.mint.transactionHash, mintBlock: mockProvenanceRecord.mint.blockNumber, mintMinter: mockProvenanceRecord.mint.minter, transferCount: 2, saleCount: 0 },
      creatorEvidence: { creator: mockProvenanceRecord.mint.minter!, candidates: [] },
      ownershipEvidence: { owner: mockProvenanceRecord.currentOwner },
      sources: [],
    }

    const explanation = await generateExplanation(mockNftAsset, mockProvenanceRecord, context, dummyEvidence)
    assert.ok(explanation.summary.length > 0)
    assert.ok(explanation.whyItExists.length > 0)

    // Restore env
    if (origKey) process.env.GEMINI_API_KEY = origKey
  })
})

test('Phase 6: Hash Stability & AI Prose Independence', async (t) => {
  const baseEvidence: EvidencePackage = {
    schemaVersion: 1,
    identity: {
      chainId: 1,
      contractAddress: '0x524cab2ec69124574082676e6f654a18df49a048',
      tokenId: '1',
    },
    metadataEvidence: {
      name: 'Lil Pudgy #1',
      description: 'Penguin',
      image: 'https://seadn.io/1.png',
      metadataUri: 'ipfs://Qm1',
      tokenStandard: 'ERC-721',
    },
    collectionEvidence: {
      name: 'Lil Pudgys',
      slug: 'lilpudgys',
      description: 'Cute penguins',
      image: 'https://seadn.io/col.png',
      externalUrl: 'https://pudgypenguins.com',
    },
    provenanceEvidence: {
      mintTx: '0xmint123',
      mintBlock: 100,
      mintMinter: '0xminter',
      transferCount: 1,
      saleCount: 0,
    },
    creatorEvidence: {
      creator: '0xminter',
      candidates: [],
    },
    ownershipEvidence: {
      owner: '0xowner',
    },
    sources: [
      {
        id: 'ev-1',
        type: 'metadata',
        title: 'OpenSea Collection Info',
        url: 'https://opensea.io/assets/1',
        sourceClass: 'OPENSEA',
        confidence: 'SOURCE-BACKED',
      },
    ],
    contextClaims: [
      {
        id: 'C1',
        text: "The NFT belongs to 'Lil Pudgys'.",
        type: 'COLLECTION_CONTEXT',
        sourceIds: ['ev-1'],
        confidence: 'SOURCE-BACKED',
      },
    ],
    contextSources: [
      {
        id: 'S1',
        title: 'OpenSea Metadata',
        url: 'https://opensea.io/assets/1',
        sourceType: 'OPENSEA',
        publisher: 'OpenSea',
        confidence: 'SOURCE-BACKED',
      },
    ],
  }

  await t.test('should produce identical evidenceHash for identical structured evidence', () => {
    const hash1 = generateEvidenceHash(baseEvidence)
    const hash2 = generateEvidenceHash({ ...baseEvidence })
    assert.strictEqual(hash1, hash2, 'Evidence hash must be deterministic and stable')
  })

  await t.test('should produce different evidenceHash when structured claims change', () => {
    const hash1 = generateEvidenceHash(baseEvidence)
    const modifiedEvidence: EvidencePackage = {
      ...baseEvidence,
      contextClaims: [
        {
          id: 'C1',
          text: "The NFT belongs to 'MODIFIED COLLECTION NAME'.",
          type: 'COLLECTION_CONTEXT',
          sourceIds: ['ev-1'],
          confidence: 'SOURCE-BACKED',
        },
      ],
    }
    const hash2 = generateEvidenceHash(modifiedEvidence)
    assert.notStrictEqual(hash1, hash2, 'Evidence hash must change when structured claims change')
  })

  await t.test('should produce stable provenanceHash for provenance records', () => {
    const hash1 = generateProvenanceHash(mockProvenanceRecord)
    const hash2 = generateProvenanceHash({ ...mockProvenanceRecord })
    assert.strictEqual(hash1, hash2, 'Provenance hash must be deterministic')
  })
})
