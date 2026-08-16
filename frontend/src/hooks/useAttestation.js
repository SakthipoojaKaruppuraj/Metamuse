import { useState, useEffect } from 'react';
import { attestationService } from '../services/attestationService';

export function useAttestation(nft) {
  const [attestation, setAttestation] = useState(null);
  const [attestStatus, setAttestStatus] = useState("idle"); // "idle" | "pending" | "confirmed" | "failed"
  const [txDetails, setTxDetails] = useState(null);
  const [verification, setVerification] = useState({ status: "unverified" });
  const [error, setError] = useState(null);

  // Reset and check registry whenever the active NFT changes
  useEffect(() => {
    if (!nft) {
      setAttestation(null);
      setAttestStatus("idle");
      setTxDetails(null);
      setVerification({ status: "unverified" });
      setError(null);
      return;
    }

    async function loadAttestation() {
      setAttestStatus("idle");
      setTxDetails(null);
      setError(null);

      // Check if the preset already has an default attestation record
      if (nft.attestation && nft.attestation.status === "attested") {
        setAttestation(nft.attestation);
        const verifyOutcome = attestationService.verifyAttestation(nft, nft.attestation);
        setVerification(verifyOutcome);
      } else {
        // Query the cache or service
        const saved = await attestationService.getAttestation(nft.contractAddress, nft.tokenId);
        if (saved) {
          setAttestation(saved);
          const verifyOutcome = attestationService.verifyAttestation(nft, saved);
          setVerification(verifyOutcome);
        } else {
          setAttestation(null);
          setVerification({ status: "unverified" });
        }
      }
    }

    loadAttestation();
  }, [nft]);

  const attest = async (walletAddress) => {
    if (!nft || !walletAddress) return;

    try {
      setAttestStatus("pending");
      setError(null);
      const tx = await attestationService.attestProvenance(nft, walletAddress);
      
      setAttestation(tx);
      setTxDetails(tx);
      setAttestStatus("confirmed");

      // Automatically run verification checks after anchoring
      const verifyOutcome = attestationService.verifyAttestation(nft, tx);
      setVerification(verifyOutcome);
    } catch (e) {
      console.error(e);
      setError(e.message || "UNKNOWN_ERROR");
      setAttestStatus("failed");
    }
  };

  const verify = () => {
    if (!nft || !attestation) return;
    const outcome = attestationService.verifyAttestation(nft, attestation);
    setVerification(outcome);
    return outcome;
  };

  return {
    attestation,
    attestStatus,
    txDetails,
    verification,
    error,
    attest,
    verify,
    // Expose overrides for the dev state control panel
    setMockAttestationState: (status, customHashStatus = "match") => {
      setError(null);
      if (status === "not-attested") {
        setAttestation(null);
        setAttestStatus("idle");
        setTxDetails(null);
        setVerification({ status: "unverified" });
      } else if (status === "pending") {
        setAttestStatus("pending");
      } else if (status === "failed") {
        setAttestStatus("failed");
      } else if (status === "confirmed") {
        const mockTx = {
          txHash: "0x19BCbC8eA85F2C9012a64A27579fC8291C2A214a",
          blockNumber: 182734,
          timestamp: new Date().toLocaleString(),
          attestor: "0xA82fF8eA85F2C9012a64A27579fC8291C2791F9a",
          evidenceHash: nft.evidenceHash || "0x8A72a2757279fC8291C2eA64a2757279fC829F91",
          provenanceHash: "0x19BCbC8eA85F2C9012a64A27579fC8291C2A214a79"
        };
        setAttestation(mockTx);
        setTxDetails(mockTx);
        setAttestStatus("confirmed");

        // Set matching or mismatching evidence hash
        const currentHash = customHashStatus === "mismatch" 
          ? "0xABC72a2757279fC8291C2eA64a2757279fC829F44"
          : mockTx.evidenceHash;

        setVerification({
          status: customHashStatus === "mismatch" ? "mismatch" : "match",
          currentHash,
          attestedHash: mockTx.evidenceHash,
          message: customHashStatus === "mismatch"
            ? "The current provenance evidence differs from the original attested version."
            : "The current provenance evidence matches the original Monad attestation."
        });
      }
    }
  };
}
