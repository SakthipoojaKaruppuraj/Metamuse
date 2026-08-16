// Fictional Mock Presets for MetaMuse Frontend Testing
// These collections are clearly fictional and labeled as demo data.

export const MOCK_NFTS = {
  // Preset A: High Confidence, Attested, Verified Match
  "genesis-1837": {
    id: "genesis-1837",
    name: "MetaMuse Demo Genesis #1837",
    collectionName: "MetaMuse Demo Genesis",
    tokenId: "1837",
    contractAddress: "0x7A3F2d79F9C0143891C2eA64a2757279fC8291C2",
    network: "Ethereum",
    tokenStandard: "ERC-721",
    creatorAddress: "0x3F82fD8eA85F2C9012a64A27579fC8291C2D902a",
    currentOwner: "0x91B2fA71A279Fc8291C2eA64a2757279fC8291C2",
    mintTx: "0x8A71dD23c902A21C2eA64a2757279fC8291C2D921",
    mintDate: "Jan 14, 2024",
    artworkUrl: "https://picsum.photos/id/1025/600/600",
    tokenUri: "ipfs://QmYwAPJzv5CZ1iaaedst2QO1mjc7Y6avg1z2kW8YKzk5b7/1837",
    metadataUri: "https://ipfs.io/ipfs/QmYwAPJzv5CZ1iaaedst2QO1mjc7Y6avg1z2kW8YKzk5b7/1837",
    imageHash: "0x3F822757279fC8291C2eA64a2757279fC829F1837",
    metadataHash: "0x55B12757279fC8291C2eA64a2757279fC829F1837",
    openseaUrl: "https://opensea.io/assets/ethereum/0x7A3F2d79F9C0143891C2eA64a2757279fC8291C2/1837",
    
    explanation: "This NFT belongs to MetaMuse Demo Genesis, a digital identity collection created to explore how ownership and identity can be represented through programmable digital art.[1] The collection was conceptualized as a study in cryptographic provenance, connecting abstract geometry to individual creator wallets.[2] The artwork represents structural alignment, using a custom vector layout to symbolize data pathways.[4]",
    
    confidence: {
      score: 95,
      breakdown: [
        { label: "On-chain evidence", status: "Strong", score: "verified" },
        { label: "Metadata completeness", status: "Strong", score: "verified" },
        { label: "Creator validation", status: "Strong", score: "verified" },
        { label: "Project context", status: "Source-backed", score: "source-backed" },
        { label: "Artwork relationship", status: "Inferred", score: "inferred" }
      ]
    },

    evidence: [
      {
        id: "1",
        type: "project",
        title: "MetaMuse Demo Genesis Website",
        excerpt: "Official project statement: 'The collection explores digital identity, provenance, and decentralized artistic signatures through vector geometries.'",
        url: "https://genesis.metamuse.demo",
        confidence: "SOURCE-BACKED",
        description: "Official portal describing project goals and verifying contract addresses."
      },
      {
        id: "2",
        type: "on-chain",
        title: "Creator Wallet Cryptographic Signature",
        excerpt: "Creator wallet 0x3F82...902a signed a cryptographic declaration linking this contract to their identity.",
        url: "https://etherscan.io/address/0x3F82fD8eA85F2C9012a64A27579fC8291C2D902a",
        confidence: "VERIFIED",
        description: "Signed message verified against creator's public key."
      },
      {
        id: "3",
        type: "on-chain",
        title: "Ethereum Mint Transaction",
        excerpt: "Mint transaction confirms token creation on-chain by the creator wallet on block #1827341.",
        url: "https://etherscan.io/tx/0x8A71dD23c902A21C2eA64a2757279fC8291C2D921",
        confidence: "VERIFIED",
        description: "On-chain block registration confirming transaction origin."
      },
      {
        id: "4",
        type: "metadata",
        title: "Metadata IPFS Freeze",
        excerpt: "Token URI is pinned permanently on IPFS. The metadata contents match the original collection index hash.",
        url: "ipfs://QmYwAPJzv5CZ1iaaedst2QO1mjc7Y6avg1z2kW8YKzk5b7",
        confidence: "VERIFIED",
        description: "Tamper-proof metadata format with verified content checksums."
      },
      {
        id: "5",
        type: "artwork",
        title: "Artwork Fingerprint & Sim Scan",
        excerpt: "Vector hashing scanner reports a 98% visual consistency with the collection style guidelines.",
        url: "https://metamuse.demo/fingerprint/genesis-1837",
        confidence: "INFERRED",
        description: "Mathematical image scan looking for common pixel clusters and noise gradients."
      }
    ],

    provenanceEvents: [
      { event: "Contract Deployed", date: "Jan 12, 2024", wallet: "0x3F82fD8eA85F2C9012a64A27579fC8291C2D902a", tx: "0x7F21dD23c902A21C2eA64a2757279fC8291C2D9123", status: "VERIFIED" },
      { event: "Collection Created", date: "Jan 13, 2024", wallet: "0x3F82fD8eA85F2C9012a64A27579fC8291C2D902a", tx: "0x8B32dD23c902A21C2eA64a2757279fC8291C2D9567", status: "VERIFIED" },
      { event: "NFT Minted", date: "Jan 14, 2024", wallet: "0x3F82fD8eA85F2C9012a64A27579fC8291C2D902a", tx: "0x8A71dD23c902A21C2eA64a2757279fC8291C2D921", status: "VERIFIED" },
      { event: "Token Transferred", date: "Mar 10, 2024", wallet: "0x91B2fA71A279Fc8291C2eA64a2757279fC8291C2", tx: "0x99A2dD23c902A21C2eA64a2757279fC8291C2D9012", status: "VERIFIED" }
    ],

    attestation: {
      status: "attested", // "attested" | "not-attested"
      txHash: "0x19BCbC8eA85F2C9012a64A27579fC8291C2A214a",
      blockNumber: 182734,
      timestamp: "Aug 16, 2026",
      attestor: "0x91B2fA71A279Fc8291C2eA64a2757279fC8291C2",
      evidenceHash: "0x8A72a2757279fC8291C2eA64a2757279fC829F91",
      provenanceHash: "0x19BCbC8eA85F2C9012a64A27579fC8291C2A214a79",
      verification: {
        status: "match", // "match" | "mismatch"
        currentHash: "0x8A72a2757279fC8291C2eA64a2757279fC829F91",
        attestedHash: "0x8A72a2757279fC8291C2eA64a2757279fC829F91"
      }
    },
    
    artworkContext: {
      traits: [
        { name: "Symmetry", value: "Bilateral", type: "Visual" },
        { name: "Nodes", value: "12 Pathlines", type: "Visual" },
        { name: "Colorway", value: "Monochrome Violet", type: "Metadata" }
      ],
      similarity: {
        nftName: "MetaMuse Demo Genesis #72",
        score: "94%",
        status: "INFERRED",
        artworkUrl: "https://picsum.photos/id/1024/600/600",
        disclaimer: "Similarity does not establish ownership or copyright."
      }
    },

    projectContext: {
      creatorName: "Decentralized Muse Labs",
      description: "An open studio experimenting with semantic NFT architectures. The project aims to anchor creator narratives onto digital assets permanently.",
      purpose: "Artistic Provenance Proof-of-Concept",
      historicalContext: "Designed during the early testing phases of high-speed Layer-1 pipelines like Monad, exploring on-chain identity markers."
    }
  },

  // Preset B: Low Confidence, Not Attested
  "lost-artifact-721": {
    id: "lost-artifact-721",
    name: "MetaMuse Lost Artifact #721",
    collectionName: "MetaMuse Lost Artifact",
    tokenId: "721",
    contractAddress: "0x3F91A279Fc8291C2eA64a2757279fC8291C2792B",
    network: "Ethereum",
    tokenStandard: "ERC-721",
    creatorAddress: "0x883AbC8eA85F2C9012a64A27579fC8291C2791C2",
    currentOwner: "0x2B92fD8eA85F2C9012a64A27579fC8291C2D902b",
    mintTx: "0x55B1dD23c902A21C2eA64a2757279fC8291C2D904",
    mintDate: "Nov 03, 2022",
    artworkUrl: "https://picsum.photos/id/1062/600/600",
    tokenUri: "https://lost-artifact.demo/api/721",
    metadataUri: "https://lost-artifact.demo/api/721",
    imageHash: "0x98A82757279fC8291C2eA64a2757279fC829F721",
    metadataHash: "0x123F2757279fC8291C2eA64a2757279fC829F721",
    openseaUrl: "https://opensea.io/assets/ethereum/0x3F91A279Fc8291C2eA64a2757279fC8291C2792B/721",
    
    explanation: "This NFT belongs to MetaMuse Lost Artifact, an experimental collection created by an anonymous wallet.[1] While the contract exists on-chain, the creator's social channels and official website are no longer active, suggesting an abandoned or historical hobby project.[2] The artwork visual characteristics suggest relationships to earlier 2021 generative art experiments.[3]",
    
    confidence: {
      score: 62,
      breakdown: [
        { label: "On-chain evidence", status: "Moderate", score: "inferred" },
        { label: "Metadata completeness", status: "Weak", score: "unknown" },
        { label: "Creator validation", status: "Weak", score: "unknown" },
        { label: "Project context", status: "Unknown", score: "unknown" },
        { label: "Artwork relationship", status: "Inferred", score: "inferred" }
      ]
    },

    evidence: [
      {
        id: "1",
        type: "on-chain",
        title: "Ethereum Mint Record",
        excerpt: "Token was minted by 0x883A...91C2, but no creator profile is associated on public registries.",
        url: "https://etherscan.io/tx/0x55B1dD23c902A21C2eA64a2757279fC8291C2D904",
        confidence: "VERIFIED",
        description: "On-chain contract event confirm. Valid origin wallet, but anonymous owner."
      },
      {
        id: "2",
        type: "project",
        title: "Archived Project Web Reference",
        excerpt: "Historical project page references a digital museum experiment, now offline.",
        url: "https://web.archive.org/web/lost-artifact",
        confidence: "INFERRED",
        description: "Archived domain records suggesting the creator's initial intent before site shutdown."
      },
      {
        id: "3",
        type: "artwork",
        title: "Generative Style Scan",
        excerpt: "The artwork has visual similarity to 2021 generative art structures, suggesting it may represent a digital identity experiment.",
        url: "https://metamuse.demo/fingerprint/artifact-721",
        confidence: "AI-INTERPRETATION",
        description: "AI-inferred style analysis mapping pattern structures to known early generative templates."
      }
    ],

    provenanceEvents: [
      { event: "Contract Deployed", date: "Nov 01, 2022", wallet: "0x883AbC8eA85F2C9012a64A27579fC8291C2791C2", tx: "0x1111dD23c902A21C2eA64a2757279fC8291C2D9001", status: "VERIFIED" },
      { event: "NFT Minted", date: "Nov 03, 2022", wallet: "0x883AbC8eA85F2C9012a64A27579fC8291C2791C2", tx: "0x55B1dD23c902A21C2eA64a2757279fC8291C2D904", status: "VERIFIED" },
      { event: "Token Transferred", date: "Dec 15, 2023", wallet: "0x2B92fD8eA85F2C9012a64A27579fC8291C2D902b", tx: "0x2222dD23c902A21C2eA64a2757279fC8291C2D9002", status: "VERIFIED" }
    ],

    attestation: {
      status: "not-attested"
    },

    artworkContext: {
      traits: [
        { name: "Contrast", value: "High", type: "Visual" },
        { name: "Layout", value: "Generative Grid", type: "Visual" },
        { name: "Storage", value: "Centralized server", type: "Metadata" }
      ],
      similarity: {
        nftName: "Lost Artifact #12",
        score: "85%",
        status: "INFERRED",
        artworkUrl: "https://picsum.photos/id/1069/600/600",
        disclaimer: "Similarity does not establish ownership or copyright."
      }
    },

    projectContext: {
      creatorName: "Unknown Creator",
      description: "No verified description. The web archive describes this as 'a generative experiment exploring forgotten corners of the Ethereum chain.'",
      purpose: "Historical Generative Hobby Project",
      historicalContext: "Abandoned around late 2022. No community or social trace exists."
    }
  },

  // Preset C: Medium Confidence, Attested, Verification Mismatch
  "divergent-art-44": {
    id: "divergent-art-44",
    name: "MetaMuse Divergent Art #44",
    collectionName: "MetaMuse Divergent Art",
    tokenId: "44",
    contractAddress: "0x9E2a2757279fC8291C2eA64a2757279fC8291A7B",
    network: "Ethereum",
    tokenStandard: "ERC-721",
    creatorAddress: "0x7F21a279Fc8291C2eA64a2757279fC8291C279EF",
    currentOwner: "0x8A72fD8eA85F2C9012a64A27579fC8291C2D902b",
    mintTx: "0xAA12dD23c902A21C2eA64a2757279fC8291C2D9044",
    mintDate: "May 10, 2025",
    artworkUrl: "https://picsum.photos/id/1024/600/600",
    tokenUri: "https://divergent.art/api/metadata/44",
    metadataUri: "https://divergent.art/api/metadata/44",
    imageHash: "0x889BfC8eA85F2C9012a64A27579fC8291C2A214a44",
    metadataHash: "0x999BfC8eA85F2C9012a64A27579fC8291C2A214a44",
    openseaUrl: "https://opensea.io/assets/ethereum/0x9E2a2757279fC8291C2eA64a2757279fC8291A7B/44",
    
    explanation: "This NFT belongs to MetaMuse Divergent Art, an active art collection.[1] The creator is a verified digital artist who hosts metadata privately.[2] However, our recent check detected that the metadata URI or artwork image has been modified since it was originally attested.[3] The current artwork image may represent digital identity concepts, but differs from the registry hash.",
    
    confidence: {
      score: 78,
      breakdown: [
        { label: "On-chain evidence", status: "Strong", score: "verified" },
        { label: "Metadata completeness", status: "Weak", score: "unknown" },
        { label: "Creator validation", status: "Strong", score: "verified" },
        { label: "Project context", status: "Source-backed", score: "source-backed" },
        { label: "Artwork relationship", status: "Inferred", score: "inferred" }
      ]
    },

    evidence: [
      {
        id: "1",
        type: "project",
        title: "Creator Verified Portfolio Link",
        excerpt: "Official artist page lists this contract as the official registry for 'Divergent Art' prints.",
        url: "https://divergent.art",
        confidence: "SOURCE-BACKED",
        description: "Official domain confirmation linking back to the Ethereum contract."
      },
      {
        id: "2",
        type: "on-chain",
        title: "Ethereum Mint Signature",
        excerpt: "Minted directly from the artist's multisig contract (0x7F21...79EF).",
        url: "https://etherscan.io/tx/0xAA12dD23c902A21C2eA64a2757279fC8291C2D9044",
        confidence: "VERIFIED",
        description: "Cryptographic confirmation of mint origin wallet."
      },
      {
        id: "3",
        type: "metadata",
        title: "Decentralized Checksum Check",
        excerpt: "WARNING: The current metadata checksum does not match the original registry records, indicating the metadata has changed since attestation.",
        url: "https://etherscan.io/address/0x9E2a2757279fC8291C2eA64a2757279fC8291A7B",
        confidence: "UNKNOWN",
        description: "Dynamic metadata validation showing a discrepancy."
      }
    ],

    provenanceEvents: [
      { event: "Contract Deployed", date: "May 08, 2025", wallet: "0x7F21a279Fc8291C2eA64a2757279fC8291C279EF", tx: "0x7777dD23c902A21C2eA64a2757279fC8291C2D9007", status: "VERIFIED" },
      { event: "NFT Minted", date: "May 10, 2025", wallet: "0x7F21a279Fc8291C2eA64a2757279fC8291C279EF", tx: "0xAA12dD23c902A21C2eA64a2757279fC8291C2D9044", status: "VERIFIED" },
      { event: "Token Transferred", date: "Jun 01, 2025", wallet: "0x8A72fD8eA85F2C9012a64A27579fC8291C2D902b", tx: "0x8888dD23c902A21C2eA64a2757279fC8291C2D9008", status: "VERIFIED" }
    ],

    attestation: {
      status: "attested",
      txHash: "0x889BfC8eA85F2C9012a64A27579fC8291C2A214a12",
      blockNumber: 191837,
      timestamp: "Feb 02, 2026",
      attestor: "0x7F21a279Fc8291C2eA64a2757279fC8291C279EF",
      evidenceHash: "0x8A72a2757279fC8291C2eA64a2757279fC829F91", // Original attested hash
      provenanceHash: "0x19BCbC8eA85F2C9012a64A27579fC8291C2A214a79",
      verification: {
        status: "mismatch", // "match" | "mismatch"
        currentHash: "0xABC72a2757279fC8291C2eA64a2757279fC829F44", // The current evidence hash differs from the attested one
        attestedHash: "0x8A72a2757279fC8291C2eA64a2757279fC829F91"
      }
    },

    artworkContext: {
      traits: [
        { name: "Saturation", value: "Vibrant", type: "Visual" },
        { name: "Style", value: "Abstract Glitch", type: "Visual" },
        { name: "Hosting", value: "Private server", type: "Metadata" }
      ],
      similarity: {
        nftName: "Divergent Art #01",
        score: "91%",
        status: "INFERRED",
        artworkUrl: "https://picsum.photos/id/1022/600/600",
        disclaimer: "Similarity does not establish ownership or copyright."
      }
    },

    projectContext: {
      creatorName: "Divergent Collective",
      description: "An artist collective focusing on high-contrast glitch aesthetics. The project plays with the mutability of web representations.",
      purpose: "Private Fine Art Release",
      historicalContext: "Launched in mid 2025, exploring experimental metadata update protocols."
    }
  }
};
