/**
 * Formats a transaction hash, block hash, or IPFS CID into a readable shortened version.
 * e.g. 0x8A71dD23c902A21C2eA64a2757279fC8291C2D921 -> 0x8A71...D921
 * 
 * @param {string} hash - The hash/CID to format
 * @param {number} startChars - Characters to keep at start (default 6)
 * @param {number} endChars - Characters to keep at end (default 4)
 * @returns {string} Shortened readable hash
 */
export function formatHash(hash, startChars = 6, endChars = 4) {
  if (!hash) return "";
  if (hash.startsWith("ipfs://")) {
    const cid = hash.replace("ipfs://", "");
    return `ipfs://${cid.substring(0, startChars)}...${cid.substring(cid.length - endChars)}`;
  }
  if (hash.length <= startChars + endChars + 2) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
}
