'use client'

import { Dialog } from '@base-ui/react/dialog'
import { Loader2, LogOut, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { MetaMaskIcon } from './metamask-icon'
import { useWallet } from './wallet-provider'

export function WalletModal() {
  const {
    isModalOpen,
    closeModal,
    status,
    connect,
    disconnect,
    address,
    addressShort,
  } = useWallet()

  const connected = status === 'connected'

  return (
    <Dialog.Root
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) closeModal()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-7 shadow-xl transition-all data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          {connected ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-lavender">
                <MetaMaskIcon className="size-8" />
              </div>
              <Dialog.Title className="mt-4 text-lg font-semibold text-foreground">
                Wallet connected
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                You&apos;re connected to Monad Testnet.
              </Dialog.Description>

              <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3">
                <span className="font-mono text-sm text-foreground">
                  {addressShort}
                </span>
                <CopyButton value={address ?? ''} label="Copy" />
              </div>

              <div className="mt-5 flex w-full flex-col gap-2">
                <Button
                  variant="outline"
                  className="h-10 w-full justify-center"
                  render={
                    <a
                      href="https://testnet.monadexplorer.com"
                      target="_blank"
                      rel="noreferrer noopener"
                    />
                  }
                >
                  <ExternalLink className="size-4" />
                  View on Monad Explorer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    disconnect()
                    closeModal()
                  }}
                  className="h-10 w-full justify-center text-muted-foreground"
                >
                  <LogOut className="size-4" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex size-14 items-center justify-center self-center rounded-2xl bg-lavender">
                <MetaMaskIcon className="size-8" />
              </div>
              <Dialog.Title className="mt-4 text-center text-xl font-semibold tracking-tight text-foreground">
                Connect your wallet
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
                Connect MetaMask to create and verify provenance attestations on
                Monad Testnet.
              </Dialog.Description>

              <button
                type="button"
                onClick={connect}
                disabled={status === 'connecting'}
                className="mt-6 flex w-full items-center justify-between rounded-2xl border border-border bg-secondary px-4 py-4 text-left transition-colors hover:border-primary/40 hover:bg-lavender disabled:opacity-60"
              >
                <span className="flex items-center gap-3">
                  <MetaMaskIcon className="size-7" />
                  <span className="text-sm font-semibold text-foreground">
                    MetaMask
                  </span>
                </span>
                {status === 'connecting' ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    Detected
                  </span>
                )}
              </button>

              <div className="mt-5 flex flex-col gap-2">
                <Button
                  onClick={connect}
                  disabled={status === 'connecting'}
                  className="h-11 w-full justify-center text-sm"
                >
                  {status === 'connecting' ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    'Connect MetaMask'
                  )}
                </Button>
                <Dialog.Close
                  render={
                    <Button
                      variant="ghost"
                      className="h-10 w-full justify-center text-muted-foreground"
                    />
                  }
                >
                  Cancel
                </Dialog.Close>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Wallet connection is only required to attest provenance — not to
                analyze an NFT.
              </p>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
