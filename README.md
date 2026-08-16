# MetaMuse — NFT Provenance Registry

MetaMuse is an explainability and provenance auditing platform for digital art and NFTs. It answers the fundamental question: **"Why does this NFT exist?"**

This repository contains the smart contract layer deployed on the Monad Testnet that serves as an immutable, publicly verifiable registry for provenance assessments.

---

## Smart Contract Architecture

The `NFTProvenanceRegistry` contract acts as a public notary. Rather than storing verbose evidence packages, media assets, or AI outputs on-chain, it stores **cryptographic hash commitments** to off-chain assessments. This design keeps execution simple, highly secure, and gas-efficient.

### Key Components

- **Source Chain**: Ethereum (where the actual ERC-721 NFTs live).
- **Registry Chain**: Monad Testnet (where the attestations are permanently anchored).
- **Identity Model**: Each NFT is referenced using its original contract address and token ID (`address nftContract` and `uint256 tokenId`).
- **Attestation Commitment**: Each record is stored using the `Attestation` struct:
  ```solidity
  struct Attestation {
      bytes32 evidenceHash;      // Off-chain audit package commitment
      bytes32 provenanceHash;    // Off-chain timeline commitment
      address attestor;          // msg.sender of the attestation
      uint64 timestamp;          // block.timestamp
      uint64 version;            // Monotonically increasing version per NFT
  }
  ```

---

## Deployment & Verification Handoff

- **Network**: Monad Testnet
- **Chain ID**: `10143`
- **Registry Address**: `0xe0cb702a0702d33ee280bbce357e7ab54707b283`
- **Deployer**: `0x121c42443b663afad01caedf842284c7ef4c79b4`
- **Deployment Transaction**: `0x8ccedc3ebd5edb1a0303d98128209f208cc850a2ec67540bd5501774cca87262`
- **Deployment Block**: `54165821`
- **Explorer URL**: [MonadVision Explorer](https://monadvision.com/address/0xe0cb702a0702d33ee280bbce357e7ab54707b283)
- **Source Verification Status**: Verified (via Sourcify API)

---

## Contract Interface & Integration

The contract exposes four key functions:

### 1. Register Attestation
```solidity
function attestProvenance(
    address nftContract,
    uint256 tokenId,
    bytes32 evidenceHash,
    bytes32 provenanceHash
) external returns (uint256 version);
```
- Emits event: `ProvenanceAttested(nftContract, tokenId, version, evidenceHash, provenanceHash, attestor, timestamp)`.
- Reverts if address or hashes are zero-initialized.

### 2. Retrieve Latest Attestation
```solidity
function getLatestAttestation(
    address nftContract,
    uint256 tokenId
) external view returns (Attestation memory);
```
- Returns the latest attestation struct for the given NFT.
- If no attestation exists, returns a zero-initialized struct (`version = 0`) to prevent read-only RPC calls from reverting, facilitating smooth frontend rendering.

### 3. Retrieve Historical Versions
```solidity
function getAttestationHistory(
    address nftContract,
    uint256 tokenId
) external view returns (Attestation[] memory);
```
- Returns all versions recorded for a given NFT.

### 4. Verify Evidence
```solidity
function verifyAttestation(
    address nftContract,
    uint256 tokenId,
    bytes32 currentEvidenceHash
) external view returns (bool);
```
- Compares the `currentEvidenceHash` against the latest registered record's `evidenceHash`.
- Returns `true` on match (MATCH) or `false` on mismatch (MISMATCH).

---

## Live Demo Transaction

- **Attestation Write Transaction**: `0x59a1afcd386f3e60ea9630eeb1e7abfc671458b502ff2583d027b925adff76b6`
- **Target NFT**: Contract `0x7a3F4C9d2b8E1a05C6f3D9E2B7a1c4f5E6D091c2` (Token ID `1837`)
- **MATCH query output**: `true` (`0x1`)
- **MISMATCH query output**: `false` (`0x0`)

---

## Development & Test Commands

Developed using **Solidity ^0.8.24** and **Foundry**.

### Compile contracts
```bash
cd contract
forge build
```

### Run local unit and fuzz tests
```bash
cd contract
forge test -vv
```
