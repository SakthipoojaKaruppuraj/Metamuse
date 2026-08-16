import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface OSValidationResult {
  isValid: boolean
  error?: string
  contractAddress?: string
  tokenId?: string
  id?: string
}

export function validateOpenSeaUrl(url: string): OSValidationResult {
  if (!url) return { isValid: false, error: 'URL cannot be empty.' }
  
  try {
    const parsedUrl = new URL(url)
    const host = parsedUrl.hostname.toLowerCase()
    
    if (!host.includes('opensea.io')) {
      return {
        isValid: false,
        error: 'MetaMuse currently supports OpenSea NFTs.'
      }
    }
    
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
    
    if (pathSegments.length < 4 || (pathSegments[0] !== 'assets' && pathSegments[0] !== 'item')) {
      return {
        isValid: false,
        error: 'Please enter a valid OpenSea NFT URL.'
      }
    }
    
    const chain = pathSegments[1].toLowerCase()
    const contractAddress = pathSegments[2]
    const tokenId = pathSegments[3]
    
    if (chain !== 'ethereum') {
      return {
        isValid: false,
        error: 'Please enter a valid OpenSea NFT URL. Only Ethereum is supported for the MVP.'
      }
    }
    
    const hexRegex = /^0x[a-fA-F0-9]{40}$/
    if (!hexRegex.test(contractAddress) || !tokenId) {
      return {
        isValid: false,
        error: 'Please enter a valid OpenSea NFT URL.'
      }
    }
    
    let targetId = 'example-genesis-1837'
    if (contractAddress.toLowerCase() === '0x8c7b4a2757279fc8291c2ea64a2757279fc829a2' || tokenId === '721') {
      targetId = 'example-collection-721'
    } else if (contractAddress.toLowerCase() === '0x5f60789ac9012a64a27579fc8291c2791f9a79bc' || tokenId === '44') {
      targetId = 'example-divergent-44'
    }
    
    return {
      isValid: true,
      contractAddress,
      tokenId,
      id: targetId
    }
  } catch (e) {
    return {
      isValid: false,
      error: 'Please enter a valid OpenSea NFT URL.'
    }
  }
}

