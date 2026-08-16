export type Confidence =
  | 'verified'
  | 'source-backed'
  | 'inferred'
  | 'ai-interpretation'
  | 'unknown'

export type EvidenceType =
  | 'on-chain'
  | 'metadata'
  | 'project'
  | 'artwork'

export interface EvidenceItem {
  id: string
  claim: string
  type: EvidenceType
  confidence: Confidence
  source: string
  sourceHref?: string
  detail: string
}

export interface ProvenanceEvent {
  id: string
  event: string
  date: string
  wallet: string
  txHash: string
  confidence: Confidence
  note?: string
}

export interface ProjectContextItem {
  id: string
  label: string
  title: string
  body: string
  source: string
  sourceHref?: string
  confidence: Confidence
}

export interface Trait {
  label: string
  value: string
}

export interface NFT {
  id: string
  collection: string
  tokenId: string
  network: string
  standard: string
  contract: string
  contractShort: string
  creator: string
  creatorShort: string
  owner: string
  ownerShort: string
  minted: string
  mintTx: string
  image: string
  openseaUrl: string
  imageHash: string
  metadataHash: string
  tokenUri: string
  imageUri: string
  provenanceConfidence: number
  attested: boolean
  whyThisExists: string
  sourcesCount: number
  visualTraits: Trait[]
  metadataTraits: Trait[]
  evidence: EvidenceItem[]
  provenance: ProvenanceEvent[]
  projectContext: ProjectContextItem[]
  related: {
    tokenId: string
    collection: string
    image: string
    similarity: number
  }
  attestation?: {
    network: string
    txHash: string
    block: string
    attestor: string
    evidenceHash: string
    provenanceHash: string
    timestamp: string
    evidencePackage: string
  }
}

export const primaryNFT: NFT = {
  id: 'example-genesis-1837',
  collection: 'Example Genesis',
  tokenId: '#1837',
  network: 'Ethereum',
  standard: 'ERC-721',
  contract: '0x7A3F4C9d2B8E1a05C6f3D9E2b7A1c4F5e6D091C2',
  contractShort: '0x7A3F...91C2',
  creator: '0x3F82a1B4c5D6e7F8091a2B3c4D5e6F7089aC901',
  creatorShort: '0x3F82...C901',
  owner: '0x91B2c3D4e5F60718293a4B5c6D7e8F90a1bAA73',
  ownerShort: '0x91B2...AA73',
  minted: 'Jan 14, 2024',
  mintTx: '0x8A71b2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
  image: '/nft/example-genesis-1837.png',
  openseaUrl: 'https://opensea.io/item/ethereum/0x7a3f/1837',
  imageHash: '0x4F19...B7C2',
  metadataHash: '0xC2A8...19F3',
  tokenUri: 'ipfs://QmX7f9...genesis/1837.json',
  imageUri: 'ipfs://QmA2c8...genesis/1837.png',
  provenanceConfidence: 95,
  attested: false,
  sourcesCount: 5,
  whyThisExists:
    'This NFT belongs to Example Genesis, a digital identity collection created to explore how ownership and identity can be represented through programmable digital art. Token #1837 was minted directly by the project creator and has been continuously verifiable on-chain since January 2024. Its artwork encodes a generative identity portrait — a recurring motif across the collection — and the project’s public statements frame each piece as a study in self-sovereign identity.',
  visualTraits: [
    { label: 'Motif', value: 'Identity portrait' },
    { label: 'Palette', value: 'Lavender / violet' },
    { label: 'Composition', value: 'Node network' },
    { label: 'Generation', value: 'Genesis' },
  ],
  metadataTraits: [
    { label: 'Background', value: 'Soft cream' },
    { label: 'Structure', value: 'Interconnected' },
    { label: 'Rarity', value: 'Uncommon' },
    { label: 'Edition', value: '1 of 1' },
  ],
  evidence: [
    {
      id: 'ev-1',
      claim: 'NFT #1837 was minted by 0x3F82...C901.',
      type: 'on-chain',
      confidence: 'verified',
      source: 'Ethereum transaction',
      sourceHref: '#',
      detail:
        'The mint transaction 0x8A71...D921 records the creation of token #1837 from the zero address to the creator wallet, confirmed in block 19,021,442.',
    },
    {
      id: 'ev-2',
      claim: 'The collection contract is a standard ERC-721.',
      type: 'on-chain',
      confidence: 'verified',
      source: 'Contract bytecode',
      sourceHref: '#',
      detail:
        'The deployed contract implements the ERC-721 interface (supportsInterface 0x80ac58cd) and exposes tokenURI, ownerOf, and Transfer events.',
    },
    {
      id: 'ev-3',
      claim: 'Metadata resolves to a pinned IPFS document.',
      type: 'metadata',
      confidence: 'source-backed',
      source: 'IPFS token URI',
      sourceHref: '#',
      detail:
        'tokenURI(1837) resolves to ipfs://QmX7f9.../1837.json, which contains the name, description, image URI, and attribute set used across the collection.',
    },
    {
      id: 'ev-4',
      claim: 'Example Genesis was created to explore digital identity.',
      type: 'project',
      confidence: 'source-backed',
      source: 'Official project website',
      sourceHref: '#',
      detail:
        'The project’s public website and creator statement describe the collection as an exploration of self-sovereign identity through generative portraits.',
    },
    {
      id: 'ev-5',
      claim: 'Artwork is visually similar to NFT #72.',
      type: 'artwork',
      confidence: 'inferred',
      source: 'Artwork fingerprint analysis',
      detail:
        'Perceptual hashing places this artwork at 94% visual similarity to token #72 of the same collection. Similarity does not establish ownership or copyright.',
    },
  ],
  provenance: [
    {
      id: 'p-1',
      event: 'Contract deployed',
      date: 'Jan 10, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x2B4d...77A1',
      confidence: 'verified',
      note: 'Example Genesis collection contract created by the project creator.',
    },
    {
      id: 'p-2',
      event: 'Collection created',
      date: 'Jan 12, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x9C1e...05B4',
      confidence: 'verified',
      note: 'Metadata base URI configured and pinned to IPFS.',
    },
    {
      id: 'p-3',
      event: 'NFT minted',
      date: 'Jan 14, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x8A71...D921',
      confidence: 'verified',
      note: 'Token #1837 minted from the zero address to the creator wallet.',
    },
    {
      id: 'p-4',
      event: 'Transfer',
      date: 'Mar 02, 2024',
      wallet: '0xE4a9...12C7',
      txHash: '0x5D6f...88E2',
      confidence: 'verified',
      note: 'First secondary transfer to a collector wallet.',
    },
    {
      id: 'p-5',
      event: 'Transfer',
      date: 'Jul 21, 2024',
      wallet: '0x91B2...AA73',
      txHash: '0x1A2b...C3d4',
      confidence: 'verified',
      note: 'Transferred to the current owner.',
    },
    {
      id: 'p-6',
      event: 'Current owner',
      date: 'Present',
      wallet: '0x91B2...AA73',
      txHash: '—',
      confidence: 'verified',
      note: 'Held by 0x91B2...AA73.',
    },
  ],
  projectContext: [
    {
      id: 'c-1',
      label: 'Creator',
      title: 'An independent generative artist',
      body: 'The creator wallet 0x3F82...C901 has deployed and self-minted the entire Genesis collection, with a consistent on-chain history since 2023.',
      source: 'On-chain deployment history',
      confidence: 'verified',
    },
    {
      id: 'c-2',
      label: 'Collection',
      title: 'Example Genesis',
      body: 'A curated set of generative identity portraits. Each token encodes a distinct node-network composition rendered from the same underlying algorithm.',
      source: 'Official project website',
      sourceHref: '#',
      confidence: 'source-backed',
    },
    {
      id: 'c-3',
      label: 'Purpose',
      title: 'Exploring self-sovereign identity',
      body: 'The project frames ownership of a Genesis token as owning a programmable representation of digital identity.',
      source: 'Creator statement',
      sourceHref: '#',
      confidence: 'source-backed',
    },
    {
      id: 'c-4',
      label: 'Artistic context',
      title: 'Generative portraiture',
      body: 'The visual language draws on data-portraiture — identities rendered as living networks of nodes and connections rather than faces.',
      source: 'Artwork analysis',
      confidence: 'ai-interpretation',
    },
  ],
  related: {
    tokenId: '#72',
    collection: 'Example Genesis',
    image: '/nft/related-72.png',
    similarity: 94,
  },
}

export interface HistoryEntry {
  id: string
  collection: string
  tokenId: string
  network: string
  image: string
  analyzedOn: string
  confidence: number
  attested: boolean
}

export const historyEntries: HistoryEntry[] = [
  {
    id: 'example-genesis-1837',
    collection: 'Example Genesis',
    tokenId: '#1837',
    network: 'Ethereum',
    image: '/nft/example-genesis-1837.png',
    analyzedOn: 'Aug 16, 2026',
    confidence: 95,
    attested: true,
  },
  {
    id: 'example-collection-721',
    collection: 'Example Collection',
    tokenId: '#721',
    network: 'Ethereum',
    image: '/nft/example-collection-721.png',
    analyzedOn: 'Aug 12, 2026',
    confidence: 87,
    attested: false,
  },
  {
    id: 'example-genesis-72',
    collection: 'Example Genesis',
    tokenId: '#72',
    network: 'Ethereum',
    image: '/nft/related-72.png',
    analyzedOn: 'Aug 04, 2026',
    confidence: 91,
    attested: false,
  },
]

export const analysisSteps = [
  'NFT identified',
  'Metadata retrieved',
  'Reconstructing provenance',
  'Analyzing artwork',
  'Researching project context',
  'Collecting evidence',
  'Generating explanation',
]

export const attestedExample = {
  network: 'Monad Testnet',
  txHash: '0xABC3d4E5f60718293a4B5c6D7e8F90a1b2C3d123',
  block: '#182734',
  attestor: '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F',
  evidenceHash: '0x8A72c4D9e1F3b5079283a4b5C6d7e8F90a1bF91',
  provenanceHash: '0x19BC2d4E5f6071829304a5B6c7D8e9F0a1bcA21',
  timestamp: 'Aug 16, 2026',
  evidencePackage: 'ipfs://QmEv1dence7Package9Hash2For8Genesis1837',
}
