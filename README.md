# Ganymede Arcade

Stellar-native game store MVP — browse, publish Windows builds to IPFS, pay or claim with Freighter (XLM).

UI: navy-black + silver **H2 Billboard** homepage (featured + stack).

## Setup

```bash
npm install
cp .env.example .env
# Add PINATA_JWT for real uploads
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite (`file:./dev.db` under `prisma/`) |
| `STELLAR_NETWORK` | `testnet` or `public` |
| `HORIZON_URL` | Horizon API (server) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network hint for Freighter UI |
| `NEXT_PUBLIC_HORIZON_URL` | Horizon API (browser payments) |
| `PINATA_JWT` | Pinata upload auth |
| `PINATA_GATEWAY` | IPFS gateway for covers/downloads |

## Freighter (testnet)

1. Install [Freighter](https://www.freighter.app).
2. Switch to **Testnet**.
3. Fund via [Stellar Laboratory / Friendbot](https://laboratory.stellar.org/#account-creator?network=test).

## Demo path

1. Connect Freighter on testnet.
2. Open **Publish** — upload cover (≤1MB), optional screenshots, Windows build (needs `PINATA_JWT`).
3. Open the game page — **Claim** (free) or **Buy with XLM** (paid).
4. Download the IPFS build when unlocked.

## Scripts

- `npm run dev` — local app
- `npm run build` / `npm start` — production
- `npm test` — Vitest (memo + payment verify)
- `npm run db:push` — apply Prisma schema

## Spec & plan

- `docs/superpowers/specs/2026-10-04-ganymede-arcade-design.md`
- `docs/superpowers/plans/2026-10-04-ganymede-arcade.md`
