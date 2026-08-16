import { createWalletClient, createPublicClient, custom, http, defineChain } from 'viem';
import { APP_MODE, MONAD_TESTNET } from './config';

// Define Monad Testnet Chain for Viem
export const monadTestnet = defineChain({
  id: MONAD_TESTNET.chainId,
  name: MONAD_TESTNET.name,
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: [MONAD_TESTNET.rpcUrl] },
    public: { http: [MONAD_TESTNET.rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: MONAD_TESTNET.explorerUrl },
  },
});

// State schema:
// {
//   address: string | null,
//   chainId: number | null,
//   status: "disconnected" | "connecting" | "connected" | "wrong-network" | "switching-network" | "no-metamask",
//   error: null | "NO_METAMASK" | "USER_REJECTED" | "WRONG_NETWORK" | "NETWORK_SWITCH_REJECTED" | "UNKNOWN_ERROR"
// }
let state = {
  address: null,
  chainId: null,
  status: "disconnected",
  error: null
};

const listeners = new Set();
let walletClient = null;
let publicClient = null;

function emit() {
  listeners.forEach(cb => cb({ ...state }));
}

// Initialize Viem Clients if in real mode and MetaMask is available
if (APP_MODE === "real" && typeof window !== "undefined") {
  if (window.ethereum) {
    try {
      walletClient = createWalletClient({
        chain: monadTestnet,
        transport: custom(window.ethereum)
      });

      publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http(MONAD_TESTNET.rpcUrl)
      });

      // Check current accounts
      walletClient.getAddresses()
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            state.address = accounts[0];
            const chainId = await walletClient.getChainId();
            state.chainId = chainId;
            
            if (chainId === MONAD_TESTNET.chainId) {
              state.status = "connected";
              state.error = null;
            } else {
              state.status = "wrong-network";
              state.error = "WRONG_NETWORK";
            }
            emit();
          }
        })
        .catch(console.error);

      // Listeners
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts && accounts.length > 0) {
          state.address = accounts[0];
          state.error = null;
          checkNetworkAndEmit();
        } else {
          state.address = null;
          state.chainId = null;
          state.status = "disconnected";
          state.error = null;
          emit();
        }
      });

      window.ethereum.on('chainChanged', (chainIdHex) => {
        const chainId = parseInt(chainIdHex, 16);
        state.chainId = chainId;
        if (state.address) {
          if (chainId === MONAD_TESTNET.chainId) {
            state.status = "connected";
            state.error = null;
          } else {
            state.status = "wrong-network";
            state.error = "WRONG_NETWORK";
          }
        }
        emit();
      });
    } catch (e) {
      console.error("Viem client setup failed", e);
    }
  } else {
    state.status = "no-metamask";
    state.error = "NO_METAMASK";
  }
}

async function checkNetworkAndEmit() {
  if (walletClient) {
    try {
      const chainId = await walletClient.getChainId();
      state.chainId = chainId;
      if (chainId === MONAD_TESTNET.chainId) {
        state.status = "connected";
        state.error = null;
      } else {
        state.status = "wrong-network";
        state.error = "WRONG_NETWORK";
      }
    } catch (e) {
      state.error = "UNKNOWN_ERROR";
    }
    emit();
  }
}

export const walletService = {
  subscribe(callback) {
    listeners.add(callback);
    callback({ ...state });
    return () => listeners.delete(callback);
  },

  getState() {
    return { ...state };
  },

  // Public Clients for read-only contract state/explorer checks
  getPublicClient() {
    if (APP_MODE === "mock") return null;
    return publicClient;
  },

  getWalletClient() {
    if (APP_MODE === "mock") return null;
    return walletClient;
  },

  setMockState(updates) {
    if (APP_MODE !== "mock") return;
    state = { ...state, ...updates };
    emit();
  },

  async connect() {
    if (APP_MODE === "mock") {
      state.status = "connecting";
      state.error = null;
      emit();
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      state.address = "0xA82fF8eA85F2C9012a64A27579fC8291C2791F9a";
      if (!state.chainId) {
        state.chainId = MONAD_TESTNET.chainId;
      }
      
      if (state.chainId === MONAD_TESTNET.chainId) {
        state.status = "connected";
        state.error = null;
      } else {
        state.status = "wrong-network";
        state.error = "WRONG_NETWORK";
      }
      emit();
      return state;
    }

    // Real Mode with Viem
    if (typeof window === "undefined" || !window.ethereum) {
      state.status = "no-metamask";
      state.error = "NO_METAMASK";
      emit();
      return state;
    }

    try {
      state.status = "connecting";
      state.error = null;
      emit();

      const accounts = await walletClient.requestAddresses();
      if (accounts && accounts.length > 0) {
        state.address = accounts[0];
        await checkNetworkAndEmit();
      } else {
        state.status = "disconnected";
        emit();
      }
    } catch (e) {
      console.error("Viem connection request failed", e);
      state.status = "disconnected";
      // Map User Rejected Request
      if (e.name === 'UserRejectedRequestError' || e.code === 4001) {
        state.error = "USER_REJECTED";
      } else {
        state.error = "UNKNOWN_ERROR";
      }
      emit();
    }
    return state;
  },

  async disconnect() {
    state.address = null;
    state.chainId = null;
    state.status = "disconnected";
    state.error = null;
    emit();
  },

  async switchNetwork() {
    if (APP_MODE === "mock") {
      state.status = "switching-network";
      emit();
      await new Promise(resolve => setTimeout(resolve, 800));
      state.chainId = MONAD_TESTNET.chainId;
      state.status = "connected";
      state.error = null;
      emit();
      return true;
    }

    // Real switch network using Viem Client request
    if (!walletClient || typeof window === "undefined" || !window.ethereum) return false;

    try {
      state.status = "switching-network";
      emit();
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET.chainIdHex }],
      });
      
      state.chainId = MONAD_TESTNET.chainId;
      state.status = "connected";
      state.error = null;
      emit();
      return true;
    } catch (switchError) {
      // Chain not added to wallet error
      if (switchError.code === 4902 || switchError.name === 'ChainNotConfiguredError') {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: MONAD_TESTNET.chainIdHex,
                chainName: MONAD_TESTNET.name,
                rpcUrls: [MONAD_TESTNET.rpcUrl],
                nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
                blockExplorerUrls: [MONAD_TESTNET.explorerUrl]
              }
            ]
          });
          state.chainId = MONAD_TESTNET.chainId;
          state.status = "connected";
          state.error = null;
          emit();
          return true;
        } catch (addError) {
          console.error("Failed to add Monad chain via Viem client", addError);
          state.status = "wrong-network";
          state.error = "NETWORK_SWITCH_REJECTED";
          emit();
          return false;
        }
      }

      if (switchError.code === 4001 || switchError.name === 'UserRejectedRequestError') {
        state.error = "NETWORK_SWITCH_REJECTED";
      } else {
        state.error = "UNKNOWN_ERROR";
      }
      
      state.status = "wrong-network";
      emit();
      return false;
    }
  }
};
