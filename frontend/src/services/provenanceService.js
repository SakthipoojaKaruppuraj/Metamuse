/**
 * Provenance Service
 * Reconstructs custody timelines and computes structured node-link data for graph visualizations.
 * 
 * Separates data calculation from visualization (ProvenanceGraph.jsx).
 */
export const provenanceService = {
  /**
   * Generates a structured graph data object for an NFT
   * 
   * @param {object} nft - Resolved NFT object
   * @returns {object} Node-link graph structure { nodes, links }
   */
  getProvenanceGraph(nft) {
    if (!nft) return { nodes: [], links: [] };

    const nodes = [
      {
        id: "creator",
        label: "Creator",
        subtitle: nft.creatorAddress,
        type: "creator",
        value: nft.creatorAddress
      },
      {
        id: "collection",
        label: "Collection Contract",
        subtitle: nft.contractAddress,
        type: "collection",
        value: nft.contractAddress
      },
      {
        id: "mint",
        label: "Mint Transaction",
        subtitle: nft.mintTx,
        type: "mint",
        value: nft.mintTx
      },
      {
        id: "nft",
        label: `${nft.collectionName} #${nft.tokenId}`,
        subtitle: `ID: ${nft.tokenId}`,
        type: "nft",
        value: nft.tokenId
      },
      {
        id: "artwork",
        label: "Artwork",
        subtitle: "IPFS/Fingerprint",
        type: "artwork",
        value: nft.imageHash || "Image File"
      },
      {
        id: "owner",
        label: "Current Owner",
        subtitle: nft.currentOwner,
        type: "owner",
        value: nft.currentOwner
      }
    ];

    const links = [
      { source: "creator", target: "collection", label: "Created" },
      { source: "collection", target: "nft", label: "Contains" },
      { source: "creator", target: "mint", label: "Triggered" },
      { source: "mint", target: "nft", label: "Minted" },
      { source: "nft", target: "artwork", label: "References" },
      { source: "nft", target: "owner", label: "Owned by" }
    ];

    return { nodes, links };
  },

  /**
   * Returns details of confidence score breakdown
   * 
   * @param {object} nft - Resolved NFT object
   * @returns {object} Confidence score and detailed criteria checks
   */
  getConfidenceBreakdown(nft) {
    if (!nft || !nft.confidence) {
      return {
        score: 0,
        breakdown: []
      };
    }
    return nft.confidence;
  }
};
