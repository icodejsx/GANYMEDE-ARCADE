# Ganymede Arcade MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Stellar testnet MVP store where developers publish Windows games to IPFS and buyers pay/claim with Freighter XLM under the approved H2 Billboard navy/silver UI.

**Architecture:** Next.js App Router full-stack app with Prisma/SQLite for game + purchase metadata, Pinata for IPFS asset hosting, Freighter + Stellar SDK for wallet connect and native XLM payments verified via Horizon.

**Tech Stack:** Next.js (App Router) · TypeScript · Prisma · SQLite · Freighter API · `@stellar/stellar-sdk` · Pinata · Vitest · CSS design tokens

## Global Constraints

- MVP / prototype only — no password auth, reviews, platform fees, or multi-platform builds
- Stellar network from env: `STELLAR_NETWORK=testnet|public` + matching Horizon URL
- Paid purchases: full XLM amount to `developerWallet`; memo format `ganymede:<gameId>` (respect 28-byte memo limit)
- Free games: wallet connect + DB entitlement only (`txHash` null)
- Screenshots: target 1920×1080, max 1MB; builds: Windows only
- UI: Meridian navy/silver tokens; homepage = H2 Billboard + featured/stack (see design spec)
- Spec: `docs/superpowers/specs/2026-10-04-ganymede-arcade-design.md`

---

## File map

| Path | Responsibility |
|------|----------------|
| `package.json` | Scripts and dependencies |
| `prisma/schema.prisma` | Game + Purchase models |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/stellar/config.ts` | Network + Horizon from env |
| `src/lib/stellar/memo.ts` | Build/parse payment memos |
| `src/lib/stellar/verify-payment.ts` | Horizon payment verification |
| `src/lib/ipfs/pinata.ts` | Pinata upload helpers |
| `src/lib/games.ts` | Game create/list/get helpers |
| `src/lib/purchases.ts` | Entitlement + purchase create |
| `src/lib/slug.ts` | Slugify titles |
| `src/app/api/games/route.ts` | GET list / POST create |
| `src/app/api/games/[slug]/route.ts` | GET one game |
| `src/app/api/purchases/route.ts` | POST claim/verify purchase |
| `src/app/api/uploads/route.ts` | POST file → Pinata CID |
| `src/components/wallet/WalletProvider.tsx` | Freighter connect state |
| `src/components/wallet/ConnectButton.tsx` | Header connect control |
| `src/components/layout/SiteHeader.tsx` | Top bar |
| `src/components/home/BillboardHero.tsx` | H2 billboard |
| `src/components/home/FloorSection.tsx` | Featured + stack + row |
| `src/components/games/GameCard.tsx` | Cover tile |
| `src/app/globals.css` | Design tokens + base styles |
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Store home |
| `src/app/games/[slug]/page.tsx` | Game detail |
| `src/app/publish/page.tsx` | Publish form |
| `src/lib/stellar/memo.test.ts` | Memo unit tests |
| `src/lib/stellar/verify-payment.test.ts` | Verify unit tests |
| `.env.example` | Required env vars |
| `README.md` | Run / Freighter / Pinata setup |

---

### Task 1: Scaffold Next.js app + design tokens + shell

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/layout/SiteHeader.tsx`, `.env.example`, `README.md`
- Modify: none (greenfield)

**Interfaces:**
- Consumes: none
- Produces: runnable Next app; CSS vars `--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--border`; `SiteHeader` with placeholder Connect

- [ ] **Step 1: Scaffold the app**

```bash
cd /Users/user/GANYMEDE-ARCADE
npx create-next-app@latest . --typescript --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

If the directory is not empty, scaffold into a temp folder and move files, or init manually with the same flags. Install deps:

```bash
npm install @prisma/client @stellar/stellar-sdk @creit.tech/stellar-wallets-kit
npm install -D prisma vitest @vitejs/plugin-react jsdom
```

Prefer Freighter via `@stellar/freighter-api` if the kit is heavier than needed:

```bash
npm install @stellar/freighter-api
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

- [ ] **Step 2: Add design tokens and shell**

`src/app/globals.css`:

```css
:root {
  --bg: #05080e;
  --bg-elevated: #070b12;
  --surface: #0a1018;
  --surface-2: #152033;
  --text: #f0f4fa;
  --muted: #8fa0b5;
  --accent: #9eb4cc;
  --accent-strong: #dce6f2;
  --border: rgba(158, 180, 204, 0.28);
  --font-display: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-ui: "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
```

`src/components/layout/SiteHeader.tsx` — wordmark `GANYMEDE`, links Store `/` + Publish `/publish`, placeholder Connect button (outline silver). Style with the tokens.

`src/app/layout.tsx` — import globals, render `SiteHeader` + `{children}`.

`src/app/page.tsx` — temporary “Ganymede Arcade” stub heading.

`.env.example`:

```env
DATABASE_URL="file:./dev.db"
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
PINATA_JWT=
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

`README.md` — how to `npm install`, copy `.env.example`, `npm run db:push`, `npm run dev`, Freighter testnet, Pinata JWT.

- [ ] **Step 3: Verify shell runs**

```bash
npm run dev
```

Expected: app loads at `http://localhost:3000` with navy background and header.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Meridian design tokens"
```

---

### Task 2: Prisma schema + database client

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db.ts`, `src/lib/slug.ts`
- Modify: `.env` (local, not committed)

**Interfaces:**
- Consumes: `DATABASE_URL`
- Produces: `prisma` singleton; `Game` / `Purchase` models; `slugify(title: string): string`

- [ ] **Step 1: Write schema**

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Game {
  id               String     @id @default(cuid())
  slug             String     @unique
  title            String
  description      String
  genre            String
  priceXlm         String
  developerWallet  String
  coverCid         String
  screenshotCids   String
  buildCid         String
  buildFilename    String
  published        Boolean    @default(true)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  purchases        Purchase[]
}

model Purchase {
  id          String   @id @default(cuid())
  gameId      String
  buyerWallet String
  txHash      String?
  amountXlm   String
  createdAt   DateTime @default(now())
  game        Game     @relation(fields: [gameId], references: [id])

  @@unique([gameId, buyerWallet])
}
```

Note: SQLite-friendly strings for decimals and JSON (`screenshotCids` as JSON string array).

- [ ] **Step 2: Add client + slug helper**

`src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

`src/lib/slug.ts`:

```ts
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "game";
}
```

- [ ] **Step 3: Push DB**

```bash
cp .env.example .env
npx prisma db push
```

Expected: `dev.db` created; no errors.

- [ ] **Step 4: Commit**

```bash
git add prisma src/lib/db.ts src/lib/slug.ts
git commit -m "feat: add Prisma Game and Purchase models"
```

---

### Task 3: Stellar memo helpers (TDD)

**Files:**
- Create: `src/lib/stellar/memo.ts`, `src/lib/stellar/memo.test.ts`, `src/lib/stellar/config.ts`
- Test: `src/lib/stellar/memo.test.ts`

**Interfaces:**
- Consumes: `STELLAR_NETWORK`, `HORIZON_URL`
- Produces:
  - `getStellarConfig(): { network: "testnet" | "public"; horizonUrl: string; networkPassphrase: string }`
  - `buildPaymentMemo(gameId: string): string`
  - `parsePaymentMemo(memo: string): string | null` — returns gameId

- [ ] **Step 1: Write failing tests**

`src/lib/stellar/memo.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildPaymentMemo, parsePaymentMemo } from "./memo";

describe("payment memo", () => {
  it("builds a ganymede memo under 28 bytes", () => {
    const memo = buildPaymentMemo("clxyz1234567890");
    expect(memo.startsWith("ganymede:")).toBe(true);
    expect(new TextEncoder().encode(memo).length).toBeLessThanOrEqual(28);
  });

  it("parses a valid memo", () => {
    expect(parsePaymentMemo("ganymede:abc")).toBe("abc");
  });

  it("returns null for invalid memo", () => {
    expect(parsePaymentMemo("nope")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npm test -- src/lib/stellar/memo.test.ts
```

Expected: FAIL (module not found / functions missing).

- [ ] **Step 3: Implement**

`src/lib/stellar/config.ts`:

```ts
import { Networks } from "@stellar/stellar-sdk";

export function getStellarConfig() {
  const network = process.env.STELLAR_NETWORK === "public" ? "public" : "testnet";
  const horizonUrl =
    process.env.HORIZON_URL ||
    (network === "public"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org");
  const networkPassphrase =
    network === "public" ? Networks.PUBLIC : Networks.TESTNET;
  return { network, horizonUrl, networkPassphrase };
}
```

`src/lib/stellar/memo.ts`:

```ts
const PREFIX = "ganymede:";
const MAX_BYTES = 28;

export function buildPaymentMemo(gameId: string): string {
  const budget = MAX_BYTES - PREFIX.length;
  const id = gameId.slice(0, budget);
  return `${PREFIX}${id}`;
}

export function parsePaymentMemo(memo: string): string | null {
  if (!memo.startsWith(PREFIX)) return null;
  const id = memo.slice(PREFIX.length);
  return id.length > 0 ? id : null;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- src/lib/stellar/memo.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/stellar
git commit -m "feat: add Stellar config and payment memo helpers"
```

---

### Task 4: Payment verification helper (TDD)

**Files:**
- Create: `src/lib/stellar/verify-payment.ts`, `src/lib/stellar/verify-payment.test.ts`

**Interfaces:**
- Consumes: `getStellarConfig()`, `parsePaymentMemo()`, Horizon fetch
- Produces:
  - `verifyXlmPayment(params: { txHash: string; expectedDestination: string; expectedAmountXlm: string; expectedBuyer: string; expectedGameId: string }): Promise<{ ok: true } | { ok: false; reason: string }>`

- [ ] **Step 1: Write failing tests with mocked fetch**

`src/lib/stellar/verify-payment.test.ts` — mock `global.fetch` to return a Horizon transaction + operations payload where:

- payment type is `payment`
- `asset_type` is `native`
- `to` matches destination
- `from` matches buyer
- `amount` matches
- memo text matches `buildPaymentMemo(gameId)`

Assert `ok: true` for happy path and `ok: false` when amount mismatches.

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/stellar/verify-payment.test.ts
```

- [ ] **Step 3: Implement verify-payment.ts**

Use Horizon:

1. `GET {horizonUrl}/transactions/{txHash}` — require `successful === true`, read memo
2. `GET {horizonUrl}/transactions/{txHash}/operations` — find native payment op
3. Compare destination, source/buyer, amount (string compare after normalizing trailing zeros), memo game id

Return `{ ok: false, reason }` on any mismatch.

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/stellar/verify-payment.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/stellar/verify-payment.ts src/lib/stellar/verify-payment.test.ts
git commit -m "feat: verify Stellar XLM payments via Horizon"
```

---

### Task 5: Pinata upload API

**Files:**
- Create: `src/lib/ipfs/pinata.ts`, `src/app/api/uploads/route.ts`

**Interfaces:**
- Consumes: `PINATA_JWT`, `PINATA_GATEWAY`
- Produces:
  - `uploadToPinata(file: File | Buffer, filename: string): Promise<{ cid: string }>`
  - `ipfsUrl(cid: string): string`
  - `POST /api/uploads` multipart → `{ cid, url, filename }`

- [ ] **Step 1: Implement Pinata client**

`src/lib/ipfs/pinata.ts` — `fetch("https://uploads.pinata.cloud/v3/files", …)` with Bearer JWT; return CID. `ipfsUrl(cid)` uses `PINATA_GATEWAY`.

- [ ] **Step 2: Implement upload route**

`src/app/api/uploads/route.ts`:

- Accept `multipart/form-data` with field `file`
- Reject if missing JWT (500 with clear message)
- For images: reject if size > 1MB
- Return JSON `{ cid, url, filename }`

- [ ] **Step 3: Manual smoke (optional if no JWT yet)**

Without JWT, route should return a clear error. With JWT, upload a tiny PNG and confirm CID.

- [ ] **Step 4: Commit**

```bash
git add src/lib/ipfs src/app/api/uploads
git commit -m "feat: add Pinata IPFS upload API"
```

---

### Task 6: Games domain + API

**Files:**
- Create: `src/lib/games.ts`, `src/app/api/games/route.ts`, `src/app/api/games/[slug]/route.ts`
- Test: optional slug uniqueness check in `src/lib/slug.ts` if extended

**Interfaces:**
- Consumes: `prisma`, `slugify`
- Produces:
  - `listPublishedGames(genre?: string)`
  - `getGameBySlug(slug: string)`
  - `createGame(input)` 
  - `GET/POST /api/games`, `GET /api/games/[slug]`

- [ ] **Step 1: Implement `src/lib/games.ts`**

```ts
export type CreateGameInput = {
  title: string;
  description: string;
  genre: string;
  priceXlm: string; // "0" for free
  developerWallet: string;
  coverCid: string;
  screenshotCids: string[];
  buildCid: string;
  buildFilename: string;
};

export async function listPublishedGames(genre?: string) { /* prisma findMany published, optional genre */ }
export async function getGameBySlug(slug: string) { /* findUnique */ }
export async function createGame(input: CreateGameInput) {
  // slugify title; if collision append short suffix
  // store screenshotCids as JSON.stringify
}
```

- [ ] **Step 2: Wire API routes**

`POST /api/games` body = `CreateGameInput`; validate required fields; `developerWallet` required; return created game.

`GET /api/games?genre=` list.

`GET /api/games/[slug]` 404 if missing.

- [ ] **Step 3: Smoke with curl**

```bash
curl -s http://localhost:3000/api/games | jq .
```

Expected: `[]` initially.

- [ ] **Step 4: Commit**

```bash
git add src/lib/games.ts src/app/api/games
git commit -m "feat: add games list and create API"
```

---

### Task 7: Purchases / entitlement API

**Files:**
- Create: `src/lib/purchases.ts`, `src/app/api/purchases/route.ts`

**Interfaces:**
- Consumes: `prisma`, `verifyXlmPayment`, `getGameBySlug` / game by id
- Produces:
  - `hasEntitlement(gameId, buyerWallet): Promise<boolean>`
  - `POST /api/purchases` body:
    - free: `{ gameId, buyerWallet }`
    - paid: `{ gameId, buyerWallet, txHash }`
  - Response: `{ entitled: true, downloadUrl }` or error

- [ ] **Step 1: Implement purchases helpers**

- If existing unique purchase → return entitlement + `ipfsUrl(buildCid)`
- Free path: `priceXlm === "0"` → create purchase `txHash: null`
- Paid path: call `verifyXlmPayment` then create purchase

- [ ] **Step 2: Wire `POST /api/purchases`**

Validate inputs; never return download URL unless entitled.

- [ ] **Step 3: Manual logic check**

Create a free game via API, POST purchase without txHash, confirm download URL returned.

- [ ] **Step 4: Commit**

```bash
git add src/lib/purchases.ts src/app/api/purchases
git commit -m "feat: add free claim and paid purchase verification API"
```

---

### Task 8: Freighter wallet provider + Connect button

**Files:**
- Create: `src/components/wallet/WalletProvider.tsx`, `src/components/wallet/ConnectButton.tsx`
- Modify: `src/app/layout.tsx`, `src/components/layout/SiteHeader.tsx`

**Interfaces:**
- Consumes: `@stellar/freighter-api` (`isConnected`, `requestAccess`, `getAddress`, `getNetwork`)
- Produces: React context `{ address: string | null; network: string | null; connect(); disconnect(); error: string | null }`

- [ ] **Step 1: Implement WalletProvider**

On connect: request access, read address, verify network matches `STELLAR_NETWORK` (expose public network name via `NEXT_PUBLIC_STELLAR_NETWORK`). If wrong network, set error string instructing user to switch in Freighter.

- [ ] **Step 2: ConnectButton**

Outline silver when disconnected; show truncated address when connected.

- [ ] **Step 3: Wire into layout/header**

Wrap app in `WalletProvider`; replace placeholder with `ConnectButton`.

- [ ] **Step 4: Manual check in browser with Freighter installed**

Expected: connect shows address; wrong network shows message.

- [ ] **Step 5: Commit**

```bash
git add src/components/wallet src/app/layout.tsx src/components/layout/SiteHeader.tsx
git commit -m "feat: add Freighter wallet connect"
```

---

### Task 9: Homepage H2 Billboard UI

**Files:**
- Create: `src/components/home/BillboardHero.tsx`, `src/components/home/FloorSection.tsx`, `src/components/games/GameCard.tsx`
- Modify: `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: `listPublishedGames` (server component fetch via prisma directly)
- Produces: approved H2 layout

- [ ] **Step 1: Implement BillboardHero**

Per spec: cinematic full-width panel, brand line, headline “Games worth shipping.”, support line about XLM, Browse (scroll/anchor to `#floor`) + Publish link.

- [ ] **Step 2: Implement FloorSection**

Genre filter chips (All + genres). Featured = newest or first game large tile; next two in side stack; remaining in 4-column row. Empty state copy when no games.

- [ ] **Step 3: Wire `page.tsx` as server component**

Load games with prisma; pass to sections. Use `ipfsUrl` for covers.

- [ ] **Step 4: Visual check**

`npm run dev` — matches approved navy/silver H2 composition (no neon).

- [ ] **Step 5: Commit**

```bash
git add src/components/home src/components/games src/app/page.tsx src/app/globals.css
git commit -m "feat: implement H2 Billboard store homepage"
```

---

### Task 10: Game detail page + buy/claim/download

**Files:**
- Create: `src/app/games/[slug]/page.tsx`, `src/components/games/GamePurchasePanel.tsx`
- Modify: none required beyond shared styles

**Interfaces:**
- Consumes: wallet context, `GET` game, `POST /api/purchases`, Freighter `signTransaction` / payment submit via Stellar SDK
- Produces: detail view with screenshots, price, Buy/Claim, Download when entitled

- [ ] **Step 1: Server-render game page**

Load by slug; 404 if missing. Show cover, title, genre, description, screenshot gallery, price/FREE.

- [ ] **Step 2: Client purchase panel**

- Not connected → prompt Connect
- Connected + check entitlement via purchases GET or POST idempotent
- Free → POST claim
- Paid → build payment tx with SDK (`Operation.payment`, native XLM, memo), sign with Freighter, submit to Horizon, POST `/api/purchases` with `txHash`
- On success → show Download button linking to IPFS build URL (`download` attribute / new tab)

- [ ] **Step 3: Manual testnet path**

Publish fixture game (or seed); claim free; confirm download link.

- [ ] **Step 4: Commit**

```bash
git add src/app/games src/components/games/GamePurchasePanel.tsx
git commit -m "feat: add game detail buy claim and download"
```

---

### Task 11: Publish page

**Files:**
- Create: `src/app/publish/page.tsx`, `src/components/publish/PublishForm.tsx`

**Interfaces:**
- Consumes: wallet, `/api/uploads`, `/api/games`
- Produces: published game redirect to `/games/[slug]`

- [ ] **Step 1: Build PublishForm**

Fields: title, description, genre select, price XLM (0 = free), cover image, screenshots (multi), Windows build file.

Client validation: image ≤ 1MB; warn if not ~16:9 / 1920×1080 (allow proceed with warning for MVP).

Require wallet connect; set `developerWallet` from address.

Upload order: cover → screenshots → build via `/api/uploads`; then `POST /api/games`.

- [ ] **Step 2: Style to Meridian system**

Same borders, silver buttons, navy surfaces — professional, not loud.

- [ ] **Step 3: End-to-end manual publish on testnet**

With Pinata JWT set, publish a tiny zip + png; confirm it appears on home and detail page.

- [ ] **Step 4: Commit**

```bash
git add src/app/publish src/components/publish
git commit -m "feat: add developer publish flow with IPFS uploads"
```

---

### Task 12: Polish, empty states, README verification

**Files:**
- Modify: `README.md`, `src/app/globals.css`, any rough edges in header/home/publish
- Create: `src/lib/seed.ts` optional only if needed for demo — skip if real publish works

**Interfaces:**
- Consumes: full app
- Produces: demo-ready MVP

- [ ] **Step 1: Empty / error polish**

Home empty state; publish errors; Freighter missing install link (`https://www.freighter.app`).

- [ ] **Step 2: Run unit tests + build**

```bash
npm test
npm run build
```

Expected: tests pass; production build succeeds.

- [ ] **Step 3: Update README** with exact env vars, Freighter testnet funding link, Pinata setup, and demo script (browse → publish → buy).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "docs: finalize MVP runbook and polish empty states"
```

---

## Plan self-review

**Spec coverage**

| Spec area | Task |
|-----------|------|
| Next.js + SQLite + Prisma | 1–2 |
| Freighter + network env | 3, 8 |
| IPFS Pinata | 5, 11 |
| Browse + genre | 6, 9 |
| Publish flow + asset rules | 5, 11 |
| Free + paid XLM + memo verify | 3, 4, 7, 10 |
| H2 Billboard navy/silver UI | 1, 9 |
| Game detail download | 10 |
| Testing helpers + manual E2E | 3, 4, 12 |

**Placeholder scan:** none intentional — Pinata JWT required in `.env` for real uploads; without it upload route errors clearly.

**Type consistency:** `priceXlm` and `amountXlm` are strings; `screenshotCids` stored as JSON string; memo helpers shared by verify + client payment builder in Task 10.
