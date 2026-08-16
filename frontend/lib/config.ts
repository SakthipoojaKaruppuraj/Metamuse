// Global Web3 environment configurations for MetaMuse

export const MONAD_PROVENANCE_REGISTRY_ADDRESS = '0xe0cb702a0702d33ee280bbce357e7ab54707b283' as `0x${string}`
export const MONAD_CHAIN_ID = 10143
export const MONAD_RPC_URL = 'https://testnet-rpc.monad.xyz'
export const MONAD_EXPLORER_URL = 'https://monadvision.com'

export function getAppMode(): 'mock' | 'real' {
  // If running on server side or environment variable is unset, default to 'mock'
  if (typeof window === 'undefined') {
    return 'mock'
  }
  return (process.env.NEXT_PUBLIC_APP_MODE as 'mock' | 'real') || 'mock'
}
