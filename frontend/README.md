# Portlio Frontend

Next.js frontend for Portlio. See `../portlio-frontend-architecture.md`
(or wherever your copy of the architecture doc lives) for the full design,
this README only covers running what's built so far.

**Status: Phase 0 (scaffold) complete.** No real pages exist yet, `/` is a
temporary placeholder that exists purely to verify the scaffold renders.
Landing, Analyze, Skills Dashboard, Repository Explorer, and About are not
implemented yet (Phases 1-4 of the roadmap).

## Stack

Next.js 15 (App Router) - TypeScript (strict) - Tailwind CSS v4 -
shadcn/ui - TanStack Query - next-themes - lucide-react

## Prerequisites

- Node.js 20+
- The Portlio backend running locally (`uvicorn app.main:app --reload`
  from `../backend`, after `pip install -r requirements.txt -r requirements-dev.txt`),
  or any reachable instance of it

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` if your backend isn't running at the default
`http://localhost:8000`.

The backend also needs one new setting for this frontend to be able to call
it at all, see "Backend CORS requirement" below.

```bash
npm run dev
```

Open http://localhost:3000. You should see a "Phase 0 scaffold" placeholder
page with a working dark/light mode toggle, that's confirming Tailwind,
shadcn/ui's design tokens, next-themes, and TanStack Query are all wired
correctly.

## Backend CORS requirement

The backend had no CORS configuration before this change. For `npm run dev`
to be able to call it from the browser, the backend needs `FRONTEND_ORIGINS`
set to include `http://localhost:3000` (this is already the default in
`backend/.env.example`, copy it to `backend/.env` if you haven't already).
In production, set `FRONTEND_ORIGINS` on the backend to the deployed
frontend's URL.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + `next/typescript`, Prettier-compatible) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck` | `tsc --noEmit`, strict mode |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with a coverage report |

Before opening a PR: `npm run typecheck && npm run lint && npm test` should
all be clean, and `npm run build` should succeed.

## Adding shadcn/ui components (Phase 1+)

`components.json` is already configured (New York style, neutral base
color, CSS variables). Once you have network access to `ui.shadcn.com`
(this sandbox's egress allowlist blocks it, so `Button` was added by hand
here, see `src/components/ui/button.tsx`), add further primitives the
normal way:

```bash
npx shadcn@latest add card badge tabs skeleton progress tooltip
```

## Project layout so far

```
src/
├─ app/
│  ├─ layout.tsx           # root layout: Providers, metadata, no external font fetch
│  ├─ page.tsx              # TEMPORARY scaffold-check page, replaced wholesale in Phase 4
│  └─ globals.css           # Tailwind v4 import + shadcn/ui design tokens (light/dark)
├─ components/
│  ├─ providers/
│  │  ├─ index.tsx          # <Providers> = ThemeProvider + QueryProvider composed
│  │  ├─ theme-provider.tsx # next-themes wrapper
│  │  ├─ query-provider.tsx # TanStack Query client + devtools
│  │  └─ mode-toggle.tsx    # scaffold-verification dark mode toggle
│  └─ ui/
│     └─ button.tsx         # shadcn/ui Button, added by hand (see note above)
└─ lib/
   └─ utils.ts              # cn(), required by every shadcn/ui component
```

`lib/api/`, `lib/query/hooks.ts`, `types/`, and everything under
`components/landing|analyze|skills|repos` from the architecture doc's folder
structure don't exist yet - those land in Phase 1 onward.

## Why some architecture-doc details differ slightly here

- **Tailwind v4, not `tailwind.config.ts`.** The architecture doc predates
  this decision; Tailwind v4 (what `create-next-app` now ships by default,
  and what shadcn/ui's CLI now targets) has no JS config file, theme
  tokens live in `globals.css` via `@theme inline` instead. Functionally
  equivalent, just configured in CSS rather than JS.
- **No `next/font/google` yet.** `layout.tsx` uses a system font stack for
  now. Real typeface selection is a Phase 4 design decision, and this
  sandbox's network policy can't reach Google Fonts' CDN to prove out a
  build using it anyway, swap it in whenever Phase 4 picks a typeface.
