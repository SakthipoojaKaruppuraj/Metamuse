'use client'

import { Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from './wallet-provider'
import { cn } from '@/lib/utils'

export function WalletButton({ className }: { className?: string }) {
  const { status, addressShort, openModal, switchNetwork } = useWallet()

  if (status === 'wrong-network') {
    return (
      <Button
        onClick={switchNetwork}
        variant="outline"
        className={cn(
          'h-9 border-warning/40 bg-warning/10 px-3 text-warning hover:bg-warning/15 hover:text-warning',
          className,
        )}
      >
        <AlertTriangle className="size-4" />
        Switch Network
      </Button>
    )
  }

  if (status === 'switching') {
    return (
      <Button variant="outline" disabled className={cn('h-9 px-3', className)}>
        <Loader2 className="size-4 animate-spin" />
        Switching…
      </Button>
    )
  }

  if (status === 'connected' && addressShort) {
    return (
      <Button
        onClick={openModal}
        variant="outline"
        className={cn('h-9 gap-2 px-3 font-mono text-xs', className)}
      >
        <span className="size-2 rounded-full bg-success" aria-hidden="true" />
        {addressShort}
      </Button>
    )
  }

  if (status === 'connecting') {
    return (
      <Button disabled className={cn('h-9 px-3.5', className)}>
        <Loader2 className="size-4 animate-spin" />
        Connecting…
      </Button>
    )
  }

  return (
    <Button onClick={openModal} className={cn('h-9 px-3.5', className)}>
      Connect MetaMask
    </Button>
  )
}
