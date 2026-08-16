# MetaMuse — NFT Provenance & Intelligence Platform

> **Explains why an NFT exists and anchors the evidence behind that explanation on Monad.**

- **Live Public Application**: [https://frontend-coral-pi-94.vercel.app](https://frontend-coral-pi-94.vercel.app)
- **Monad Contract**: [`0xe0cb702a0702d33ee280bbce357e7ab54707b283`](https://monadvision.com/address/0xe0cb702a0702d33ee280bbce357e7ab54707b283)
- **GitHub Repository**: [https://github.com/SakthipoojaKaruppuraj/Metamuse](https://github.com/SakthipoojaKaruppuraj/Metamuse)

---

## Table of Contents
- [Executive Overview](#executive-overview)
- [The Problem](#the-problem)
- [The MetaMuse Solution](#the-metamuse-solution)
- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Monad Smart Contract](#monad-smart-contract)
- [Why Monad?](#why-monad)
- [Security & Attestation Model](#security--attestation-model)
- [Project Directory Structure](#project-directory-structure)
- [Setup & Local Development](#setup--local-development)
- [Automated Test Suite](#automated-test-suite)
- [Judge & Demo Flow](#judge--demo-flow)
- [Limitations & Scope](#limitations--scope)

---

## Executive Overview

NFT marketplaces display prices, ownership records, and basic metadata attributes. However, they fail to answer fundamental provenance and identity questions: **Why was this artwork created? What project concept does it express? What on-chain evidence supports the explanation?**

**MetaMuse** bridges this gap by combining on-chain EVM log reconstruction, metadata analysis, and contextual intelligence to generate an evidence-backed report: **"Why This NFT Exists"**. It computes deterministic Keccak-256 cryptographic commitments of the analysis and anchors those commitments permanently on the **Monad Testnet**.

---

## The Problem

Current Web3 NFT infrastructure focuses heavily on transaction mechanics:
- **Marketplace Listings**: Floor prices, sales history, owner addresses.
- **Surface Metadata**: Token name, image URL, basic trait percentages.

**Critical Gaps**:
1. **Missing Context**: Marketplaces rarely capture the project's artistic vision, creator's declared purpose, or verified context.
2. **Unverified Claims**: Off-chain descriptions are mutable and prone to spoofing or loss.
3. **Lack of Evidence Hashing**: There is no standard for committing structured provenance & context off-chain to an immutable, low-cost notary ledger.

---

## The MetaMuse Solution

MetaMuse ingests an NFT identity, reconstructs its lifecycle from Ethereum Mainnet logs, extracts project context, and formats an evidence-backed explanation with in-line source citations:

$$\text{NFT Identity} + \text{Metadata} + \text{Ethereum Provenance} + \text{Project Context} \longrightarrow \text{"Why This NFT Exists" Report} \longrightarrow \text{Keccak-256 Commitments} \longrightarrow \text{Monad Attestation}$$

### Key Output Components:
1. **"Why This NFT Exists"**: Human-readable narrative detailing collection purpose, artistic concept, and mint details.
2. **Evidence Ledger**: Explicitly categorized evidence cards labeled as `VERIFIED`, `SOURCE-BACKED`, `INFERRED`, or `UNKNOWN`.
3. **Citation Engine**: In-line citations (`[1]`, `[2]`) linking claims directly to verifiable evidence sources.
4. **MetaMuse Confidence Meter**: Transparent 100-point scoring model evaluating contract code, mint logs, metadata pinning, and creator attribution.
5. **Monad Cryptographic Anchoring**: Immutable on-chain recording of `evidenceHash` and `provenanceHash` on Monad Testnet.

---

## System Architecture

```text
               ┌──────────────────────────────────────────────┐
               │    Ethereum Mainnet RPC / OpenSea Metadata   │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │              MetaMuse Backend                │
               │   • urlParser       • openseaService         │
               │   • ethereumService • provenanceService      │
               │   • contextService  • explanationService     │
               │   • evidenceService                          │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │      Structured Evidence & Explanation       │
               │  • Verified Facts    • Source-Backed Claims  │
               │  • Inferred Traits   • MetaMuse Confidence   │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │           Keccak-256 Hashing Engine          │
               │     (Canonical Evidence & Provenance)        │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │   Monad Testnet: NFTProvenanceRegistry.sol   │
               │        (Address: 0xe0cb702a...7b283)         │
               └──────────────────────┬───────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
                 MATCH ✓                       MISMATCH ✕
        (Hashes match attestation)      (Evidence altered locally)
```

---

## Core Features

- ✓ **OpenSea & EVM Ingestion**: Ingests Ethereum Mainnet ERC-721 tokens via URL or Contract + Token ID.
- ✓ **Log Reconstruction**: Scans `Transfer` event logs from block `0` to resolve mint transaction hashes, mint blocks, minter addresses, and full transfer timelines.
- ✓ **Context Extraction Engine**: Safely fetches official project headers and extracts collection purpose, artwork traits, and creator signatures.
- ✓ **"Why This NFT Exists" Report**: Generates structured, citation-backed narratives using optional Google Gemini API with instant deterministic fallbacks.
- ✓ **Dynamic In-line Citations**: Clickable citation tags (`[1]`, `[2]`) that smoothly scroll to backing evidence cards.
- ✓ **Transparent Confidence Scoring**: 100-point weight allocation:
  - On-chain Contract Validation: 25 pts
  - Metadata & Image Integrity: 20 pts
  - Mint Log Verification: 20 pts
  - Transfer History: 15 pts
  - Collection Purpose Context: 10 pts
  - Creator Signature Evidence: 5 pts
  - Official Project Source: 5 pts
- ✓ **Deterministic Keccak-256 Hashing**: Canonical serialization invariant to AI prose re-wording.
- ✓ **Monad Attestation**: EIP-1193 MetaMask integration for one-click attestation submission.
- ✓ **Verification Mode (MATCH / MISMATCH)**: Verifies current evidence against previous Monad attestations in real time.

---

## Tech Stack

### Smart Contracts
- **Language**: Solidity `0.8.24`
- **Framework**: Foundry (`forge build`, `forge test`)
- **Network**: Monad Testnet (Chain ID `10143`)

### Backend & API
- **Framework**: Next.js 16 (App Router, Turbopack, Server Actions)
- **EVM Client**: Viem `2.55` (Multi-RPC fallback transport with `llamarpc`, `ankr`, `publicnode`, `1rpc`, `tenderly`)
- **AI Intelligence**: Google Gemini 1.5 Flash (with deterministic fallback builder)

### Frontend & UI
- **Library**: React 19, TypeScript `5.7`
- **Styling**: Vanilla CSS design system tokens, Tailwind CSS utility classes, Lucide Icons

---

## Monad Smart Contract

The attestation registry contract is deployed and verified on the **Monad Testnet**:

- **Contract Name**: `NFTProvenanceRegistry`
- **Network**: Monad Testnet
- **Chain ID**: `10143`
- **RPC URL**: `https://testnet-rpc.monad.xyz`
- **Explorer**: [Monad Vision Explorer](https://monadvision.com)
- **Contract Address**: [`0xe0cb702a0702d33ee280bbce357e7ab54707b283`](https://monadvision.com/address/0xe0cb702a0702d33ee280bbce357e7ab54707b283)
- **Deployment Tx**: [`0x8ccedc3ebd5edb1a0303d98128209f208cc850a2ec67540bd5501774cca87262`](https://monadvision.com/tx/0x8ccedc3ebd5edb1a0303d98128209f208cc850a2ec67540bd5501774cca87262)
- **Latest Attestation Tx**: [`0x143dc04d4bd45833d5228677b56af118d52fd75ff1e3aa92ac975975052290d5`](https://monadvision.com/tx/0x143dc04d4bd45833d5228677b56af118d52fd75ff1e3aa92ac975975052290d5)
- **Verified ABI Artifact**: [`deployment/NFTProvenanceRegistry.abi.json`](file:///Users/apple/projects/metamuse/deployment/NFTProvenanceRegistry.abi.json)

### Contract Interface
```solidity
function attestProvenance(
    address nftContract,
    uint256 tokenId,
    bytes32 evidenceHash,
    bytes32 provenanceHash
) external;

function getLatestAttestation(
    address nftContract,
    uint256 tokenId
) external view returns (
    uint256 blockNumber,
    uint256 timestamp,
    address attestor,
    uint256 version,
    bytes32 evidenceHash,
    bytes32 provenanceHash
);

function verifyAttestation(
    address nftContract,
    uint256 tokenId,
    bytes32 evidenceHash,
    bytes32 provenanceHash
) external view returns (bool matches);
```

---

## Why Monad?

MetaMuse requires a fast, ultra-low-cost, sub-second notary chain. 

Rather than bloating the blockchain with large JSON payloads or media files:
1. **MetaMuse stores off-chain**: Rich evidence packages, full provenance logs, and context reports.
2. **MetaMuse stores on Monad**: 32-byte Keccak-256 cryptographic commitments (`evidenceHash`, `provenanceHash`).

Monad’s high throughput and instant finality allow users to notarize and audit provenance commitments in seconds for fractions of a cent in gas fees.

---

## Security & Attestation Model

MetaMuse distinguishes between **Attestation Commitment Matching** and **Real-World Authenticity**:

- **MATCH ✓**: Confirms that the current off-chain MetaMuse evidence package matches the exact cryptographic hash previously committed on Monad.
- **MISMATCH ✕**: Indicates that one or more evidence items or provenance records differ from the committed baseline.

> **Disclaimer**: MetaMuse provides evidence-backed intelligence and cryptographic commitments. A `MATCH` result indicates commitment consistency; it does not constitute a legal guarantee of physical title or copyright.

---

## Project Directory Structure

```text
metamuse/
├── README.md                      # Root Project Architecture & Documentation
├── .env.example                   # Root Environment Variable Template
├── contract/                      # Foundry Smart Contract Workspace
│   ├── src/
│   │   └── NFTProvenanceRegistry.sol
│   ├── test/
│   │   └── NFTProvenanceRegistry.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   └── foundry.toml
├── deployment/                    # Deployed Contract Artifacts
│   └── NFTProvenanceRegistry.abi.json
└── frontend/                      # Next.js 16 Web Application
    ├── app/                       # App Router Pages & API Routes
    │   ├── page.tsx               # Landing Page
    │   ├── analyze/page.tsx       # Identification & Input Page
    │   ├── nft/[id]/page.tsx      # Main Intelligence & Audit Report Page
    │   ├── api/nft/analyze/       # Unified Analysis API Route
    │   └── api/nft/details/       # Server Cache Retrieval Route
    ├── components/                # React Components
    │   ├── analyze/               # Input Form & Animated Loader
    │   ├── result/                # Header & Data Cards
    │   ├── attestation/           # Monad Web3 Wallet & Attest Card
    │   └── ui/                    # Design System Primitives
    ├── lib/                       # Business Logic & Backend Services
    │   ├── backend/
    │   │   ├── urlParser.ts       # SSRF-Safe OpenSea URL Parser
    │   │   ├── openseaService.ts   # OpenSea API Ingestion + Fallback
    │   │   ├── ethereumService.ts  # Viem EVM RPC & TokenURI Resolution
    │   │   ├── provenanceService.ts# Transfer Log & Mint Reconstruction
    │   │   ├── contextService.ts   # Context & Official Website Fetch
    │   │   ├── explanationService.ts # Gemini API & Deterministic Fallback
    │   │   ├── evidenceService.ts  # Hashing & Confidence Scoring
    │   │   └── cache.ts           # In-Memory Cache
    │   ├── web3Service.ts         # MetaMask & Monad Contract Interactions
    │   └── config.ts              # App Mode Settings
    └── test/                      # Test Suites
        ├── backend-services.test.ts # Parser & Cache Unit Tests
        ├── e2e-integration.test.ts # Live Ethereum Mainnet RPC Tests
        ├── context-explanation.test.ts # Phase 6 Context & Hash Tests
        └── e2e-workflow.test.ts   # Server API & Workflow Tests
```

---

## Setup & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/SakthipoojaKaruppuraj/Metamuse.git
   cd Metamuse/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Edit `.env.local`*:
   ```env
   NEXT_PUBLIC_APP_MODE=real
   OPENSEA_API_KEY=your_optional_opensea_key
   GEMINI_API_KEY=your_optional_gemini_key
   ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## Automated Test Suite

MetaMuse includes **39 automated unit, integration, and server workflow tests**:

```bash
cd frontend

# Run all 4 test suites
npx tsx --test test/backend-services.test.ts test/e2e-integration.test.ts test/context-explanation.test.ts test/e2e-workflow.test.ts
```

### Test Suite Summary
- `backend-services.test.ts`: URL validation, SSRF checks, memory caching.
- `context-explanation.test.ts`: Context extraction, claim categorization, AI fallbacks, evidenceHash stability.
- `e2e-integration.test.ts`: Live Ethereum Mainnet contract bytecode checks, `ownerOf`, `tokenURI`, mint log detection.
- `e2e-workflow.test.ts`: Live HTTP server workflow testing `GET /`, `GET /analyze`, `POST /api/nft/analyze`, `GET /api/nft/details`.

---

## Judge & Demo Flow

### Recommended Demo Asset
- **Asset**: Lil Pudgys #1
- **OpenSea URL**: `https://opensea.io/assets/ethereum/0x524cab2ec69124574082676e6f654a18df49a048/1`

### Step-by-Step Walkthrough
1. **Analyze**: Open MetaMuse, go to `/analyze`, paste the OpenSea URL, and click **Analyze NFT**.
2. **Review Explanation**: Inspect the generated *"Why This NFT Exists"* section, which explains the collection purpose, mint details, and current owner.
3. **Inspect Citations**: Click citation badges (`[1]`, `[2]`) to scroll smoothly to backing Evidence Cards.
4. **Audit Provenance**: Scroll to **Provenance Tracker** to inspect the mint transaction (block `13837943`) and transfer timeline.
5. **Connect Wallet**: Click **Connect Wallet** in the top navigation to connect your MetaMask wallet.
6. **Switch Network**: Allow MetaMuse to switch your wallet network to **Monad Testnet** (Chain ID `10143`).
7. **Attest**: Click **Attest on Monad**, approve the transaction in MetaMask, and receive confirmation.
8. **Verify MATCH**: Observe the status badge update to `MATCH ✓` displaying the live transaction hash and version number.
9. **Verify MISMATCH**: Click **Verify Mismatch Simulation** to test local evidence tampering; observe the system report `MISMATCH ✕`.

---

## Limitations & Scope

- **Supported Marketplace**: OpenSea is the primary supported marketplace URL format for the MVP.
- **Source Chain**: Ethereum Mainnet ERC-721 tokens are the primary source chain.
- **Attestation Chain**: Monad Testnet is the primary attestation chain.
- **Context Depth**: Context research is based on metadata, registered project links, and public chain records.
