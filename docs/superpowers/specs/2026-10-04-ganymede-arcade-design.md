# Ganymede Arcade — MVP Design Spec

**Date:** 2026-10-04  
**Status:** Approved for implementation planning  
**Scope:** MVP / prototype only — not a full Steam-class product

## 1. Product summary

Ganymede Arcade is a Stellar-native game publishing and distribution store (itch.io / Steam-like) where:

1. Players browse live game pages by genre, with free or XLM prices.
2. Developers publish simple game pages (description, screenshots, Windows build).
3. Buyers connect a Freighter wallet, pay (or claim free) in XLM, and download builds.
4. Developers receive XLM directly to their wallet — lower payout friction than traditional stores.

**Out of scope for MVP:** password accounts, reviews, wishlists, multi-platform builds, platform fee splits, admin CMS, mobile apps, mainnet-only operation, complex KYC/tax tooling.

## 2. Architecture

```
Browser (Freighter)
    ↓ connect / sign XLM payments
Next.js App Router (UI + API routes)
    ↓ Prisma
SQLite (games, purchases)
    ↓ upload / pin
IPFS (Pinata) — screenshots + Windows builds
    ↓ verify payments
Stellar Horizon (testnet default; mainnet via env)
```

**Approach:** Next.js full-stack MVP (single repo). SQLite for local demo speed; Postgres-swappable later via Prisma.

## 3. Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Global CSS design tokens + component CSS (no purple-neon theme) |
| DB | Prisma + SQLite |
| Wallet | Freighter |
| Chain | Stellar SDK + Horizon |
| Network | `STELLAR_NETWORK=testnet\|public` + Horizon URL via env |
| Files | IPFS via Pinata (CIDs stored on Game rows) |
| Auth | Wallet address only (no email/password) |

## 4. Roles & surfaces

**Roles**

- **Visitor** — browse store and game pages without a wallet.
- **Buyer** — connect wallet → buy / claim → download when entitled.
- **Developer** — connect wallet → publish → receive XLM to that wallet.

**Routes**

| Route | Purpose |
|--------|---------|
| `/` | Store home (H2 Billboard + featured rail) |
| `/games/[slug]` | Game detail, buy/claim, download |
| `/publish` | Developer publish form |
| API routes | CRUD games, IPFS upload helpers, purchase verify / entitlement |

## 5. Data model

### Game

- `id`, `slug` (unique)
- `title`, `description`
- `genre` (string enum for MVP: e.g. Action, Puzzle, Strategy, Adventure, Other)
- `priceXlm` — `Decimal`; `0` means free
- `developerWallet` — Stellar public key
- `coverCid`, `screenshotCids` (JSON array), `buildCid`, `buildFilename`
- `published` (boolean), `createdAt`, `updatedAt`

### Purchase

- `id`, `gameId`, `buyerWallet`
- `txHash` — nullable for free claims
- `amountXlm`
- `createdAt`
- Unique constraint: `(gameId, buyerWallet)` for MVP entitlement

## 6. Core flows

### Browse

1. Home loads published games.
2. Genre filter updates the grid / rail.
3. Open `/games/[slug]`.

### Publish

1. Freighter connect required.
2. Form: title, description, genre, price (XLM or free), cover, screenshots, Windows build.
3. Client validates screenshots (target ~1920×1080, max 1MB each).
4. Upload assets to IPFS → receive CIDs.
5. Persist `Game` with `developerWallet` = connected address.
6. Redirect to game page.

### Buy / claim / download

1. Freighter connect required for purchase and download unlock.
2. **Free:** create `Purchase` with `amountXlm = 0`, no chain tx → unlock download.
3. **Paid:** client builds native XLM payment to `developerWallet` for exact `priceXlm`, with text memo `ganymede:<gameId>` (truncated if needed for Stellar’s 28-byte memo limit); user signs in Freighter.
4. Server verifies via Horizon: success, amount, destination, source matches buyer, memo matches.
5. Persist `Purchase` with `txHash` → unlock IPFS gateway download URL.
6. If purchase already exists for wallet + game, skip pay and allow download.

## 7. Wallet, payments & errors

- Freighter only for MVP.
- Env selects testnet vs public + Horizon URL.
- Paid games: full amount to developer (no platform cut in MVP).
- Free games: wallet connect + DB entitlement only.

**User-facing errors**

- Freighter missing / locked / wrong network → clear guidance.
- Insufficient XLM / rejected signature → no Purchase row.
- IPFS upload failure → abort publish; no partial Game row.
- Unverified / failed tx → no download unlock.

## 8. UI / UX (approved)

### Visual system — Meridian Vault palette

| Token | Value / role |
|--------|----------------|
| `--bg` | `#05080e` / `#070b12` navy-black |
| `--surface` | `#0a1018` / `#152033` |
| `--text` | `#f0f4fa` silver-white |
| `--muted` | `#8fa0b5` |
| `--accent` | `#9eb4cc` / `#dce6f2` silver |
| `--border` | `rgba(158,180,204,0.2–0.4)` |

Typography: refined UI sans for chrome; serif display for “Arcade” / major headlines. Avoid loud neon, magenta/yellow carnival, and champagne-gold accents.

### Homepage — H2 Billboard (approved)

1. Slim top bar: `GANYMEDE` wordmark · Store · Publish · outline Connect wallet.
2. **Billboard hero:** full-width cinematic panel (featured art / gradient), brand line, headline (“Games worth shipping.”), short support line, primary Browse CTA + Publish text link.
3. **On the floor:** genre filters + **featured large tile + side stack**, then a secondary cover row.

Game detail and publish pages use the same palette, type, borders, and button language (silver fill / silver outline). Light motion only (hover, subtle billboard fade) — presence, not noise.

### Asset rules (publish)

- Screenshots: aim 1920×1080; max 1MB each.
- Build: Windows for MVP; stored on IPFS by CID.

## 9. Testing (MVP)

- Manual: Freighter testnet → publish → free claim → paid buy → download.
- Light unit checks: price/genre helpers; payment verification parsing (amount, destination, memo).
- No full automated Freighter E2E suite in MVP.

## 10. Success criteria

Someone can browse the store, publish a Windows game to IPFS, pay or claim with Freighter on Stellar testnet, and download the build — with a professional navy/silver H2 Billboard UI.

## 11. Decisions log

| Decision | Choice |
|----------|--------|
| Network | Testnet default, mainnet-ready via env |
| Stack | Next.js + Freighter + Stellar SDK |
| Files | IPFS |
| Metadata | Prisma + SQLite |
| Payments | Free + paid; paid = direct XLM to developer |
| Architecture | Next.js full-stack MVP |
| Visual palette | Meridian navy-black + silver |
| Homepage | H2 Billboard + featured/stack |
