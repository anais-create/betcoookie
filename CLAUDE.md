# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Bet Cookie** 🍪 — a sports-betting site using virtual currency ("cookies"). Front-end only; data is mocked but structured behind an API seam for a future real backend. UI copy is in French; the cookie-themed design system uses golden/brown accents.

## Commands

```bash
npm run dev      # dev server (Turbopack) → http://localhost:3000
npm run build    # production build — also the fastest full check (TS + ESLint + render)
npm run start    # serve the production build
npm run lint     # ESLint only
```

There is no test suite. Treat `npm run build` as the gate: it runs TypeScript and ESLint and prerenders every route, so it catches type errors, unused imports (ESLint fails the build), and render-time crashes in one pass.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Import alias `@/*` → `src/*`. **Read `node_modules/next/dist/docs/` before using Next APIs — this is Next 16, not the version in training data** (e.g. `params` and `searchParams` in pages are Promises and must be awaited).

## Architecture

The whole app hangs on three seams. Understand these before changing data flow.

### 1. Data access — `src/data/api.ts` is the server-only read seam
Server Components read data through the `api` object (`getSportsMatches`, `getMatch`, `getLeaderboard`, `getMe`, `getMyBets`, `getShopPacks`). Matches/odds come from The Odds API (with mock fallback); **user, bets and leaderboard are real reads from the database** (Prisma/SQLite) scoped to the visitor's session. `api.ts` imports `@/lib/auth` (→ `next/headers`) so it is **server-only — never import it from a Client Component**; clients go through the Route Handlers under `app/api/*`. Domain types live in `src/data/types.ts`. **Do not** import `src/data/mock/*` from components.

### 2. Backend — database, auth, and mutations
- **Database**: SQLite via Prisma. Schema in `prisma/schema.prisma` (`User`, `Session`, `Bet`); client singleton in `src/lib/db.ts`. Migrate with `npx prisma migrate dev`; `prisma generate` runs on `postinstall`. The dev DB file (`prisma/dev.db`) is gitignored.
- **Auth** (`src/lib/auth.ts`): real email/password. Passwords hashed with Node `scrypt` (no deps); sessions are opaque tokens stored in the `Session` table and carried by an httpOnly cookie (`bet-cookie-session`). `getCurrentUser()` resolves the session in Server Components / Route Handlers. `src/proxy.ts` (Next 16's renamed middleware) guards `/mes-paris`, `/profil`, `/boutique` by cookie presence.
- **The backend is authoritative.** Mutations are Route Handlers: `POST /api/auth/{register,login,logout}`, `GET /api/me`, `POST /api/bets` (debits in a transaction; **re-derives odds/label from the server match — client-sent odds are ignored**), `POST /api/bets/settle` (settlement logic in `src/lib/betting.ts`: credits `stake × odds` on wins, updates counters), `POST /api/wallet/claim` (pack amount comes from the server; daily bonus gated server-side).

### 3. Session state — `src/store/wallet.tsx` (WalletProvider / useWallet)
A React Context that is a **client mirror of the server session**. On mount it hydrates from `GET /api/me`; each mutation (`placeBet`, `claim`, `settle`, `logout`) calls the matching Route Handler and applies the authoritative response. There is no localStorage source of truth anymore. The provider wraps the app in `src/app/layout.tsx`. Anything showing a live balance/bets must consume this — so it must be a Client Component.

### 3. Server vs Client split
- **Server Components** (async, `await api.*`): pages that only read static-ish data — `app/page.tsx`, `app/match/[id]/page.tsx`, `app/classement/page.tsx`. Interactive bits inside them are delegated to client child components (e.g. `MatchList`, `BetForm`).
- **Client Components** (`"use client"`): pages that read/mutate the wallet — `app/mes-paris/page.tsx`, `app/profil/page.tsx`, `app/boutique/page.tsx` — plus anything using hooks/`useWallet`.

### Layout & design system
- `src/app/layout.tsx` is the shell: loads fonts via `next/font` (Baloo 2 → `--font-baloo`, Inter → `--font-inter`), mounts `WalletProvider`, `Header` (desktop nav) and `BottomNav` (mobile nav).
- **Design tokens live in `src/app/globals.css` via Tailwind v4 `@theme`** — there is no `tailwind.config`. Cookie palette is exposed as utility colors: `cookie-dough`, `cookie-base`, `caramel`, `choc-chip`, `choc-dark`, `cream`, `mint-win`, `berry-loss`. Use these tokens rather than raw hex. `cn()` (`src/lib/cn.ts`) merges classes; money/odds/date formatting helpers are in `src/lib/format.ts`.
- Navigation entries are defined once in `src/components/layout/nav-items.ts` and shared by both `Header` and `BottomNav` — edit there to change nav.

### Conventions
- Reusable UI primitives in `src/components/ui/`; feature components in `src/components/betting/`, `leaderboard/`, `auth/`, `layout/`.
- Cookies are the currency: render amounts with the `CookieAmount` component or `formatCookies()`, suffixed with the 🍪 emoji.
- Auth (`app/(auth)/login`, `register`) is real: `AuthForm` POSTs to `/api/auth/*`, then refreshes the wallet and redirects (honoring `?from=`). New accounts start with 1 000 cookies.
