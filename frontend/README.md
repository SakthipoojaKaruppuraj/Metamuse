# MetaMuse Web Application

This folder contains the Next.js 16 web application for **MetaMuse**.

Refer to the root [README.md](../README.md) for full project architecture, contract addresses, security specifications, and judge walkthroughs.

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run full automated test suite (39 tests)
npx tsx --test test/backend-services.test.ts test/e2e-integration.test.ts test/context-explanation.test.ts test/e2e-workflow.test.ts

# Check TypeScript types
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm start
```

---

## Key Directory Layout

- `app/`: Next.js App Router pages and API routes.
- `components/`: UI components (Form controls, Result headers, Attestation card, Provenance timeline).
- `lib/backend/`: Core ingestion, log reconstruction, context extraction, explanation generation, and hashing services.
- `lib/web3Service.ts`: MetaMask EIP-1193 provider & Monad contract interface.
- `test/`: 4 test suites covering parser, cache, mainnet RPC, context extraction, and E2E HTTP server workflows.
