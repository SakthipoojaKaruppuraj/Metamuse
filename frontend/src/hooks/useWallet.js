import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';

/**
 * Custom React hook to interact with wallet states and services.
 * 
 * Exposes:
 * - address: string | null (connected address)
 * - status: "disconnected" | "connecting" | "connected" | "wrong-network" | "switching-network"
 * - isConnected: boolean
 * - connect: function (trigger MetaMask connect)
 * - disconnect: function (trigger disconnect)
 * - switchNetwork: function (trigger chain swap to Monad)
 */
export function useWallet() {
  const [walletState, setWalletState] = useState(walletService.getState());

  useEffect(() => {
    // Subscribe to state updates in the walletService
    const unsubscribe = walletService.subscribe((newState) => {
      setWalletState(newState);
    });

    return () => unsubscribe();
  }, []);

  return {
    address: walletState.address,
    status: walletState.status,
    error: walletState.error,
    isConnected: walletState.status === "connected",
    isWrongNetwork: walletState.status === "wrong-network",
    connect: () => walletService.connect(),
    disconnect: () => walletService.disconnect(),
    switchNetwork: () => walletService.switchNetwork(),
    // Expose developer overrides in mock mode
    setMockState: (updates) => walletService.setMockState(updates)
  };
}
