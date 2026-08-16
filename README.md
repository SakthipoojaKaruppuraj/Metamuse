# MetaMuse

**MetaMuse explains why an NFT exists and anchors the evidence behind that explanation on Monad.**

---

## Problem

NFT marketplaces like OpenSea, Blur, and Magic Eden provide fundamental transactional data:
- Current ownership & token standards
- Asset metadata & visual traits
- Recent listing & sale prices
- Collection name & raw description

However, current platforms do **not** answer critical context questions:
- *Why was this NFT created in the first place?*
- *What project or cultural concept does it represent?*
- *What is the creator's intended purpose?*
- *What verifiable on-chain facts and external sources support the explanation?*

---

## Solution

MetaMuse transforms raw asset data into structured, evidence-backed intelligence:

$$\text{NFT Identity} + \text{Metadata} + \text{Ethereum Provenance} + \text{Project Context} + \text{Sources} \longrightarrow \text{"Why This NFT Exists"}$$

MetaMuse generates an evidence-backed explanation, computes deterministic Keccak-256 commitments of the structured analysis, and anchors those commitments permanently on the **Monad Testnet**.

---

## Architecture

```text
OpenSea API / Ethereum Mainnet RPC
               │
               ▼
       MetaMuse Backend
               │
 ┌─────────────┼─────────────┐
 ▼             ▼             ▼
Metadata   Provenance     Context
               │
               ▼
     Structured Evidence
               │
               ▼
  "Why This NFT Exists" Report
               │
               ▼
    Keccak-256 Commitments
   (evidenceHash, provenanceHash)
               │
               ▼
  Monad NFTProvenanceRegistry
               │
      ┌────────┴────────┐
      ▼                 ▼
   MATCH ✓         MISMATCH ✕
```

- **Ethereum Mainnet**: Source chain of the target NFT (resolving contract bytecode, `ownerOf`, `tokenURI`, and historical transfer logs).
- **Monad Testnet**: MetaMuse attestation and public verification layer (storing immutable cryptographic commitments).

---

## Features

- ✓ **OpenSea NFT Ingestion**: Real-time asset & collection parsing for Ethereum Mainnet ERC-721 tokens.
- ✓ **On-Chain EVM Provenance**: Historical `Transfer` log extraction, mint transaction resolution, and creator candidate tagging.
- ✓ **Project Context Mining**: Official project website fetching, collection claim extraction, and source attribution.
- ✓ **"Why This NFT Exists" Analysis**: Structured explainability separating verified on-chain facts, source-backed claims, and visual inferences.
- ✓ **Source Citation Engine**: In-line citations (`[1]`, `[2]`) mapping directly to clickable evidence cards.
- ✓ **MetaMuse Evidence Confidence**: Transparent 100-point scoring model evaluating contract code, mint logs, metadata completeness, and context sources.
- ✓ **Deterministic Commitments**: Keccak-256 evidence and provenance hashing invariant to AI prose re-wording.
- ✓ **Monad Attestation**: One-click MetaMask signing submitting commitments to the deployed `NFTProvenanceRegistry`.
- ✓ **On-Chain Verification (MATCH / MISMATCH)**: Public on-chain hash verification confirming whether current evidence matches previous attestations.

---

## Tech Stack

### Frontend & API
- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI Components**: React 19, Lucide Icons, Vanilla CSS design tokens
- **Type Safety**: TypeScript 5.7

### Blockchain & Web3
- **Smart Contract**: Solidity 0.8.24 (Foundry framework)
- **Attestation Chain**: Monad Testnet (Chain ID `10143`)
- **Client Integration**: Viem 2.55 (Multi-RPC fallback transport), MetaMask EIP-1193 bridge

### Data & Intelligence
- **NFT Metadata**: OpenSea API v2 & Ethereum Mainnet RPC (`publicnode`, `1rpc`, `tenderly`)
- **AI & Fallback**: Optional Google Gemini API with deterministic fallback generation

---

## Monad Smart Contract

The attestation registry is deployed and verified on **Monad Testnet**:

- **Contract Name**: `NFTProvenanceRegistry`
- **Network**: Monad Testnet
- **Chain ID**: `10143`
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Contract Address**: [`0xe0cb702a0702d33ee280bbce357e7ab54707b283`](https://monadvision.com/address/0xe0cb702a0702d33ee280bbce357e7ab54707b283)
- **Deployment Tx**: [`0x8ccedc3ebd5edb1a0303d98128209f208cc850a2ec67540bd5501774cca87262`](https://monadvision.com/tx/0x8ccedc3ebd5edb1a0303d98128209f208cc850a2ec67540bd5501774cca87262)
- **Verified ABI Path**: [`deployment/NFTProvenanceRegistry.abi.json`](file:///Users/apple/projects/metamuse/deployment/NFTProvenanceRegistry.abi.json)

### Core Functions
- `attestProvenance(address nftContract, uint256 tokenId, bytes32 evidenceHash, bytes32 provenanceHash)`: Records a new immutable attestation commitment.
- `getLatestAttestation(address nftContract, uint256 tokenId)`: Returns the latest block number, timestamp, attestor, version, and hashes.
- `verifyAttestation(address nftContract, uint256 tokenId, bytes32 evidenceHash, bytes32 provenanceHash)`: Returns `true` (MATCH) if the hashes match the latest on-chain record, or `false` (MISMATCH).

---

## Why Monad?

MetaMuse requires a high-performance, ultra-low-cost notary layer. 

Rather than storing heavy JSON payloads or images directly on-chain, MetaMuse stores lightweight 32-byte cryptographic commitments:
- `evidenceHash`
- `provenanceHash`
- `attestor`
- `timestamp`
- `version`

Monad’s high throughput and fast finality allow users to notarize and audit provenance assessments in seconds with minimal gas costs.

---

## Important Security Model

MetaMuse strictly differentiates between **Attestation Matching** and **Real-World Authenticity**:

- **MATCH ✓**: Indicates that the current MetaMuse structured evidence package and provenance graph match the previously attested commitment on Monad.
- **MISMATCH ✕**: Indicates that the current evidence package or underlying provenance differs from the previously attested package.

*MetaMuse does not claim that a MATCH proves absolute physical authenticity or copyright ownership.*

---

## Demo NFT & Judge Flow

### Recommended Demo Asset
- **Asset**: Lil Pudgys #1
- **OpenSea URL**: `https://opensea.io/assets/ethereum/0x524cab2ec69124574082676e6f654a18df49a048/1`

### Step-by-Step Walkthrough
1. **Analyze**: Open MetaMuse, navigate to `/analyze`, paste the OpenSea URL, and click **Analyze NFT**.
2. **Review Explanation**: Read the generated *"Why This NFT Exists"* section, which explains the collection purpose, mint details, and current owner.
3. **Inspect Citations**: Click citation badges (`[1]`, `[2]`) to jump directly to backing Evidence Cards.
4. **Audit Provenance**: Scroll to the **Provenance Tracker** to view the reconstructed `MINT` event (block `13837943`) and transfer timeline.
5. **Connect Wallet**: Click **Connect Wallet** in the header to pair your MetaMask wallet.
6. **Switch Network**: Allow MetaMuse to switch your wallet network to **Monad Testnet** (Chain ID `10143`).
7. **Attest**: Click **Attest on Monad**, approve the transaction in MetaMask, and wait for confirmation.
8. **Verify MATCH**: Notice the updated attestation status displaying `MATCH ✓` along with the live transaction hash and version number.
9. **Verify MISMATCH**: Click **Verify Mismatch Simulation** to test local hash tampering; notice the system correctly reports `MISMATCH ✕`.

---

## Setup & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/SakthipoojaKaruppuraj/Metamuse.git
cd Metamuse/frontend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_APP_MODE=real
OPENSEA_API_KEY=your_opensea_api_key
GEMINI_API_KEY=your_optional_gemini_api_key
ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To test the production build locally:
```bash
npm run build
npm start
```

---

## Smart Contract Development

The smart contract suite is managed via Foundry:

```bash
cd contract

# Compile contracts
forge build

# Run unit and fuzz tests
forge test
```

### Contract Deployment Command
To deploy to Monad Testnet using Foundry:
```bash
forge create --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  src/NFTProvenanceRegistry.sol:NFTProvenanceRegistry
```

---

## Automated Test Suites

MetaMuse includes 34 automated unit and E2E integration tests:

```bash
cd frontend

# Run all test suites
npx tsx --test test/backend-services.test.ts test/e2e-integration.test.ts test/context-explanation.test.ts
```

---

## Limitations

- **Marketplaces**: OpenSea is the primary supported marketplace for the hackathon MVP.
- **Source Chain**: Ethereum Mainnet is the primary NFT provenance source chain for this MVP.
- **Attestation Chain**: Monad Testnet is the primary attestation registry chain.
- **Context Depth**: Context extraction relies on official metadata, registered external links, and public chain records.
- **Authenticity Disclaimer**: MetaMuse provides cryptographic evidence commitments and explainability; it does not constitute legal title or copyright verification.
