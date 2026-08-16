'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type WalletStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'wrong-network'
  | 'switching'

const MOCK_ADDRESS = '0xA82c1D9e4F5b607182930a4B5c6d7e8f90A691F'
export const MOCK_ADDRESS_SHORT = '0xA82...91F'

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

  const connect = useCallback(async () => {
    setStatus('connecting')
    await wait(1200)
    setAddress(MOCK_ADDRESS)
    setStatus('connected')
    setModalOpen(false)
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setStatus('disconnected')
  }, [])

  const switchNetwork = useCallback(async () => {
    setStatus('switching')
    await wait(1200)
    setStatus('connected')
  }, [])

  const simulateWrongNetwork = useCallback(() => {
    setStatus('wrong-network')
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({
      status,
      address,
      addressShort: address ? MOCK_ADDRESS_SHORT : null,
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
