/**
 * Parses and validates an OpenSea NFT URL.
 * MetaMuse MVP supports OpenSea Ethereum NFTs only.
 * 
 * @param {string} urlString - The URL to validate and parse
 * @returns {object} Result containing success state, data, or error message
 */
export function parseOpenSeaUrl(urlString) {
  if (!urlString) {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL." };
  }

  const cleanUrl = urlString.trim();

  // Try to parse the URL
  let parsed;
  try {
    // Add protocol if missing to allow URL constructor to work
    const withProtocol = cleanUrl.match(/^https?:\/\//i) ? cleanUrl : `https://${cleanUrl}`;
    parsed = new URL(withProtocol);
  } catch (e) {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL." };
  }

  // 1. Validate marketplace domain
  const isOpensea = parsed.hostname.toLowerCase() === "opensea.io" || parsed.hostname.toLowerCase().endsWith(".opensea.io");
  if (!isOpensea) {
    return { isValid: false, error: "MetaMuse currently supports OpenSea NFTs." };
  }

  // 2. Validate paths: Expected format: /assets/[chain]/[contractAddress]/[tokenId]
  // e.g. /assets/ethereum/0x7a3f2d79f9c0143891c2ea64a2757279fc8291c2/1837
  const pathParts = parsed.pathname.split("/").filter(Boolean);
  
  if (pathParts[0] !== "assets") {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL." };
  }

  const chain = pathParts[1] ? pathParts[1].toLowerCase() : "";
  const contractAddress = pathParts[2] || "";
  const tokenId = pathParts[3] || "";

  if (!chain || !contractAddress || !tokenId) {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL." };
  }

  // 3. Validate chain (Ethereum only for MVP)
  if (chain !== "ethereum") {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL. Only Ethereum is supported for the MVP." };
  }

  // 4. Validate contract address (0x followed by 40 hex characters)
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(contractAddress)) {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL (invalid contract address)." };
  }

  // 5. Validate token ID (numeric string)
  const tokenIdRegex = /^\d+$/;
  if (!tokenIdRegex.test(tokenId)) {
    return { isValid: false, error: "Please enter a valid OpenSea NFT URL (invalid token ID)." };
  }

  return {
    isValid: true,
    chain: "ethereum",
    contractAddress,
    tokenId
  };
}
