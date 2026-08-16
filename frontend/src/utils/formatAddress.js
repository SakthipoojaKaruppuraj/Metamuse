/**
 * Formats a hexadecimal Ethereum address into a readable shortened version.
 * e.g. 0x7A3F2d79F9C0143891C2eA64a2757279fC8291C2 -> 0x7A3F...91C2
 * 
 * @param {string} address - The address to format
 * @param {number} chars - The number of characters to keep at start and end (default 4)
 * @returns {string} Shortened readable address
 */
export function formatAddress(address, chars = 4) {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}
