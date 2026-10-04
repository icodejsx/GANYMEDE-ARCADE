# Ganymede Arcade

Stellar-native game store MVP — browse, publish Windows builds to IPFS, pay or claim with Freighter (XLM).

## Setup

```bash
npm install
cp .env.example .env
# Add PINATA_JWT when you are ready to upload assets
npx prisma db push   # after Task 2 schema exists
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite path (`file:./dev.db`) |
| `STELLAR_NETWORK` | `testnet` or `public` |
| `HORIZON_URL` | Horizon API base URL |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network hint for the browser wallet UI |
| `PINATA_JWT` | Pinata upload auth |
| `PINATA_GATEWAY` | IPFS gateway base for downloads |

## Freighter (testnet)

1. Install [Freighter](https://www.freighter.app).
2. Switch the wallet to **Testnet**.
3. Fund via the [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test) / Friendbot faucet.

## Scripts

- `npm run dev` — local Next.js app
- `npm run build` / `npm start` — production
- `npm test` — Vitest unit tests
- `npm run db:push` — apply Prisma schema
