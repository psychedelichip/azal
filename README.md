# Azal — Prediction Market Terminal (prototype)

Polymarket-style market content in an Axiom-style pro-trader terminal. Static SPA on mock data — no backend, no auth.

Stack: Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + shadcn/ui (Radix) + lucide-react.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-checks, outputs static site to dist/
npm run preview  # serve the production build locally
```

## Deploy (Vercel)

Import the repo (or run `vercel`) — the Vite preset is auto-detected: build `npm run build`, output `dist/`. No env vars needed.

## Structure

- `src/components/` — Sidebar, TopBar, MarketsColumn, FeaturedCarousel, OrderTicket, RightRail, WidgetEditor, StatusBar (+ Chart, WidgetMini)
- `src/components/ui/` — generated shadcn/ui primitives
- `src/lib/mock.ts` — typed mock data (Market, FeaturedMarket, Position, Catalyst, IntelItem, Widget), shaped for a future API drop-in
- `prototype/azal_shell.jsx` — original single-file prototype (reference only, not part of the build)
