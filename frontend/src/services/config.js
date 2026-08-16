// MetaMuse Core Configuration

// Toggle between "mock" mode and "real" mode
// "mock" mode simulates wallet connections, attestation signatures, and verification checks.
// "real" mode connects to live MetaMask (window.ethereum) and Monad Testnet contracts.
export const APP_MODE = "mock"; 

// If true, shows preview / demo tags for mock datasets
export const DEMO_MODE = true;

// Centralized Monad Testnet Settings
export const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: "0x279F",
  name: "Monad Testnet",
  rpcUrl: "https://testnet-rpc.monad.xyz",
  explorerUrl: "https://testnet.monadexplorer.com",
  nativeCurrency: {
    name: "Monad Native",
    symbol: "MON",
    decimals: 18
  }
};

// Deployed Monad Smart Contract Registry Address (empty placeholder for now)
export const MONAD_PROVENANCE_REGISTRY_ADDRESS = "";

