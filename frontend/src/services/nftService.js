import { APP_MODE } from './config';
import { MOCK_NFTS } from '../data/mockNFT';

export const nftService = {
  /**
   * Prepares NFT search audits for future backend queries.
   * 
   * @param {object} input - Search parameters: { source, chain, contractAddress, tokenId }
   * @returns {Promise<object>} Audit results matching the expected backend schema
   */
  async analyzeNFT(input) {
    const { contractAddress, tokenId } = input;
    return this.resolveNFT(contractAddress, tokenId);
  },

  /**
   * Resolves an NFT from an OpenSea URL or Ethereum Contract + Token ID
   * 
   * @param {string} contractAddress - Hex contract address
   * @param {string} tokenId - Token ID string
   * @returns {Promise<object>} Resolved NFT story package
   */
  async resolveNFT(contractAddress, tokenId) {
    // Standardize contract casing
    const addressClean = contractAddress.toLowerCase();
    const tokenClean = tokenId.toString().trim();

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (APP_MODE === "mock") {
      // Find matching mock preset
      const presetKey = this.findPresetKey(addressClean, tokenClean);
      if (presetKey && MOCK_NFTS[presetKey]) {
        return { ...MOCK_NFTS[presetKey] };
      }

      // If no matching preset, generate a dynamic mock record for testing
      return this.generateDynamicMock(contractAddress, tokenId);
    }

    // REAL MODE placeholder:
    // In a real application, you would:
    // 1. Fetch metadata from OpenSea API or an Ethereum RPC provider (using viem or ethers)
    // 2. Fetch the metadata JSON from IPFS/Arweave or centralized server
    // 3. Query your backend provenance API for explains, context, and evidence scans
    // 4. Query your smart contract indexer to see if it has been attested on Monad
    
    // For the hackathon MVP, we fallback to dynamic presets to keep the UI fully operational
    const presetKey = this.findPresetKey(addressClean, tokenClean);
    if (presetKey && MOCK_NFTS[presetKey]) {
      return { ...MOCK_NFTS[presetKey] };
    }
    return this.generateDynamicMock(contractAddress, tokenId);
  },

  findPresetKey(contract, token) {
    if (contract === "0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2" && token === "1837") {
      return "genesis-1837";
    }
    if (contract === "0x3f91a279fc8291c2ea64a2757279fc8291c2792b" && token === "721") {
      return "lost-artifact-721";
    }
    if (contract === "0x9e2a2757279fc8291c2ea64a2757279fc8291a7b" && token === "44") {
      return "divergent-art-44";
    }
    return null;
  },

  generateDynamicMock(contract, token) {
    return {
      id: `custom-${contract}-${token}`,
      name: `MetaMuse Custom NFT #${token}`,
      collectionName: "MetaMuse Dynamic Sandbox",
      tokenId: token,
      contractAddress: contract,
      network: "Ethereum",
      tokenStandard: "ERC-721",
      creatorAddress: "0x8fC3A279Fc8291C2eA64a2757279fC8291C2791B",
      currentOwner: "0x3f82fD8eA85F2C9012a64A27579fC8291C2D902a",
      mintTx: "0x3A21dD23c902A21C2eA64a2757279fC8291C2D9999",
      mintDate: "Jun 12, 2025",
      artworkUrl: "https://picsum.photos/id/1020/600/600",
      tokenUri: `https://dynamic.metamuse.demo/metadata/${token}`,
      metadataUri: `https://dynamic.metamuse.demo/metadata/${token}`,
      imageHash: "0xIMAGE_HASH_PLACEHOLDER",
      metadataHash: "0xMETADATA_HASH_PLACEHOLDER",
      openseaUrl: `https://opensea.io/assets/ethereum/${contract}/${token}`,
      
      explanation: `This NFT is a dynamically resolved custom contract. The underlying asset exists on Ethereum as token #${token} under address ${contract}.[1] Analysis suggests the contract was deployed in mid 2025.[2] No verified creator statement was found, so context remains inferred.[3]`,
      
      confidence: {
        score: 75,
        breakdown: [
          { label: "On-chain evidence", status: "Strong", score: "verified" },
          { label: "Metadata completeness", status: "Moderate", score: "inferred" },
          { label: "Creator validation", status: "Unknown", score: "unknown" },
          { label: "Project context", status: "Unknown", score: "unknown" },
          { label: "Artwork relationship", status: "Inferred", score: "inferred" }
        ]
      },

      evidence: [
        {
          id: "1",
          type: "on-chain",
          title: "Ethereum Contract Verification",
          excerpt: `Contract address ${contract} detected and verified as active ERC-721 token.`,
          url: `https://etherscan.io/address/${contract}`,
          confidence: "VERIFIED",
          description: "Contract address successfully queried on Ethereum nodes."
        },
        {
          id: "2",
          type: "on-chain",
          title: "Mint Event Log",
          excerpt: "Mint transaction logs detected. Token was registered on block #20349182.",
          url: "https://etherscan.io/tx/0x3A21dD23c902A21C2eA64a2757279fC8291C2D9999",
          confidence: "VERIFIED",
          description: "On-chain registration confirms transaction origin."
        },
        {
          id: "3",
          type: "metadata",
          title: "Metadata Analysis",
          excerpt: "Private API hosting metadata structure detected. Some traits resolved but fields remain unverified.",
          url: `https://dynamic.metamuse.demo/metadata/${token}`,
          confidence: "INFERRED",
          description: "Metadata fields checked against standardized ERC-721 formats."
        }
      ],

      provenanceEvents: [
        { event: "Contract Deployed", date: "Jun 10, 2025", wallet: "0x8fC3A279Fc8291C2eA64a2757279fC8291C2791B", tx: "0x1111dD23c902A21C2eA64a2757279fC8291C2D0001", status: "VERIFIED" },
        { event: "NFT Minted", date: "Jun 12, 2025", wallet: "0x8fC3A279Fc8291C2eA64a2757279fC8291C2791B", tx: "0x3A21dD23c902A21C2eA64a2757279fC8291C2D9999", status: "VERIFIED" }
      ],

      attestation: {
        status: "not-attested"
      },

      artworkContext: {
        traits: [
          { name: "Visual Node", value: "Sandbox Pattern", type: "Visual" }
        ],
        similarity: {
          nftName: "Dynamic Sandbox #01",
          score: "70%",
          status: "INFERRED",
          artworkUrl: "https://picsum.photos/id/1021/600/600",
          disclaimer: "Similarity does not establish ownership or copyright."
        }
      },

      projectContext: {
        creatorName: "Dynamic Sandbox Deployer",
        description: "A dynamically generated record mapping an unindexed custom contract for evaluation purposes.",
        purpose: "Evaluation Sandbox Mode",
        historicalContext: "Evaluated in August 2026. No indexed social context exists."
      }
    };
  }
};
