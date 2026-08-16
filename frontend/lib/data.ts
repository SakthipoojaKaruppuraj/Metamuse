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

// ----------------------------------------------------
// PRESET A: Demo Genesis #1837
// High confidence, Attested, Verification MATCH
// ----------------------------------------------------
export const genesisNFT: NFT = {
  id: 'example-genesis-1837',
  collection: 'MetaMuse Demo Genesis',
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
  openseaUrl: 'https://opensea.io/assets/ethereum/0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2/1837',
  imageHash: '0x4F19163e757a3fC829aB9e2b17A3C4F5E6d091F3',
  metadataHash: '0xC2A8A2f1B78a1c902d3e5F607198C29f8E4c92A1',
  tokenUri: 'ipfs://QmX7f9...genesis/1837.json',
  imageUri: 'ipfs://QmA2c8...genesis/1837.png',
  provenanceConfidence: 95,
  attested: true,
  sourcesCount: 5,
  whyThisExists:
    'This NFT belongs to the MetaMuse Demo Genesis collection, a digital identity set created to explore representations of self-sovereign identity through generative network art. Token #1837 was minted directly by the verified project creator and has been continuously trackable on-chain since January 2024. The artwork encodes an interconnected nodes motif which aligns with the collection\'s theme, and public statements confirm the creator\'s origin and purpose.',
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
      sourceHref: 'https://etherscan.io/tx/0x8A71b2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
      detail:
        'The mint transaction 0x8A71...D921 records the creation of token #1837 from the zero address to the creator wallet, confirmed in block 19,021,442.',
    },
    {
      id: 'ev-2',
      claim: 'The collection contract is a standard ERC-721.',
      type: 'on-chain',
      confidence: 'verified',
      source: 'Contract bytecode',
      sourceHref: 'https://etherscan.io/address/0x7A3F4C9d2B8E1a05C6f3D9E2b7A1c4F5e6D091C2',
      detail:
        'The deployed contract implements the ERC-721 interface (supportsInterface 0x80ac58cd) and exposes tokenURI, ownerOf, and Transfer events.',
    },
    {
      id: 'ev-3',
      claim: 'Metadata resolves to a pinned IPFS document.',
      type: 'metadata',
      confidence: 'source-backed',
      source: 'IPFS token URI',
      sourceHref: 'https://ipfs.io/ipfs/QmX7f9',
      detail:
        'tokenURI(1837) resolves to ipfs://QmX7f9.../1837.json, which contains the name, description, image URI, and attribute set used across the collection.',
    },
    {
      id: 'ev-4',
      claim: 'MetaMuse Genesis was created to explore digital identity.',
      type: 'project',
      confidence: 'source-backed',
      source: 'Official project website',
      sourceHref: 'https://metamuse.xyz',
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
        'Perceptual hashing places this artwork at 94% visual similarity to token #72 of the same collection. Similarity is inferred by the analysis engine and does not establish copyright.',
    },
  ],
  provenance: [
    {
      id: 'p-1',
      event: 'Contract deployed',
      date: 'Jan 10, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x2B4d8A72a2757279fC8291C2eA64a2757279fC82',
      confidence: 'verified',
      note: 'Example Genesis collection contract created by the project creator.',
    },
    {
      id: 'p-2',
      event: 'Collection created',
      date: 'Jan 12, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x9C1e72A757279fC8291C2eA64a2757279fC829B4',
      confidence: 'verified',
      note: 'Metadata base URI configured and pinned to IPFS.',
    },
    {
      id: 'p-3',
      event: 'NFT minted',
      date: 'Jan 14, 2024',
      wallet: '0x3F82...C901',
      txHash: '0x8A71b2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
      confidence: 'verified',
      note: 'Token #1837 minted from the zero address to the creator wallet.',
    },
    {
      id: 'p-4',
      event: 'Transfer',
      date: 'Mar 02, 2024',
      wallet: '0xE4a91A2bC3d4e5f60718293a4B5c6D7e8F90a12C',
      txHash: '0x5D6fB2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
      confidence: 'verified',
      note: 'First secondary transfer to a collector wallet.',
    },
    {
      id: 'p-5',
      event: 'Transfer',
      date: 'Jul 21, 2024',
      wallet: '0x91B2c3D4e5F60718293a4B5c6D7e8F90a1bAA73',
      txHash: '0x1A2bC3d4e5f60718293a4B5c6D7e8F90a1bAA7379',
      confidence: 'verified',
      note: 'Transferred to the current owner.',
    },
    {
      id: 'p-6',
      event: 'Current owner',
      date: 'Present',
      wallet: '0x91B2c3D4e5F60718293a4B5c6D7e8F90a1bAA73',
      txHash: '—',
      confidence: 'verified',
      note: 'Held by collector wallet.',
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
      title: 'MetaMuse Demo Genesis',
      body: 'A curated set of generative identity portraits. Each token encodes a distinct node-network composition rendered from the same underlying algorithm.',
      source: 'Official project website',
      sourceHref: 'https://metamuse.xyz',
      confidence: 'source-backed',
    },
    {
      id: 'c-3',
      label: 'Purpose',
      title: 'Exploring self-sovereign identity',
      body: 'The project frames ownership of a Genesis token as owning a programmable representation of digital identity.',
      source: 'Creator statement',
      sourceHref: 'https://metamuse.xyz/statement',
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
    collection: 'MetaMuse Demo Genesis',
    image: '/nft/related-72.png',
    similarity: 94,
  },
  attestation: {
    network: 'Monad Testnet',
    txHash: '0xABC3d4E5f60718293a4B5c6D7e8F90a1b2C3d123',
    block: '182734',
    attestor: '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F',
    evidenceHash: '0x8A72c4D9e1F3b5079283a4b5C6d7e8F90a1bF91',
    provenanceHash: '0x19BC2d4E5f6071829304a5B6c7D8e9F0a1bcA21',
    timestamp: 'Aug 16, 2026',
    evidencePackage: 'ipfs://QmEv1dence7Package9Hash2For8Genesis1837',
  }
}

// ----------------------------------------------------
// PRESET B: Lost Artifact #721
// Low confidence, Not Attested
// ----------------------------------------------------
export const artifactNFT: NFT = {
  id: 'example-collection-721',
  collection: 'Lost Artifact Demo',
  tokenId: '#721',
  network: 'Ethereum',
  standard: 'ERC-721',
  contract: '0x8c7B4a2757279fC8291C2eA64a2757279fc829A2',
  contractShort: '0x8c7B...29A2',
  creator: '0x0000000000000000000000000000000000000000',
  creatorShort: '0x0000...0000',
  owner: '0x7b5F82a1B4c5D6e7F8091a2B3c4D5e6F7089aC90',
  ownerShort: '0x7b5F...aC90',
  minted: 'Oct 04, 2024',
  mintTx: '0x992B2c3D4e5F60718293a4B5c6D7e8F90a1bAA73',
  image: '/nft/example-collection-721.png',
  openseaUrl: 'https://opensea.io/assets/ethereum/0x8c7b4a2757279fc8291c2ea64a2757279fc829a2/721',
  imageHash: '0x7F2C91F3...B921',
  metadataHash: '0x1A2B3C4D...FF00',
  tokenUri: 'https://centralized-server.com/metadata/721',
  imageUri: 'https://centralized-server.com/images/721.jpg',
  provenanceConfidence: 52,
  attested: false,
  sourcesCount: 3,
  whyThisExists:
    'This NFT belongs to the Lost Artifact Demo collection, representing items with low provenance confidence. The contract was initialized with an anonymous or missing deployment signature (creator address resolves to zero). The metadata is stored on a centralized server rather than IPFS or Arweave, meaning it can be modified at any time by the host. There are no public social records or creator statements to back its artistic purpose.',
  visualTraits: [
    { label: 'Style', value: 'Anonymous scan' },
    { label: 'Format', value: 'JPEG' },
    { label: 'Palette', value: 'Greyscale' },
  ],
  metadataTraits: [
    { label: 'Host', value: 'Centralized API' },
    { label: 'Mutable', value: 'Yes (Unanchored)' },
  ],
  evidence: [
    {
      id: 'ev-1',
      claim: 'Contract was deployed by an unverified anonymous account.',
      type: 'on-chain',
      confidence: 'unknown',
      source: 'Bytecode deployment logs',
      detail:
        'The deployment transaction logs lack typical constructor variables or owner signatures, leaving deployer identity anonymous.',
    },
    {
      id: 'ev-2',
      claim: 'Token metadata is hosted on a private domain.',
      type: 'metadata',
      confidence: 'inferred',
      source: 'HTTP Metadata URI',
      detail:
        'The token resolves to a standard centralized web server. If the server goes offline or files are edited, the asset metadata changes.',
    },
    {
      id: 'ev-3',
      claim: 'No associated artistic website or social handle found.',
      type: 'project',
      confidence: 'unknown',
      source: 'Social directory check',
      detail:
        'Auditing public registers, Twitter accounts, and Discord servers reveals no valid references linking the contract to any known artist.',
    },
  ],
  provenance: [
    {
      id: 'p-1',
      event: 'Contract deployed',
      date: 'Sep 29, 2024',
      wallet: '0x0000...0000',
      txHash: '0x992B2c3D4e5F60718293a4B5c6D7e8F90a1bAA73',
      confidence: 'unknown',
      note: 'Registry initialized without owner claims.',
    },
    {
      id: 'p-2',
      event: 'NFT minted',
      date: 'Oct 04, 2024',
      wallet: '0x7b5F...aC90',
      txHash: '0x1122a2757279fC8291C2eA64a2757279fC829F91',
      confidence: 'inferred',
      note: 'Token minted via generic multicall routing.',
    },
    {
      id: 'p-3',
      event: 'Current custodian',
      date: 'Present',
      wallet: '0x7b5F...aC90',
      txHash: '—',
      confidence: 'unknown',
      note: 'Held by 0x7b5F...aC90.',
    },
  ],
  projectContext: [
    {
      id: 'c-1',
      label: 'Deployer',
      title: 'Anonymous creator',
      body: 'No historical deployment or transaction trace exists to link this wallet with other known projects or collections.',
      source: 'On-chain deployment logs',
      confidence: 'unknown',
    },
    {
      id: 'c-2',
      label: 'Collection',
      title: 'Lost Artifacts',
      body: 'A contract containing items without defined metadata hashes. It behaves as a generic template deployment.',
      source: 'Contract audit',
      confidence: 'inferred',
    },
  ],
  related: {
    tokenId: '#102',
    collection: 'Lost Artifact Demo',
    image: '/nft/related-72.png',
    similarity: 42,
  }
}

// ----------------------------------------------------
// PRESET C: Divergent Art #44
// Moderate confidence, Attested, Verification MISMATCH
// ----------------------------------------------------
export const divergentNFT: NFT = {
  id: 'example-divergent-44',
  collection: 'MetaMuse Divergent Art',
  tokenId: '#44',
  network: 'Ethereum',
  standard: 'ERC-721',
  contract: '0x5F60789aC9012a64A27579fC8291C2791F9a79BC',
  contractShort: '0x5F60...79BC',
  creator: '0x1C2eA64a2757279fC8291C2eA64a2757279fC829',
  creatorShort: '0x1C2e...FC82',
  owner: '0xE4a91A2bC3d4e5f60718293a4B5c6D7e8F90a12C',
  ownerShort: '0xE4a9...12C',
  minted: 'Feb 18, 2025',
  mintTx: '0x7B5c6D7e8F90a1bD9217a82fF8eA85F2C9012a64',
  image: '/nft/related-72.png', // reusing existing asset
  openseaUrl: 'https://opensea.io/assets/ethereum/0x5f60789ac9012a64a27579fc8291c2791f9a79bc/44',
  imageHash: '0x19BCbC8eA85F2C9012a64A27579fC8291C2791F9a', // Current Hash
  metadataHash: '0x8A72a2757279fC8291C2eA64a2757279fC829F91',
  tokenUri: 'ipfs://QmY48a...divergent/44.json',
  imageUri: 'ipfs://QmZ98c...divergent/44.png',
  provenanceConfidence: 78,
  attested: true,
  sourcesCount: 4,
  whyThisExists:
    'This NFT belongs to the MetaMuse Divergent Art collection. It represents a state where the metadata has changed since the Monad attestation was recorded. The current calculated evidence fingerprint differs from the original attested fingerprint, triggering a verification MISMATCH. This suggests that the image URI or token characteristics were modified by the creator after the initial audit took place.',
  visualTraits: [
    { label: 'Pattern', value: 'Divergent waves' },
    { label: 'Hue', value: 'Indigo / cyan' },
  ],
  metadataTraits: [
    { label: 'Rarity', value: 'Rare' },
    { label: 'Mutable', value: 'Yes (IPFS altered)' },
  ],
  evidence: [
    {
      id: 'ev-1',
      claim: 'Token was minted by creator 0x1C2e...FC82.',
      type: 'on-chain',
      confidence: 'verified',
      source: 'Etherscan logs',
      detail:
        'On-chain mint logged in block 21,342,001, verifying that the token was generated by the original deployment address.',
    },
    {
      id: 'ev-2',
      claim: 'Current image URI points to a different CID.',
      type: 'metadata',
      confidence: 'inferred',
      source: 'Dynamic IPFS check',
      detail:
        'The current IPFS image hash is 0x19BC...91F9a, which differs from the hash recorded in the original Monad Testnet attestation.',
    },
  ],
  provenance: [
    {
      id: 'p-1',
      event: 'Contract deployed',
      date: 'Feb 10, 2025',
      wallet: '0x1C2e...FC82',
      txHash: '0x7B5c6D7e8F90a1bD9217a82fF8eA85F2C9012a64',
      confidence: 'verified',
      note: 'Divergent Art collection registry deployed.',
    },
    {
      id: 'p-2',
      event: 'NFT minted',
      date: 'Feb 18, 2025',
      wallet: '0x1C2e...FC82',
      txHash: '0x3344b2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
      confidence: 'verified',
      note: 'Token #44 minted by creator.',
    },
  ],
  projectContext: [
    {
      id: 'c-1',
      label: 'Artistic Concept',
      title: 'Mutable generative art',
      body: 'Divergent Art claims to dynamically evolve over time, which explains why the metadata image pointer has been updated.',
      source: 'Official statement',
      confidence: 'source-backed',
    },
  ],
  related: {
    tokenId: '#1837',
    collection: 'MetaMuse Demo Genesis',
    image: '/nft/example-genesis-1837.png',
    similarity: 76,
  },
  attestation: {
    network: 'Monad Testnet',
    txHash: '0x99BCbC8eA85F2C9012a64A27579fC8291C2791F9a79',
    block: '194723',
    attestor: '0x1C2eA64a2757279fC8291C2eA64a2757279fC829',
    evidenceHash: '0xABC72a2757279fC8291C2eA64a2757279fC829F44', // Attested Hash differs from current
    provenanceHash: '0x3344b2C3d4E5f60718293a4B5c6D7e8F90a1bD921',
    timestamp: 'Feb 20, 2025',
    evidencePackage: 'ipfs://QmEv1denceDivergentPackageHash44',
  }
}

export const mockNFTs: Record<string, NFT> = {
  'example-genesis-1837': genesisNFT,
  'example-collection-721': artifactNFT,
  'example-divergent-44': divergentNFT,
}

export const historyEntries: HistoryEntry[] = [
  {
    id: 'example-genesis-1837',
    collection: 'MetaMuse Demo Genesis',
    tokenId: '#1837',
    network: 'Ethereum',
    image: '/nft/example-genesis-1837.png',
    analyzedOn: 'Aug 16, 2026',
    confidence: 95,
    attested: true,
  },
  {
    id: 'example-collection-721',
    collection: 'Lost Artifact Demo',
    tokenId: '#721',
    network: 'Ethereum',
    image: '/nft/example-collection-721.png',
    analyzedOn: 'Aug 12, 2026',
    confidence: 52,
    attested: false,
  },
  {
    id: 'example-divergent-44',
    collection: 'MetaMuse Divergent Art',
    tokenId: '#44',
    network: 'Ethereum',
    image: '/nft/related-72.png',
    analyzedOn: 'Feb 20, 2025',
    confidence: 78,
    attested: true,
  },
]

export const analysisSteps = [
  'Parsing OpenSea URL',
  'Fetching NFT metadata',
  'Validating Ethereum identity',
  'Resolving token metadata',
  'Reconstructing provenance',
  'Collecting evidence',
  'Calculating confidence',
  'Preparing explanation',
]

export const primaryNFT = genesisNFT

export const attestedExample = {
  network: 'Monad Testnet',
  txHash: '0xABC3d4E5f60718293a4B5c6D7e8F90a1b2C3d123',
  block: '182734',
  attestor: '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F',
  evidenceHash: '0x8A72c4D9e1F3b5079283a4b5C6d7e8F90a1bF91',
  provenanceHash: '0x19BC2d4E5f6071829304a5B6c7D8e9F0a1bcA21',
  timestamp: 'Aug 16, 2026',
  evidencePackage: 'ipfs://QmEv1dence7Package9Hash2For8Genesis1837',
}


