import { useState } from 'react';
import { parseOpenSeaUrl } from '../utils/parseOpenSeaUrl';
import { nftService } from '../services/nftService';

const INITIAL_STEPS = [
  { id: "identify", label: "NFT identified", status: "pending" },
  { id: "metadata", label: "Metadata retrieved", status: "pending" },
  { id: "provenance", label: "Reconstructing provenance", status: "pending" },
  { id: "artwork", label: "Analyzing artwork characteristics", status: "pending" },
  { id: "context", label: "Researching project context", status: "pending" },
  { id: "evidence", label: "Collecting evidence sources", status: "pending" },
  { id: "explain", label: "Generating explanation story", status: "pending" }
];

export function useNFTAnalysis() {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runStepByStepLoader = async (contract, tokenId) => {
    setLoading(true);
    setError("");
    setResult(null);

    // Initial state: first step active
    let currentSteps = INITIAL_STEPS.map((s, idx) => ({
      ...s,
      status: idx === 0 ? "active" : "pending"
    }));
    setSteps(currentSteps);

    // Helper to update individual step status
    const updateStepStatus = (id, status) => {
      currentSteps = currentSteps.map(s => {
        if (s.id === id) return { ...s, status };
        return s;
      });
      setSteps(currentSteps);
    };

    // Step 1: Identify (Instant after parsing success)
    await new Promise(resolve => setTimeout(resolve, 400));
    updateStepStatus("identify", "done");
    updateStepStatus("metadata", "active");

    // Step 2: Retrieve Metadata
    await new Promise(resolve => setTimeout(resolve, 600));
    updateStepStatus("metadata", "done");
    updateStepStatus("provenance", "active");

    // Step 3: Reconstruct Provenance
    await new Promise(resolve => setTimeout(resolve, 700));
    updateStepStatus("provenance", "done");
    updateStepStatus("artwork", "active");

    // Step 4: Analyze Artwork
    await new Promise(resolve => setTimeout(resolve, 600));
    updateStepStatus("artwork", "done");
    updateStepStatus("context", "active");

    // Step 5: Research Context
    await new Promise(resolve => setTimeout(resolve, 500));
    updateStepStatus("context", "done");
    updateStepStatus("evidence", "active");

    // Step 6: Collect Evidence
    await new Promise(resolve => setTimeout(resolve, 600));
    updateStepStatus("evidence", "done");
    updateStepStatus("explain", "active");

    // Step 7: Generate AI Story and retrieve full result
    try {
      const nftData = await nftService.analyzeNFT({
        source: "opensea",
        chain: "ethereum",
        contractAddress: contract,
        tokenId: tokenId
      });
      await new Promise(resolve => setTimeout(resolve, 800));
      updateStepStatus("explain", "done");
      
      setResult(nftData);
      setLoading(false);
      return nftData;
    } catch (e) {
      setError("Failed to analyze target NFT details.");
      setLoading(false);
      return null;
    }
  };

  const analyzeUrl = async (url) => {
    const parseResult = parseOpenSeaUrl(url);
    if (!parseResult.isValid) {
      setError(parseResult.error);
      return null;
    }
    return runStepByStepLoader(parseResult.contractAddress, parseResult.tokenId);
  };

  const analyzeContractAndToken = async (contract, token) => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!contract || !ethAddressRegex.test(contract)) {
      setError("Please enter a valid Ethereum contract address (e.g. 0x...).");
      return null;
    }

    const tokenIdRegex = /^\d+$/;
    if (!token || !tokenIdRegex.test(token)) {
      setError("Please enter a valid numerical Token ID.");
      return null;
    }

    return runStepByStepLoader(contract, token);
  };

  const resetAnalysis = () => {
    setLoading(false);
    setSteps(INITIAL_STEPS);
    setResult(null);
    setError("");
  };

  return {
    loading,
    steps,
    result,
    error,
    analyzeUrl,
    analyzeContractAndToken,
    resetAnalysis,
    setError
  };
}
