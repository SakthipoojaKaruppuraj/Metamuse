import test from 'node:test'
import assert from 'node:assert'
import { parseOpenSeaUrl } from '../lib/backend/urlParser'
import { serverCache } from '../lib/backend/cache'
import {
  calculateConfidence,
  generateExplanation,
  canonicalizeEvidence,
  canonicalizeProvenance,
  generateEvidenceHash,
  generateProvenanceHash,
  type EvidencePackage
} from '../lib/backend/evidenceService'

test('URL Parser Tests', async (t) => {
  await t.test('should parse valid OpenSea Ethereum URLs', () => {
    const url = 'https://opensea.io/assets/ethereum/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/1'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, true)
    assert.ok(result.data)
    assert.strictEqual(result.data.chain, 'ethereum')
    assert.strictEqual(result.data.contractAddress, '0x06012c8cf97bead5deae237070f9587f8e7a266d')
    assert.strictEqual(result.data.tokenId, '1')
  })

  await t.test('should parse valid OpenSea Ethereum URLs with www prefix', () => {
    const url = 'https://www.opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/12345'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, true)
    assert.ok(result.data)
    assert.strictEqual(result.data.chain, 'ethereum')
    assert.strictEqual(result.data.contractAddress, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d')
    assert.strictEqual(result.data.tokenId, '12345')
  })

  await t.test('should reject invalid protocols', () => {
    const url = 'http://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/12345'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, false)
    assert.strictEqual(result.error, 'INVALID_OPENSEA_URL')
  })

  await t.test('should reject unsupported chains', () => {
    const url = 'https://opensea.io/assets/polygon/0x7c8155909cd3759a27276503f501e718b5de6b29/1'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, false)
    assert.strictEqual(result.error, 'UNSUPPORTED_CHAIN')
  })

  await t.test('should reject invalid contract addresses', () => {
    const url = 'https://opensea.io/assets/ethereum/0xinvalidaddress/1'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, false)
    assert.strictEqual(result.error, 'INVALID_CONTRACT')
  })

  await t.test('should reject invalid token IDs', () => {
    const url = 'https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/abc'
    const result = parseOpenSeaUrl(url)
    assert.strictEqual(result.isValid, false)
    assert.strictEqual(result.error, 'INVALID_TOKEN_ID')
  })
})

test('Memory Cache Tests', async (t) => {
  await t.test('should set and get values', () => {
    serverCache.set('test-key', { value: 123 })
    assert.strictEqual(serverCache.has('test-key'), true)
    const val = serverCache.get('test-key')
    assert.deepStrictEqual(val, { value: 123 })
  })

  await t.test('should clear values', () => {
    serverCache.set('test-key-2', 456)
    serverCache.clear()
    assert.strictEqual(serverCache.has('test-key'), false)
    assert.strictEqual(serverCache.has('test-key-2'), false)
    assert.strictEqual(serverCache.get('test-key-2'), null)
  })
})

test('Evidence Service Tests', async (t) => {
  await t.test('should calculate confidence scores correctly', () => {
    // Max score is 100
    const maxScore = calculateConfidence(true, true, true, true, true, true)
    assert.strictEqual(maxScore, 100)

    // Score with only code and metadata (25 + 20 = 45)
    const basicScore = calculateConfidence(true, true, false, false, false, false)
    assert.strictEqual(basicScore, 45)

    // Score with no indicators (0)
    const zeroScore = calculateConfidence(false, false, false, false, false, false)
    assert.strictEqual(zeroScore, 0)
  })

  await t.test('should generate expected explanations', () => {
    const explanation = generateExplanation(
      'Lil Pudgys',
      '0x524cab2ec29190c5946f21136c40a7a1b5f23348',
      '123',
      '0x121c42443b663afad01caedf842284c7ef4c79b4',
      5,
      '0xc89255e2d634cb36a7cf73b5e4070beffef26574'
    )
    assert.ok(explanation.includes('Lil Pudgys'))
    assert.ok(explanation.includes('0x524c...3348'))
    assert.ok(explanation.includes('0x121c...79b4'))
    assert.ok(explanation.includes('0xc892...6574'))
    assert.ok(explanation.includes('transferred 5 times'))
  })

  const dummyEvidence: EvidencePackage = {
    schemaVersion: 1,
    identity: {
      chainId: 1,
      contractAddress: '0x524Cab2ec29190c5946f21136c40a7a1B5f23348',
      tokenId: '123',
    },
    metadataEvidence: {
      name: 'Lil Pudgy #123',
      description: 'Cute little penguin',
      image: 'ipfs://QmX123',
      metadataUri: 'ipfs://QmMeta123',
      tokenStandard: 'ERC-721',
    },
    collectionEvidence: {
      name: 'Lil Pudgys',
      slug: 'lilpudgys',
      description: 'Lil Pudgys collection description',
      image: 'https://opensea.io/lilpudgys.png',
      externalUrl: 'https://pudgypenguins.com',
    },
    provenanceEvidence: {
      mintTx: '0xminttxhash',
      mintBlock: 123456,
      mintMinter: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      transferCount: 5,
      saleCount: 2,
    },
    creatorEvidence: {
      creator: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      candidates: [],
    },
    ownershipEvidence: {
      owner: '0xc89255e2d634cb36a7cf73b5e4070beffef26574',
    },
    sources: [
      {
        id: 'E2',
        type: 'ON_CHAIN',
        title: 'EVM Contract Code Registry',
        url: 'https://etherscan.io/address/0x524cab2ec29190c5946f21136c40a7a1b5f23348',
        sourceClass: 'ON_CHAIN',
        confidence: 'VERIFIED',
      },
      {
        id: 'E1',
        type: 'COLLECTION',
        title: 'OpenSea Collection Info',
        url: 'https://opensea.io/assets/ethereum/0x524cab2ec29190c5946f21136c40a7a1b5f23348/123',
        sourceClass: 'OPENSEA',
        confidence: 'SOURCE-BACKED',
      },
    ],
  }

  await t.test('should canonicalize evidence deterministically', () => {
    const canonical1 = canonicalizeEvidence(dummyEvidence)
    
    // Change source order in original array to verify sorting
    const shuffledEvidence = {
      ...dummyEvidence,
      sources: [dummyEvidence.sources[1], dummyEvidence.sources[0]]
    }
    const canonical2 = canonicalizeEvidence(shuffledEvidence)
    
    assert.strictEqual(canonical1, canonical2)
    assert.ok(canonical1.includes('"nftContract":"0x524cab2ec29190c5946f21136c40a7a1b5f23348"')) // contract should be lowercase
  })

  await t.test('should canonicalize provenance deterministically', () => {
    const dummyProvenance = {
      identity: {
        contractAddress: '0x524Cab2ec29190c5946f21136c40a7a1B5f23348',
        tokenId: '123',
      },
      mint: {
        transactionHash: '0xminttxhash',
        minter: '0x121c42443b663afad01caedf842284c7ef4c79b4',
      },
      transfers: [
        { from: '0x121c42443B663aFad01CAeDF842284c7eF4C79b4', to: '0xc89255e2d634cb36a7cf73b5e4070beffef26574', transactionHash: '0xtx1', timestamp: 1000 },
        { from: '0x0000000000000000000000000000000000000000', to: '0x121c42443B663aFad01CAeDF842284c7eF4C79b4', transactionHash: '0xminttxhash', timestamp: 500 },
      ]
    }
    
    const canonical = canonicalizeProvenance(dummyProvenance)
    const parsed = JSON.parse(canonical)
    
    // Transfers should be sorted by timestamp
    assert.strictEqual(parsed.transfers[0].from, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(parsed.transfers[1].from, '0x121c42443b663afad01caedf842284c7ef4c79b4')
  })

  await t.test('should generate valid keccak256 hashes', () => {
    const evHash = generateEvidenceHash(dummyEvidence)
    assert.ok(evHash.startsWith('0x'))
    assert.strictEqual(evHash.length, 66) // 0x + 64 hex characters
  })
})
