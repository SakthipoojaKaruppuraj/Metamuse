import type { NFTAsset } from './openseaService'
import type { ProvenanceRecord } from './provenanceService'
import type { ContextPackage } from './contextService'
import type { EvidencePackage } from './evidenceService'

export interface ExplanationPackage {
  summary: string
  whyItExists: string
  verifiedFacts: string[]
  sourceBackedInterpretations: string[]
  inferredInterpretations: string[]
  unknowns: string[]
}

/**
 * Builds the deterministic fallback explanation based on structured evidence when AI is unavailable.
 */
export function buildDeterministicFallback(
  nft: NFTAsset,
  provenance: ProvenanceRecord,
  context: ContextPackage
): ExplanationPackage {
  const collectionName = nft.collection.name
  const contract = nft.identity.contractAddress
  const shortContract = `${contract.slice(0, 6)}...${contract.slice(-4)}`
  const tokenId = nft.identity.tokenId
  
  const minter = provenance.mint.minter
  const shortMinter = minter ? `${minter.slice(0, 6)}...${minter.slice(-4)}` : 'an unknown minter'
  const owner = provenance.currentOwner
  const shortOwner = `${owner.slice(0, 6)}...${owner.slice(-4)}`
  
  const desc = nft.collection.description
  const purposeText = desc
    ? `described as "${desc}"`
    : `centered around generative blockchain assets`

  const transferCount = provenance.transfers.filter(t => t.type === 'TRANSFER').length
  
  // Deterministic summary and explanation text
  const summary = `MetaMuse analyzed the provenance and context of ${nft.name} from the ${collectionName} collection.`
  
  const whyItExists = `This NFT is part of the ${collectionName} collection, ${purposeText}.[1] On-chain verification confirms it exists on Ethereum at contract ${shortContract} under token ID ${tokenId}.[2] Reconstructed transaction history reveals the token was initially minted by ${shortMinter} [2] and has since been transferred ${transferCount} times to its current owner ${shortOwner}.[2]`

  const verifiedFacts = [
    `Contract address is verified on Ethereum: ${contract} [2]`,
    `Token ID is verified: ${tokenId} [2]`,
    `Current token owner resolves to: ${owner} [2]`,
    `Token mint event detected in block ${provenance.mint.blockNumber || 'unknown'} [2]`
  ]

  const sourceBackedInterpretations = [
    `The collection is officially registered as part of the '${collectionName}' project [1]`,
    nft.collection.description ? `Collection purpose is defined: "${nft.collection.description}" [1]` : 'No project purpose description was registered on OpenSea [1]'
  ]

  const inferredInterpretations: string[] = []
  if (nft.traits.length > 0) {
    inferredInterpretations.push(
      `Visual elements and metadata declare traits: ${nft.traits.map(t => `${t.trait_type}=${t.value}`).join(', ')} [1]`
    )
  } else {
    inferredInterpretations.push('No visual traits are declared in the metadata [1]')
  }
  inferredInterpretations.push('Visual styling is inferred to belong to the verified project collection [1]')

  const unknowns = [
    'The physical identity of the contract deployer could not be verified.',
    'No explicit artist statement or symbolic meaning is registered in metadata.'
  ]

  return {
    summary,
    whyItExists,
    verifiedFacts,
    sourceBackedInterpretations,
    inferredInterpretations,
    unknowns
  }
}

/**
 * Creates human-readable explanations using the Google Gemini API,
 * with automatic fallback to deterministic generation on key absence or API errors.
 */
export async function generateExplanation(
  nft: NFTAsset,
  provenance: ProvenanceRecord,
  context: ContextPackage,
  evidence: EvidencePackage
): Promise<ExplanationPackage> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey || apiKey.startsWith('your_') || apiKey.trim() === '') {
    console.log('GEMINI_API_KEY is not configured or placeholder detected. Using deterministic fallback explanation...')
    return buildDeterministicFallback(nft, provenance, context)
  }

  // Compile prompt context
  const contextPrompt = {
    nftName: nft.name,
    nftDescription: nft.description,
    collectionName: nft.collection.name,
    collectionDescription: nft.collection.description,
    traits: nft.traits,
    owner: provenance.currentOwner,
    minter: provenance.mint.minter,
    mintBlock: provenance.mint.blockNumber,
    mintTx: provenance.mint.transactionHash,
    transferCount: provenance.transfers.length,
    claims: context.claims.map(c => ({ id: c.id, text: c.text, confidence: c.confidence })),
    sources: context.sources.map(s => ({ id: s.id, title: s.title, url: s.url }))
  }

  const prompt = `
You are an evidence-based NFT explanation engine for MetaMuse. Your task is to explain "WHY DOES THIS NFT EXIST?"
You MUST use ONLY the supplied facts, context claims, and sources. Do not invent artist intentions, cultural meanings, or other facts.
If information is missing, return UNKNOWN. Do not guess.

Input Data:
${JSON.stringify(contextPrompt, null, 2)}

Instructions:
1. "summary": Provide a 1-sentence summary of the NFT analysis.
2. "whyItExists": A short paragraph explaining why this NFT exists (what collection it belongs to, its purpose, artistic concept, and a mention of its verified provenance). You MUST include citation numbers like [1] or [2] mapping to the sources (e.g. S1 -> [1], S2 -> [2]). Keep it clean.
3. "verifiedFacts": List of strictly verified blockchain facts (mint block, contract address, owner, transfer log count).
4. "sourceBackedInterpretations": List of statements backed by metadata or registry sources (collection purpose, creator name).
5. "inferredInterpretations": List of inferences (visual styling suggestions based on traits, artwork context).
6. "unknowns": List of explicit things that could not be verified (creator's real name, background symbolic intent).

You MUST return a single valid JSON object matching this schema. Do not output markdown code blocks (like \`\`\`json) outside of the raw response. Return only the JSON object.
Schema:
{
  "summary": "string",
  "whyItExists": "string",
  "verifiedFacts": ["string"],
  "sourceBackedInterpretations": ["string"],
  "inferredInterpretations": ["string"],
  "unknowns": ["string"]
}
`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`)
    }

    const data = await response.json()
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!textResponse) {
      throw new Error('Gemini API returned an empty candidate list')
    }

    const explanation = JSON.parse(textResponse.trim()) as ExplanationPackage
    
    // Quick validation of the JSON structure
    if (
      typeof explanation.summary === 'string' &&
      typeof explanation.whyItExists === 'string' &&
      Array.isArray(explanation.verifiedFacts) &&
      Array.isArray(explanation.sourceBackedInterpretations) &&
      Array.isArray(explanation.inferredInterpretations) &&
      Array.isArray(explanation.unknowns)
    ) {
      return explanation
    }

    throw new Error('JSON schema validation failed')
  } catch (err) {
    console.warn('Gemini API call failed, immediately falling back to deterministic explanation:', err)
    return buildDeterministicFallback(nft, provenance, context)
  }
}
