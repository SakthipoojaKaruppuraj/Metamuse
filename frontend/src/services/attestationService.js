import { APP_MODE, MONAD_TESTNET, MONAD_PROVENANCE_REGISTRY_ADDRESS } from './config';
import { NFTProvenanceRegistryABI } from './abis/NFTProvenanceRegistryABI';
import { walletService } from './walletService';

// Key for local storage mock registry cache
const CACHE_KEY = "metamuse_mock_attestation_registry";

function getCachedRegistry() {
  if (typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (e) {
    console.error("Failed to read attestation cache", e);
    return {};
  }
}

function saveCachedRegistry(registry) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error("Failed to save attestation cache", e);
  }
}

export const attestationService = {
  /**
   * Generates a deterministic mock evidence commitment for the front-end.
   * Note: The actual cryptographic commitment protocol is not finalized yet and will be built in the backend.
   * 
   * @param {object} data - Raw NFT evidence data
   * @returns {string} Mapped commitment string
   */
  createEvidenceCommitment(data) {
    if (APP_MODE === "mock") {
      // Return a deterministic mock commitment for Demo Genesis #1837
      if (data && data.tokenId === "1837") {
        return "0x8A72a2757279fC8291C2eA64a2757279fC829F91";
      }
      return "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("");
    }

    // In Real Mode, this will receive the canonical evidence package from the backend.
    // Return placeholder evidence hash commit
    return data.evidenceHash || "0x8A72a2757279fC8291C2eA64a2757279fC829F91";
  },

  /**
   * Anchors a provenance assessment on Monad Testnet using Viem
   * 
   * @param {object} nft - NFT object to attest
   * @param {string} attestorAddress - The signer's wallet address
   * @returns {Promise<object>} Transaction details
   */
  async attestProvenance(nft, attestorAddress) {
    if (APP_MODE === "mock") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
      const blockNumber = 182000 + Math.floor(Math.random() * 10000);
      const timestamp = new Date().toLocaleString();
      
      const attestationInfo = {
        txHash,
        blockNumber,
        timestamp,
        attestor: attestorAddress,
        evidenceHash: this.createEvidenceCommitment(nft),
        provenanceHash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("")
      };

      const registry = getCachedRegistry();
      registry[`${nft.contractAddress.toLowerCase()}-${nft.tokenId}`] = attestationInfo;
      saveCachedRegistry(registry);

      return attestationInfo;
    }

    // --- REAL MODE VIA VIEM ---
    
    // 1. Check MetaMask Installation
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("NO_METAMASK");
    }

    // 2. Check Wallet state
    const walletState = walletService.getState();
    if (walletState.status === "wrong-network") {
      throw new Error("WRONG_NETWORK");
    }

    // 3. Check Contract Registry Address Configuration
    if (!MONAD_PROVENANCE_REGISTRY_ADDRESS || MONAD_PROVENANCE_REGISTRY_ADDRESS.trim() === "") {
      throw new Error("CONTRACT_NOT_CONFIGURED");
    }

    // 4. Check Deployed ABI Configuration
    if (!NFTProvenanceRegistryABI || NFTProvenanceRegistryABI.length === 0) {
      throw new Error("CONTRACT_ABI_NOT_CONFIGURED");
    }

    const walletClient = walletService.getWalletClient();
    const publicClient = walletService.getPublicClient();

    if (!walletClient || !publicClient) {
      throw new Error("RPC_ERROR");
    }

    try {
      const evidenceHash = this.createEvidenceCommitment(nft);
      const mockProvenanceHash = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("");

      // Trigger contract write client
      const hash = await walletClient.writeContract({
        address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
        abi: NFTProvenanceRegistryABI,
        functionName: 'attestProvenance',
        args: [nft.contractAddress, BigInt(nft.tokenId), evidenceHash, mockProvenanceHash],
        account: attestorAddress
      });

      // Wait for Monad block confirmation receipt
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        timeout: 15000 // 15s timeout check
      });

      const attestationInfo = {
        txHash: hash,
        blockNumber: Number(receipt.blockNumber),
        timestamp: new Date().toLocaleString(),
        attestor: attestorAddress,
        evidenceHash: evidenceHash,
        provenanceHash: mockProvenanceHash
      };

      return attestationInfo;
    } catch (e) {
      console.error("Viem attestation transaction failed", e);
      
      // Standardize error mapping
      if (e.name === 'UserRejectedRequestError' || e.code === 4001) {
        throw new Error("USER_REJECTED");
      }
      if (e.name === 'TransactionRevertedError' || e.code === -32000) {
        throw new Error("TRANSACTION_REVERTED");
      }
      if (e.name === 'CallExecutionError') {
        throw new Error("CONTRACT_CALL_FAILED");
      }
      if (e.name === 'TransactionExecutionError' && e.message.includes('timeout')) {
        throw new Error("TRANSACTION_TIMEOUT");
      }
      
      throw new Error("UNKNOWN_ERROR");
    }
  },

  /**
   * Checks if an NFT has an existing attestation
   */
  async getAttestation(contractAddress, tokenId) {
    const key = `${contractAddress.toLowerCase()}-${tokenId}`;

    if (APP_MODE === "mock") {
      const registry = getCachedRegistry();
      if (registry[key]) {
        return registry[key];
      }
      return null;
    }

    // --- REAL MODE READING FROM CONTRACT ---
    if (!MONAD_PROVENANCE_REGISTRY_ADDRESS || MONAD_PROVENANCE_REGISTRY_ADDRESS.trim() === "" || NFTProvenanceRegistryABI.length === 0) {
      return null;
    }

    const publicClient = walletService.getPublicClient();
    if (!publicClient) return null;

    try {
      // In the future, once contract is deployed:
      // const attestation = await publicClient.readContract({
      //   address: MONAD_PROVENANCE_REGISTRY_ADDRESS,
      //   abi: NFTProvenanceRegistryABI,
      //   functionName: 'getLatestAttestation',
      //   args: [contractAddress, BigInt(tokenId)]
      // });
      // return attestation;
      return null;
    } catch (e) {
      console.error("Failed to read latest attestation from Monad contract", e);
      return null;
    }
  },

  verifyAttestation(nft, attestation) {
    if (!attestation) {
      return { status: "unverified", message: "No attestation found on Monad Testnet." };
    }

    const currentHash = nft.id === "divergent-art-44" 
      ? "0xABC72a2757279fC8291C2eA64a2757279fC829F44"
      : (nft.evidenceHash || attestation.evidenceHash);

    const isMatch = currentHash.toLowerCase() === attestation.evidenceHash.toLowerCase();

    return {
      status: isMatch ? "match" : "mismatch",
      currentHash,
      attestedHash: attestation.evidenceHash,
      message: isMatch 
        ? "The current provenance evidence matches the original Monad attestation."
        : "The current provenance evidence differs from the original attested version."
    };
  }
};
