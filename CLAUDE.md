# Azal — Claude Code build context

## What Azal is
Azal is a prediction-market trading terminal. Take Polymarket / Kalshi market content (events across politics, crypto, sports, economics, weather) and wrap it in an Axiom-style pro-trader terminal: dense, fast, multi-panel, keyboard-friendly. Positioning is institutional, a "financial OS" for event-driven trading, not a casual betting app.

## Goal of this build
Take the working single-file prototype at /prototype/azal_shell.jsx and rebuild it as a clean, real shadcn/ui + React + TypeScript app, deploy-ready for Vercel, so it can be shared with a client as a live interactive prototype. Keep every behavior and the visual direction identical; just upgrade the implementation (typed, componentized, shadcn primitives instead of hand-rolled Tailwind).

## North star
Polymarket content, Axiom feel. Speed and density over hand-holding. No dead zones, every panel earns its space.

## Stack
• Vite + React + TypeScript
• Tailwind CSS
• shadcn/ui primitives (sidebar, button, collapsible, dropdown-menu, input, sheet, badge, scroll-area)
• lucide-react icons
• Deploy: Vercel (static SPA, no backend). Keep it deploy-ready at all times.

## Theme
Light. White surfaces, neutral gray borders (gray-100 / gray-200), muted gray labels. Accent blue (blue-600). Primary action buttons solid near-black (#0b1220). Dense, clean, banker-grade.

## Layout (recreate exactly from the prototype)
App shell = collapsible left Sidebar + a right column containing TopBar, a Main row, and a bottom StatusBar.

### Sidebar
• Logo (Azal) at top.
• Categories: Trending and Live as collapsible groups that unfold into subcategories / live markets.
• Menu: Portfolio, Social, Rewards.
• Footer: a settings cog only (no Settings nav item, no tier badge).
• Collapses to a slim icon rail via the TopBar toggle.

### TopBar (above main, right of sidebar)
• Left: sidebar collapse toggle, breadcrumb (category > current market, clickable), search input with "/" hint.
• Right: wallet split button, balance pill, emphasized Deposit split button, star, notifications bell (unread dot), Edit (pencil) toggle, user (name + tier) + avatar, overflow menu.
• Must stay compact and never overflow on narrow widths (search shrinks, breadcrumb truncates, right cluster stays).

### Main row = three columns
1. Markets column: header + count, category pills (Trending / Crypto / Politics + add), a filter row with Sort, Status, and a functional Section dropdown that filters to other sections (Economics, Sports, Weather, Companies), a featured scraped-news card, and a dense scannable markets list (question, % chance, vol, time, Y/N prices).
2. Center: a Featured markets carousel (dot + prev/next navigation). Each slide = market header, line chart, Yes/No cells, and a working order ticket (Buy Yes/No toggle, amount input, quick chips, live-computed shares / avg price / potential payout / max profit, Place order, order type / slippage).
3. Right rail: Azal Intel (scored, ranked action items), Catalysts (calendar of upcoming events), Positions (with P&L coloring), and a Free slot.

### StatusBar (bottom)
Venue, Session, Feed latency, WebSocket status, clock, and a Chat (overlay) button.

## Edit mode / widget editor (key interaction, recreate)
• The TopBar Edit (pencil) toggle turns on edit mode.
• Edit mode opens a right-side Widget editor drawer (use shadcn Sheet) with a library of widget cards, each a mini preview (Markets tab, Price chart, Azal Intel, Catalysts, Positions, Scraped news) + an Add button.
• Adding a widget places it into the right-rail Free slot, which becomes an active drop target while editing and renders the chosen widget with a remove control.
• Section headers show drag handles while editing (rearrange affordance).

## Conventions
• Components under /components, one concern each: Sidebar, TopBar, MarketsColumn, FeaturedCarousel, OrderTicket, RightRail, WidgetEditor, StatusBar.
• Strong TS types: Market, FeaturedMarket, Position, Catalyst, IntelItem, Widget.
• Mock data in /lib/mock.ts, shaped so a real API can drop in later.
• Routes (optional for the prototype): Dashboard, Markets, Portfolio, Social, Rewards.
• Keep npm run dev working and Vercel-ready throughout.

## Navigation model (one shell, page switching)
There is a single shell (one Sidebar + one TopBar). The main area swaps by a `page` state.
• Sidebar Menu items (Portfolio, Social, Rewards) navigate to pages.
• Sidebar Categories (Trending / Live and their subitems) return to and drive the Dashboard page.
• The TopBar breadcrumb, the Edit button, and the widget editor are page-aware (Edit + widget editor only on Dashboard).
• Use proper routing (React Router): /dashboard (default), /portfolio, /social, /rewards. The page-switching in the prototype maps directly to routes.

## Rewards page (built, client-approved design)
The Rewards page is now a real page in the shell (page === "rewards"), ported from the design the client signed off on. Layout: a page header (Rewards + "Season 3 · ends in 18 days"); a full-width hero card split by a vertical divider, left = Level 7 with a Pro badge, "XP to next level", a blue XP progress bar, and an XP caption, right = "Claimable now" with a large green dollar figure, a next-drop caption, and a dark Claim button. Below, a two-column grid (about 1.8fr / 1fr): left = a "Quests & Challenges" card, a divided list where each quest has a title, a blue XP reward, a sub line, and a state-specific control (a dark progress bar for in-progress, a dark "Claim +X XP" button when complete, a bordered "Get referral link" button when not started); right rail = three stacked cards, "Your stats" (total claimed / account age / rewards rate), "Referrals" (a dashed referral-link field + Copy, then referred / earned / tier stats), and "Leaderboard" (a highlighted "your rank" box with rank + top percent + season XP, a top-3 ranked list, and a View full leaderboard link). Light theme, dark token #0b1220 for primary buttons and progress fills, blue #2563eb for XP bar and links, green for claimable and positive states. Small circular numbered badges sit next to each section title.

## Social page (built, research-led restructure of the client wireframe)
The client wireframe had five co-equal blocks (discover feed, live streams, user/wallet search + copy trade, live chat + DMs, top trader leaderboard). We restructured around the real job: discover a trader, evaluate, then follow or copy. Copy trading is the core, not a corner box. Layout (page === "social"): a page header (Social + "Discover traders, copy the best"); a full-width search row (search traders/wallets/users + a "Paste a wallet to copy" action); then a two-column grid (about 1.8fr / 1fr). Left (hero) = the Discover feed with tabs (Following / Trending / Trades), a stream of trade-share cards: trader header (avatar, name, monthly profit, win rate) with Follow and Copy buttons, a caption, a trade card (side chip, market, odds, size, live P&L), and a social footer (likes, comments, share). Right rail = three stacked cards: Top traders leaderboard (performance-ranked rows with avatar, win rate, risk score, ROI, and a Copy button; ROI / win-rate filter chips), a curated "Live now" strip (a few vetted trader sessions with a live dot and viewer count, deliberately demoted, not a Twitch-style open block, because open streaming is off-brand and a moderation risk for a banker-grade product; expand only if the client insists), and a Messages card (online friends preview + "Open chat", noting DMs and friends live in the existing chat overlay, not a permanent column).
• Avatars are colored circles with initials (no images in the prototype).
• TRADER / COPY DRAWER (right-side Sheet, ~416px, same pattern as the hedge drawer; the trader profile is a drawer, not a page). Header: avatar, name, copiers, risk score. A four-stat strip: ROI, Win, Drawdown, Monthly. A segmented toggle, Overview vs Copy. Overview: Follow button + tags, a Recent trades list (side chip, market, P&L), and an honesty note that stats include wins and losses and past performance is not a guarantee (key trust point from copy-trading research, traders tend to show only winners). Copy: copy mode toggle (proportional vs fixed, with a one-line explanation each), Allocation (number input + Max + slider + 25/50/100 percent presets of balance), guard fields (slippage guard, max open positions, stop loss, take profit), and a Markets filter chip row. Footer CTA: Overview mode shows "Copy this trader" (switches to the Copy tab) or "Manage copy" if already copying; Copy mode shows "Set an allocation" when empty, else "Copy {name} · $X". Follow and copy state persist in the shell (Follow toggles, Copy marks the trader as Copying across feed and leaderboard).
• Two leaderboards are intentionally distinct: the Rewards leaderboard ranks by XP / season; the Social leaderboard ranks by trading performance (for copying). Keep them separate.
• Copy execution, real balances, and the streaming feature are the heaviest real-data and compliance pieces; the prototype is mock. Real copy config maps to fixed/proportional sizing, allocation caps, slippage, per-market limits, and stop/take rules.

## Portfolio page (build to this)
Lives under the Menu Portfolio item, inside the same shell. It has a horizontal sub-section tab bar: Overview, Command Center, Wallets, Translator, Hedging, Scenario Engine. (Imported Assets is no longer a tab, see below.)
• Overview tab: Portfolio Overview stat cards (Total portfolio value, Market exposure, Open positions, PNL) with deltas. IMPORTANT, the numbers are reconciled: Total portfolio value INCLUDES imported holdings (prediction positions $248,420 + imported $329,200 = $577,620), and Market exposure shows as a percent of that real total (16 percent, not 37). Then a "Net worth by source" segmented bar (Prediction markets / Crypto wallets / Brokerage) that reconciles where the money sits. Then Exposure Breakdown cards with segmented distribution bars + legends (group by narrative / market / asset / time horizon). Then an "Imported assets" section (total + source split SegBar + Import from wallet and Connect brokerage actions + a Manage link). Then a Holdings table (position with YES/NO chip, exposure, risk, PNL, status badge).
• Wallets: list of the user's connected wallets (label, address with copy, balance, an Active badge for the current one). Actions: Create wallet (generated in app), Import wallet (existing keys), Set active, Remove. Axiom-style multi-wallet management: one unified list, quick switch active wallet, create or import or remove.
• Imported Assets: FULLY MERGED into Overview, no longer an equal tab. It is now an Overview section (summary + source split + import/connect actions) plus a drill-down detail view (reached via the Manage link, has a Back to overview affordance) that lists the grouped Crypto wallets (BTC, ETH, SOL with holdings + value, Import from wallet) and Brokerage (stocks and bonds with type + holdings + value, Connect brokerage). The data model is unified: imported assets count toward the Overview totals, they are not a separate silo.
• Hedging simulator: an accordion list of the user's current positions. Expanding a position reveals related markets to hedge with, each tagged Correlated or Inverse, with price, a short rationale, and a Hedge button. Clicking Hedge opens the HEDGE DRAWER (see below). Hedged rows show a green "Hedged" badge and the button becomes "Edit"; the selected row is highlighted while the drawer is open.
• HEDGE DRAWER (right-side Sheet, ~416px, reuses the widget-editor drawer pattern, NOT a centered modal, so the position list and other candidates stay visible and you can switch candidates without closing). Contents top to bottom: (1) Your position card (side, name, exposure). (2) "Hedge with" picker, the position's related markets as selectable rows, click to switch the drawer's target without closing. (3) Correlation band, a -1 to +1 scale with a marker, color-coded (inverse side green = natural hedge, same-direction side amber = take opposite side), labeled Strong/Moderate/Weak + same/inverse, with a plain-language line and an explicit "estimated, not a guarantee" note. NO false-precision decimal score as the hero. (4) Derived action chip on dark bg: "BUY YES/NO" on the hedge market, computed from correlation sign and your side (positive correlation = opposite side, inverse = same side). (5) Amount to hedge: number input + Max + range slider + 25/50/100 percent presets (of exposure). (6) PAYOFF HERO (the centerpiece, what the trader actually decides on, not the correlation coefficient): "If it resolves against you" risk now (−exposure) → after hedge (−net), a green coverage bar, "covers X percent of exposure", and "upside given up if you win ≈ $Y". (7) Footer state-aware CTA: "Enter an amount" when empty, else "Hedge $A · covers X percent". Math model (mock, flag as a real data question later): effectiveOffset = amount × |corr|; net = exposure − effectiveOffset; coverage = effectiveOffset / exposure; give-up ≈ amount × hedge-market price. Real version of the correlation score comes from price co-movement plus a causal/semantic model and ties into Azal Intel scoring.
• Command Center: a quick-actions row (New order, Hedge all, Close all, New alert) plus a two-column layout, a Live signals feed (tagged Opportunity / Risk / Info, each tied to a position with a quick action) and an Alerts list (market, condition, Active or Triggered status).
• Translator: a group-by chip row (Narrative / Asset / Horizon) over a table that maps each position to its narrative, the assets it maps to, a time horizon, and exposure.
• Scenario Engine: scenario selector chips, a severity slider that scales the impact, a per-position projected-delta table, and a "projected portfolio impact" hero (portfolio value now vs projected, with a net delta).
• Open UX question flagged by the client: too many flat tabs feel like tab spam. Preferred direction is a customizable Overview hub plus a command palette (Cmd+K) for the tool-type sub-pages, rather than equal tabs. Build the tabs for now but keep the structure ready to swap to palette + hub. (Removing Imported Assets as a tab is the first step in that direction.)

## Parked (mock only, do not build)
Auth, real wallet, live market data, backend, the XP / rewards economy. Prototype on mock data first.

## Working rules
- One page per file under src/pages. Shared UI under src/components. Drawers under src/components/drawers.
- When I ask to change or redesign a single page, only edit that page's file and its local child components. Do not touch the shell, routing, tokens, or other pages unless I explicitly say so.
- This file is high-level context only. The code is the source of truth, do not expect feature-level detail here.
