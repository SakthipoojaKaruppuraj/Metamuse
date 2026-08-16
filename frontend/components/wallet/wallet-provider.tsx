'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { getAppMode } from '@/lib/config'
import { getMetaMaskProvider } from '@/lib/web3Service'

declare global {
  interface Window {
    ethereum?: any
  }
}

export type WalletStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'wrong-network'
  | 'switching'
  | 'no-metamask'
  | 'user-rejected'

const MOCK_ADDRESS = '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F'

interface WalletContextValue {
  status: WalletStatus
  address: string | null
  addressShort: string | null
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
  simulateWrongNetwork: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [address, setAddress] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  // Helper to verify chain ID
  const checkChain = useCallback(async () => {
    const provider = getMetaMaskProvider()
    if (!provider) return
    try {
      const chainIdHex = await provider.request({ method: 'eth_chainId' })
      if (chainIdHex === '0x279f' || chainIdHex === '0x279F' || Number(chainIdHex) === 10143) {
        setStatus('connected')
      } else {
        setStatus('wrong-network')
      }
    } catch {
      setStatus('wrong-network')
    }
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    const mode = getAppMode()
    if (mode === 'real') {
      const provider = getMetaMaskProvider()
      if (!provider) {
        setStatus('no-metamask')
        return
      }
      setStatus('connecting')
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0])
          await checkChain()
          setModalOpen(false)
        } else {
          setStatus('disconnected')
        }
      } catch (err: any) {
        if (err?.code === 4001 || String(err?.message || '').toLowerCase().includes('reject')) {
          setStatus('user-rejected')
        } else {
          setStatus('disconnected')
        }
        console.warn('MetaMask connection request resolved:', err?.message || err)
      }
    } else {
      // Mock connection
      setStatus('connecting')
      await wait(1200)
      setAddress(MOCK_ADDRESS)
      setStatus('connected')
      setModalOpen(false)
    }
  }, [checkChain])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null)
    setStatus('disconnected')
  }, [])

  // Switch network to Monad Testnet
  const switchNetwork = useCallback(async () => {
    const mode = getAppMode()
    if (mode === 'real') {
      const provider = getMetaMaskProvider()
      if (!provider) return
      setStatus('switching')
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x279f' }],
        })
        setStatus('connected')
      } catch (err: any) {
        // Error code 4902 is when the chain is not added to MetaMask
        if (err.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x279f',
                  chainName: 'Monad Testnet',
                  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
                  rpcUrls: ['https://testnet-rpc.monad.xyz'],
                  blockExplorerUrls: ['https://monadvision.com'],
                },
              ],
            })
            setStatus('connected')
          } catch {
            setStatus('wrong-network')
          }
        } else {
          setStatus('wrong-network')
        }
      }
    } else {
      // Mock network switch
      setStatus('switching')
      await wait(1200)
      setStatus('connected')
    }
  }, [])

  const simulateWrongNetwork = useCallback(() => {
    const mode = getAppMode()
    if (mode === 'mock') {
      setStatus('wrong-network')
    }
  }, [])

  // Listen to MetaMask events when in real mode
  useEffect(() => {
    let cleanup: (() => void) | undefined

    const initAndListen = () => {
      const provider = getMetaMaskProvider()
      if (!provider || getAppMode() !== 'real') {
        return
      }

      const handleAccounts = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null)
          setStatus('disconnected')
        } else {
          setAddress(accounts[0])
          checkChain()
        }
      }

      const handleChain = () => {
        checkChain()
      }

      provider.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            checkChain()
          }
        })
        .catch(console.error)

      provider.on('accountsChanged', handleAccounts)
      provider.on('chainChanged', handleChain)

      cleanup = () => {
        provider.removeListener('accountsChanged', handleAccounts)
        provider.removeListener('chainChanged', handleChain)
      }
    }

    // Run initially
    initAndListen()

    // Also listen for late EIP-6963 announcements to re-bind if provider was missing initially
    const handleAnnounceRebind = (event: any) => {
      const detail = event?.detail
      if (
        detail?.info?.rdns === 'io.metamask' || 
        String(detail?.info?.name || '').toLowerCase().includes('metamask')
      ) {
        if (cleanup) cleanup()
        setTimeout(() => {
          initAndListen()
        }, 50)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('eip6963:announceProvider', handleAnnounceRebind)
      window.dispatchEvent(new Event('eip6963:requestProvider'))
    }

    return () => {
      if (cleanup) cleanup()
      if (typeof window !== 'undefined') {
        window.removeEventListener('eip6963:announceProvider', handleAnnounceRebind)
      }
    }
  }, [checkChain])

  const addressShort = useMemo(() => {
    if (!address) return null
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  const value = useMemo<WalletContextValue>(
    () => ({
      status,
      address,
      addressShort,
      isModalOpen,
      openModal,
      closeModal,
      connect,
      disconnect,
      switchNetwork,
      simulateWrongNetwork,
    }),
    [
      status,
      address,
      addressShort,
      isModalOpen,
      openModal,
      closeModal,
      connect,
      disconnect,
      switchNetwork,
      simulateWrongNetwork,
    ],
  )

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
