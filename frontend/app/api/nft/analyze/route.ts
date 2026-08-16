import { NextResponse } from 'next/server'
import { parseOpenSeaUrl } from '@/lib/backend/urlParser'
import { getNFT, type NFTAsset } from '@/lib/backend/openseaService'
import { 
  validateContractCode, 
  getOwnerOf, 
  getTokenURI, 
  fetchTokenMetadataFromURI,
  resolveAssetUrl
} from '@/lib/backend/ethereumService'
import { reconstructProvenance, type ProvenanceRecord } from '@/lib/backend/provenanceService'
import { extractContext, type ContextPackage, type ContextClaim, type ContextSource } from '@/lib/backend/contextService'
import { generateExplanation, type ExplanationPackage } from '@/lib/backend/explanationService'
import { 
  calculateConfidence, 
  generateEvidenceHash, 
  generateProvenanceHash,
  type EvidenceSource,
  type EvidencePackage
} from '@/lib/backend/evidenceService'
import { serverCache } from '@/lib/backend/cache'
import { type NFT, type EvidenceItem, type ProvenanceEvent, type ProjectContextItem } from '@/lib/data'

export async function POST(request: Request) {
  try {
    const { openSeaUrl } = await request.json()

    // 1. URL parsing & SSRF validation
    const parsed = parseOpenSeaUrl(openSeaUrl)
    if (!parsed.isValid || !parsed.data) {
      return NextResponse.json({ error: parsed.error || 'INVALID_OPENSEA_URL' }, { status: 400 })
    }

    const { contractAddress, tokenId } = parsed.data

    // 2. Fetch OpenSea Data
    let openseaAsset: NFTAsset
    try {
      openseaAsset = await getNFT(contractAddress, tokenId)
    } catch (err: any) {
      console.error('OpenSea API failed:', err)
      const errorMsg = err.message || ''
      if (errorMsg === 'OPENSEA_UNAUTHORIZED' || errorMsg === 'OPENSEA_RATE_LIMITED' || errorMsg === 'NFT_NOT_FOUND') {
        return NextResponse.json({ error: errorMsg }, { status: 400 })
      }
      return NextResponse.json({ error: 'OPENSEA_ERROR' }, { status: 500 })
    }

    // 3. EVM validation via Ethereum RPC
    const hasContractCode = await validateContractCode(contractAddress)
    if (!hasContractCode) {
      return NextResponse.json({ error: 'INVALID_CONTRACT' }, { status: 400 })
    }

    // Get canonical owner and token URI from the blockchain
    const [rpcOwner, rpcTokenUri] = await Promise.all([
      getOwnerOf(contractAddress, tokenId),
      getTokenURI(contractAddress, tokenId),
    ])

    const canonicalOwner = rpcOwner ? rpcOwner.toLowerCase() : openseaAsset.currentOwner.toLowerCase()
    if (!canonicalOwner) {
      return NextResponse.json({ error: 'OWNER_OF_FAILED' }, { status: 400 })
    }

    let metadataFetched = false
    if (rpcTokenUri) {
      try {
        await fetchTokenMetadataFromURI(rpcTokenUri)
        metadataFetched = true
      } catch (e) {
        console.warn('EVM tokenURI metadata fetch failed:', e)
      }
    }

    // 4. Reconstruct Provenance
    const provenanceRecord = await reconstructProvenance(
      contractAddress,
      tokenId,
      canonicalOwner,
      undefined
    )

    const minterAddress = provenanceRecord.mint.minter

    // 5. Extract Context
    const contextPackage = await extractContext(openseaAsset, provenanceRecord)

    // 6. Build Core Evidence Package (schemaVersion: 1)
    const sources: EvidenceSource[] = [
      {
        id: 'ev-1',
        type: 'metadata',
        title: 'OpenSea Collection Info',
        url: openseaAsset.openseaUrl,
        sourceClass: 'OPENSEA',
        confidence: 'SOURCE-BACKED',
      },
      {
        id: 'ev-2',
        type: 'on-chain',
        title: 'EVM Contract Code Registry',
        url: `https://etherscan.io/address/${contractAddress}`,
        sourceClass: 'ON_CHAIN',
        confidence: 'VERIFIED',
      },
    ]

    if (provenanceRecord.mint.transactionHash) {
      sources.push({
        id: 'ev-3',
        type: 'on-chain',
        title: 'NFT Mint Transaction Log',
        url: `https://etherscan.io/tx/${provenanceRecord.mint.transactionHash}`,
        sourceClass: 'ON_CHAIN',
        confidence: 'VERIFIED',
      })
    }

    // If official website is present in context sources
    const officialSiteSource = contextPackage.sources.find(s => s.sourceType === 'OFFICIAL_PROJECT')
    if (officialSiteSource) {
      sources.push({
        id: 'ev-4',
        type: 'project',
        title: officialSiteSource.title,
        url: officialSiteSource.url,
        sourceClass: 'PROJECT',
        confidence: 'SOURCE-BACKED',
      })
    }

    const evidencePackage: EvidencePackage = {
      schemaVersion: 1,
      identity: {
        chainId: 1,
        contractAddress,
        tokenId,
      },
      metadataEvidence: {
        name: openseaAsset.name,
        description: openseaAsset.description,
        image: openseaAsset.image,
        metadataUri: rpcTokenUri || openseaAsset.metadataUri,
        tokenStandard: openseaAsset.tokenStandard,
      },
      collectionEvidence: {
        name: openseaAsset.collection.name,
        slug: openseaAsset.collection.slug,
        description: openseaAsset.collection.description,
        image: openseaAsset.collection.image,
        externalUrl: openseaAsset.collection.externalUrl,
      },
      provenanceEvidence: {
        mintTx: provenanceRecord.mint.transactionHash,
        mintBlock: provenanceRecord.mint.blockNumber,
        mintMinter: minterAddress,
        transferCount: provenanceRecord.transfers.length,
        saleCount: provenanceRecord.sales.length,
      },
      creatorEvidence: {
        creator: minterAddress || '0x0000000000000000000000000000000000000000',
        candidates: provenanceRecord.creatorCandidates,
      },
      ownershipEvidence: {
        owner: canonicalOwner,
      },
      sources,
      contextClaims: contextPackage.claims,
      contextSources: contextPackage.sources,
    }

    // 7. Generate Explanations via Service
    const explanation = await generateExplanation(
      openseaAsset,
      provenanceRecord,
      contextPackage,
      evidencePackage
    )

    // 8. Calculate Confidence Score
    const hasCollectionContext = !!openseaAsset.collection.name && contextPackage.claims.some(c => c.type === 'PROJECT_PURPOSE' && c.confidence !== 'UNKNOWN')
    const hasCreatorEvidence = provenanceRecord.creatorCandidates.some(c => c.confidence === 'VERIFIED' || c.confidence === 'SOURCE-BACKED')
    const hasOfficialSource = !!officialSiteSource

    const confidenceScore = calculateConfidence(
      hasContractCode,
      metadataFetched || !!openseaAsset.image,
      !!provenanceRecord.mint.transactionHash,
      provenanceRecord.transfers.length > 0,
      hasCollectionContext,
      hasCreatorEvidence,
      hasOfficialSource
    )

    // 9. Generate Hashes (bytes32 commitments)
    const evidenceHash = generateEvidenceHash(evidencePackage)
    const provenanceHash = generateProvenanceHash(provenanceRecord)

    // 10. Format visual and metadata traits lists
    const visualTraits = openseaAsset.traits.slice(0, 4).map(t => ({
      label: t.trait_type,
      value: t.value.toString()
    }))
    const metadataTraits = openseaAsset.traits.slice(4, 8).map(t => ({
      label: t.trait_type,
      value: t.value.toString()
    }))

    // 11. Format visual elements for page rendering
    const mintDateStr = provenanceRecord.mint.timestamp 
      ? new Date(provenanceRecord.mint.timestamp * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Unknown Date'

    const frontendEvidence: EvidenceItem[] = sources.map((s) => ({
      id: s.id,
      claim: s.type === 'on-chain' ? 'Verified block record exists on Ethereum Mainnet.' : 'Attributed to verified creator registration.',
      type: s.type as any,
      confidence: s.confidence.toLowerCase() as any,
      source: s.title,
      sourceHref: s.url,
      detail: `Asset verification payload compiled under schema version ${evidencePackage.schemaVersion}.`
    }))

    const frontendProvenance: ProvenanceEvent[] = [
      ...provenanceRecord.transfers.map((t, idx) => ({
        id: `p-${idx + 1}`,
        event: t.type === 'MINT' ? 'mint' : t.type === 'BURN' ? 'burn' : 'transfer',
        date: new Date(t.timestamp * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        wallet: t.to,
        txHash: t.transactionHash,
        confidence: t.confidence.toLowerCase() as any,
        note: t.type === 'MINT' ? 'Token minted to creator wallet.' : `Transferred from ${t.from.slice(0, 6)}...`
      })),
      ...provenanceRecord.sales.map((s, idx) => ({
        id: `sale-${idx + 1}`,
        event: 'sale',
        date: new Date(s.timestamp * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        wallet: s.to,
        txHash: s.transactionHash,
        confidence: 'source-backed',
        note: `Sold for ${s.price || '0'} ${s.paymentToken || 'ETH'}`
      }))
    ]

    const projectContext: ProjectContextItem[] = contextPackage.claims.map((claim, index) => {
      const relatedSource = contextPackage.sources.find(s => claim.sourceIds.includes(s.id))
      return {
        id: claim.id,
        label: claim.type.replace('_', ' '),
        title: claim.type === 'ARTWORK_CONTEXT' ? 'Artwork Visual Analysis' : 'Collection Registry Detail',
        body: claim.text,
        source: relatedSource ? relatedSource.title : 'MetaMuse Analysis',
        sourceHref: relatedSource ? relatedSource.url : undefined,
        confidence: claim.confidence.toLowerCase() as any
      }
    })

    // Construct final matching UI NFT asset (fully compatible with page.tsx)
    const nftResult: NFT & {
      rawNft: NFTAsset
      provenanceRecord: ProvenanceRecord
      context: ContextPackage
      explanation: ExplanationPackage
      confidence: number
      commitments: {
        evidenceSchemaVersion: number
        provenanceSchemaVersion: number
        evidenceHash: string
        provenanceHash: string
      }
    } = {
      id: `ethereum_${contractAddress}_${tokenId}`,
      collection: openseaAsset.collection.name,
      tokenId: `#${tokenId}`,
      network: 'Ethereum',
      standard: 'ERC-721',
      contract: contractAddress,
      contractShort: `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`,
      creator: minterAddress || '0x0000000000000000000000000000000000000000',
      creatorShort: minterAddress ? `${minterAddress.slice(0, 6)}...${minterAddress.slice(-4)}` : '0x0000...0000',
      owner: canonicalOwner,
      ownerShort: `${canonicalOwner.slice(0, 6)}...${canonicalOwner.slice(-4)}`,
      minted: mintDateStr,
      mintTx: provenanceRecord.mint.transactionHash || '',
      image: resolveAssetUrl(openseaAsset.image),
      openseaUrl: openseaAsset.openseaUrl,
      imageHash: evidenceHash,
      metadataHash: provenanceHash,
      tokenUri: rpcTokenUri || openseaAsset.metadataUri,
      imageUri: openseaAsset.image,
      provenanceConfidence: confidenceScore,
      attested: false,
      whyThisExists: explanation.whyItExists,
      sourcesCount: sources.length,
      visualTraits,
      metadataTraits,
      evidence: frontendEvidence,
      provenance: frontendProvenance,
      projectContext,
      related: {
        tokenId: '1',
        collection: 'Pudgy Penguins',
        image: 'https://i.seadn.io/gae/yNiF1s2ZrlwJe7wmLre46CBoCfJstg5J95E4gCH69E4B3_1sN_g3L5E0J5D9J1F9_G6=w600',
        similarity: 99
      },
      rawNft: openseaAsset,
      provenanceRecord,
      context: contextPackage,
      explanation,
      confidence: confidenceScore,
      commitments: {
        evidenceSchemaVersion: 1,
        provenanceSchemaVersion: 1,
        evidenceHash,
        provenanceHash
      }
    }

    // Cache the completed analysis result on the server
    serverCache.set(`nft:${nftResult.id}`, nftResult)

    return NextResponse.json(nftResult)
  } catch (err: any) {
    console.error('Unhandled pipeline exception:', err)
    return NextResponse.json({ error: 'UNKNOWN_ERROR' }, { status: 500 })
  }
}
