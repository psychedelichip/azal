export const SECTION_IDS = [
  "Crypto",
  "Politics",
  "Economics",
  "Sports",
  "Weather",
  "Companies",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** "Trending" shows everything; a SectionId narrows the list to that section. */
export type MarketFilter = "Trending" | SectionId;

export type MarketStatus = "Open" | "Live" | "Closing soon" | "New";

/** Sort applied to the markets list. "Trending" keeps the curated order. */
export type MarketSort = "Trending" | "Volume" | "Closing soon" | "% chance";
export const SORT_OPTIONS: MarketSort[] = ["Trending", "Volume", "Closing soon", "% chance"];

/** "All" shows every status; the rest narrow by MarketStatus. */
export type StatusFilter = "All" | "Open" | "Live" | "Closing soon";
export const STATUS_OPTIONS: StatusFilter[] = ["All", "Open", "Live", "Closing soon"];

export interface Market {
  id: string;
  question: string;
  probability: number;
  volumeLabel: string;
  /** Numeric volume for sorting; volumeLabel stays for display. */
  volume: number;
  timeLabel: string;
  /** Sortable minutes-to-close; live = 0, no-deadline = large sentinel. */
  closesInMinutes: number;
  status: MarketStatus;
  yesPrice: number;
  noPrice: number;
  section: SectionId;
}

export interface FeaturedMarket {
  id: string;
  title: string;
  venue: string;
  volumeLabel: string;
  yes: number;
  no: number;
  yesSeries: number[];
  noSeries: number[];
  /** Links this featured slide to a MARKETS row, so a list click can drive the deep-dive. */
  marketId?: string;
  liquidityLabel?: string;
  resolutionLabel?: string;
  closesLabel?: string;
}

export type IntelType = "recommendation" | "news" | "market_move" | "signal";
export type IntelAction = "buy" | "sell" | "hedge";

interface IntelBase {
  id: string;
  type: IntelType;
  /** 0–100 relevance; drives the ranked order. */
  score: number;
  /** One-line teaser shown in the right-rail row. */
  headline: string;
  timeAgo: string;
}

/** AI position recommendation: buy/sell a market, or hedge a held position. */
export interface IntelRecommendation extends IntelBase {
  type: "recommendation";
  marketId: string;
  market: string;
  side: HoldingSide;
  /** Set when the rec concerns a held position (drives the hedge action). */
  positionId?: string;
  rationale: string;
  actions: IntelAction[];
}

/** Breaking news with the markets it moves attached. */
export interface IntelNews extends IntelBase {
  type: "news";
  source: string;
  body: string;
  sentiment?: "up" | "down" | "neutral";
  relatedMarkets: { id: string; name: string }[];
  affectedPositions?: { id: string; name: string }[];
}

/** A notable price/volume move on a market. */
export interface IntelMarketMove extends IntelBase {
  type: "market_move";
  marketId: string;
  market: string;
  delta: string;
  direction: "up" | "down";
  volumeLabel: string;
  sparkline: number[];
}

/** Crowd-vs-model disagreement or a derived alert on a market. */
export interface IntelSignal extends IntelBase {
  type: "signal";
  marketId: string;
  market: string;
  /** Crowd-implied probability vs Azal's model (both in ¢/%). */
  crowd: number;
  model: number;
  alert: string;
}

export type IntelItem = IntelRecommendation | IntelNews | IntelMarketMove | IntelSignal;

/** Market ids an intel item is attached to (news can touch several). */
export function intelMarketIds(it: IntelItem): string[] {
  return it.type === "news" ? it.relatedMarkets.map((m) => m.id) : [it.marketId];
}

export interface Catalyst {
  id: string;
  day: string;
  month: string;
  title: string;
  linkedMarket: string;
  relatedMarketId?: string;
}

/** Market-scoped news (the scraped-news concept, done right) for the deep-dive panel. */
export interface ContextualNews {
  id: string;
  marketId: string;
  source: string;
  headline: string;
  timeAgo: string;
  sentiment?: "up" | "down" | "neutral";
}

export interface Position {
  id: string;
  name: string;
  detail: string;
  pnl: number;
}

export type WidgetKey = "markets" | "chart" | "intel" | "catalysts" | "positions" | "news";

export interface Widget {
  key: WidgetKey;
  name: string;
}

export const TRENDING_TOPICS = [
  "Silver",
  "China",
  "Midterms",
  "Weather",
  "Crypto Prices",
  "Movies",
  "Parlays",
  "ICE",
  "Ukraine",
  "Epstein",
];

export const LIVE_MARKETS = [
  "Lakers @ Celtics",
  "Fed rate decision",
  "Greenland vote",
  "NATO summit",
  "Oscars 2026",
  "Primaries",
];

export const CATEGORY_PILLS: MarketFilter[] = ["Trending", "Crypto", "Politics"];

/** Sections not already shown as a pill — surfaced via the pills "+" overflow. */
export const MORE_SECTIONS = SECTION_IDS.filter((s) => !CATEGORY_PILLS.includes(s));

export const MARKETS: Market[] = [
  { id: "btc-150k", question: "Will BTC hit $150k by Jun 30?", probability: 7, volumeLabel: "$544k vol", volume: 544000, timeLabel: "12:42:48 left", closesInMinutes: 762, status: "Closing soon", yesPrice: 7, noPrice: 93, section: "Crypto" },
  { id: "fed-cut-jul", question: "Fed cuts rates in July?", probability: 38, volumeLabel: "$1.2M vol", volume: 1200000, timeLabel: "21d left", closesInMinutes: 30240, status: "Open", yesPrice: 38, noPrice: 62, section: "Economics" },
  { id: "trump-approval", question: "Trump approval > 45% end Q2?", probability: 52, volumeLabel: "$890k vol", volume: 890000, timeLabel: "18d left", closesInMinutes: 25920, status: "Open", yesPrice: 52, noPrice: 48, section: "Politics" },
  { id: "eth-4k", question: "ETH above $4k by Jul 1?", probability: 44, volumeLabel: "$410k vol", volume: 410000, timeLabel: "22d left", closesInMinutes: 31680, status: "Open", yesPrice: 44, noPrice: 56, section: "Crypto" },
  { id: "gov-shutdown", question: "Gov shutdown before October?", probability: 29, volumeLabel: "$320k vol", volume: 320000, timeLabel: "open", closesInMinutes: 999999, status: "Open", yesPrice: 29, noPrice: 71, section: "Politics" },
  { id: "lakers-title", question: "Lakers win NBA title?", probability: 12, volumeLabel: "$760k vol", volume: 760000, timeLabel: "live", closesInMinutes: 0, status: "Live", yesPrice: 12, noPrice: 88, section: "Sports" },
  { id: "ai-safety-bill", question: "AI safety bill passes Senate?", probability: 18, volumeLabel: "$140k vol", volume: 140000, timeLabel: "40d left", closesInMinutes: 57600, status: "Open", yesPrice: 18, noPrice: 82, section: "Politics" },
  { id: "nyc-rain", question: "Rain in NYC tomorrow?", probability: 71, volumeLabel: "$22k vol", volume: 22000, timeLabel: "14h left", closesInMinutes: 840, status: "Closing soon", yesPrice: 71, noPrice: 29, section: "Weather" },
];

export const FEATURED_MARKETS: FeaturedMarket[] = [
  {
    id: "feat-btc-150k",
    title: "Will BTC hit $150k by Jun 30, 2026?",
    venue: "Kalshi",
    volumeLabel: "$544,393 vol",
    yes: 7,
    no: 93,
    yesSeries: [12, 10, 14, 9, 11, 8, 10, 9, 7],
    noSeries: [88, 90, 86, 91, 89, 92, 90, 91, 93],
    marketId: "btc-150k",
    liquidityLabel: "$210k liq",
    resolutionLabel: "Jun 30, 2026",
    closesLabel: "12h 42m",
  },
  {
    id: "feat-fed-cut",
    title: "Fed cuts rates in July?",
    venue: "Kalshi",
    volumeLabel: "$1.2M vol",
    yes: 38,
    no: 62,
    yesSeries: [30, 33, 31, 36, 34, 37, 35, 39, 38],
    noSeries: [70, 67, 69, 64, 66, 63, 65, 61, 62],
    marketId: "fed-cut-jul",
    liquidityLabel: "$540k liq",
    resolutionLabel: "Jul 31, 2026",
    closesLabel: "21d",
  },
  {
    id: "feat-trump-approval",
    title: "Trump approval > 45% end Q2?",
    venue: "Polymarket",
    volumeLabel: "$890k vol",
    yes: 52,
    no: 48,
    yesSeries: [48, 50, 47, 53, 51, 49, 54, 50, 52],
    noSeries: [52, 50, 53, 47, 49, 51, 46, 50, 48],
    marketId: "trump-approval",
    liquidityLabel: "$380k liq",
    resolutionLabel: "Jun 30, 2026",
    closesLabel: "18d",
  },
];

export const INTEL_ITEMS: IntelItem[] = [
  {
    id: "intel-btc-buy",
    type: "recommendation",
    score: 92,
    timeAgo: "4m",
    headline: "Buy YES on BTC $150k — flow leads price",
    marketId: "btc-150k",
    market: "Will BTC hit $150k by Jun 30?",
    side: "YES",
    positionId: "pos-btc-yes",
    rationale:
      "Spot BTC ETFs took $1.2B of weekly inflows and the Reuters headline pushed price +2.4% with no follow-through selling. The model reads YES as underpriced versus the flow.",
    actions: ["buy", "hedge"],
  },
  {
    id: "intel-taiwan-news",
    type: "news",
    score: 88,
    timeAgo: "11m",
    headline: "Reuters: Taiwan reports rising PLA activity near strait",
    source: "Reuters",
    sentiment: "down",
    body:
      "Taiwan's defense ministry flagged a sharp rise in PLA naval movements near the strait. On comparable headlines, political and risk-off rate markets have repriced within hours.",
    relatedMarkets: [
      { id: "trump-approval", name: "Trump approval > 45% end Q2?" },
      { id: "fed-cut-jul", name: "Fed cuts rates in July?" },
    ],
    affectedPositions: [{ id: "pos-fed-yes", name: "Fed cut Jul · Yes" }],
  },
  {
    id: "intel-trump-move",
    type: "market_move",
    score: 81,
    timeAgo: "2m",
    headline: "Trump approval > 45% climbed +3.1% intraday",
    marketId: "trump-approval",
    market: "Trump approval > 45% end Q2?",
    delta: "+3.1%",
    direction: "up",
    volumeLabel: "$890k vol",
    sparkline: [48, 50, 49, 51, 52, 51, 53, 54, 55],
  },
  {
    id: "intel-fed-signal",
    type: "signal",
    score: 76,
    timeAgo: "18m",
    headline: "Crowd vs. model gap on the Fed-cut market",
    marketId: "fed-cut-jul",
    market: "Fed cuts rates in July?",
    crowd: 38,
    model: 52,
    alert:
      "The crowd prices YES at 38¢ but Azal's model implies 52¢ after the cooler CPI print — a 14-point gap that has tended to mean-revert toward the model.",
  },
  {
    id: "intel-fed-hedge",
    type: "recommendation",
    score: 73,
    timeAgo: "26m",
    headline: "Hedge Fed cut Jul · Yes before the decision",
    marketId: "fed-cut-jul",
    market: "Fed cuts rates in July?",
    side: "YES",
    positionId: "pos-fed-yes",
    rationale:
      "Your Fed-cut Yes is up, but the decision is a binary catalyst. A partial hedge locks in part of the gain while keeping upside if the cut lands.",
    actions: ["hedge", "sell"],
  },
  {
    id: "intel-cpi-news",
    type: "news",
    score: 69,
    timeAgo: "1h",
    headline: "Bloomberg: Core CPI cools to 3.1%, below consensus",
    source: "Bloomberg",
    sentiment: "up",
    body:
      "Core CPI printed 3.1% versus 3.3% consensus, strengthening the case for a July cut. Rate-sensitive markets moved first.",
    relatedMarkets: [{ id: "fed-cut-jul", name: "Fed cuts rates in July?" }],
    affectedPositions: [{ id: "pos-fed-yes", name: "Fed cut Jul · Yes" }],
  },
];

export const CATALYSTS: Catalyst[] = [
  { id: "cat-eth-unlock", day: "18", month: "JUN", title: "ETH token unlock", linkedMarket: "ETH above $4k", relatedMarketId: "eth-4k" },
  { id: "cat-fed-decision", day: "30", month: "JUL", title: "Fed rate decision", linkedMarket: "Fed cuts in July", relatedMarketId: "fed-cut-jul" },
  { id: "cat-debate", day: "16", month: "SEP", title: "Presidential debate", linkedMarket: "Trump approval", relatedMarketId: "trump-approval" },
];

export const CONTEXTUAL_NEWS: ContextualNews[] = [
  { id: "news-btc-etf", marketId: "btc-150k", source: "Reuters", headline: "Spot BTC ETFs see $1.2B weekly inflow", timeAgo: "2h ago", sentiment: "up" },
  { id: "news-btc-onchain", marketId: "btc-150k", source: "Glassnode", headline: "Long-term holder supply hits record high", timeAgo: "5h ago", sentiment: "neutral" },
  { id: "news-fed-cpi", marketId: "fed-cut-jul", source: "Bloomberg", headline: "Core CPI cools to 3.1%, below consensus", timeAgo: "1h ago", sentiment: "up" },
  { id: "news-fed-speak", marketId: "fed-cut-jul", source: "WSJ", headline: "Fed official signals caution on July timing", timeAgo: "4h ago", sentiment: "down" },
  { id: "news-eth-unlock", marketId: "eth-4k", source: "The Block", headline: "ETH unlock cliff adds near-term supply", timeAgo: "8h ago", sentiment: "down" },
];

export const POSITIONS: Position[] = [
  { id: "pos-btc-yes", name: "BTC $150k · Yes", detail: "0.58 → 0.63 · 4,200 sh", pnl: 215 },
  { id: "pos-eth-no", name: "ETH $4k · No", detail: "0.44 → 0.41 · 1,100 sh", pnl: 48 },
  { id: "pos-fed-yes", name: "Fed cut Jul · Yes", detail: "0.38 → 0.35 · 600 sh", pnl: -22 },
];

export const WIDGETS: Widget[] = [
  { key: "markets", name: "Markets tab" },
  { key: "chart", name: "Price chart" },
  { key: "intel", name: "Azal Intel" },
  { key: "catalysts", name: "Catalysts" },
  { key: "positions", name: "Positions" },
  { key: "news", name: "Scraped news" },
];

/* ---- Portfolio page ---- */

export const PORTFOLIO_TABS = [
  "Overview",
  "Command Center",
  "Wallets",
  "Imported Assets",
  "Translator",
  "Hedging",
  "Scenario Engine",
] as const;

export type PortfolioTab = (typeof PORTFOLIO_TABS)[number];

export interface PortfolioSubPage {
  key: PortfolioTab;
  /** Stub description shown on the not-yet-built sub-pages (Overview renders the real hub instead). */
  description?: string;
}

export type StatTrend = "up" | "down" | "neutral";

export interface PortfolioStat {
  label: string;
  value: string;
  delta: string;
  trend: StatTrend;
  emphasize?: boolean;
}

export interface ExposureSegment {
  label: string;
  pct: number;
  color: string;
}

export interface ExposureBreakdown {
  title: string;
  segments: ExposureSegment[];
}

export type HoldingSide = "YES" | "NO";
export type HoldingRisk = "Low" | "Medium" | "High";
export type HoldingStatus = "Active" | "Near Resolution" | "In Review";

export interface Holding {
  id: string;
  side: HoldingSide;
  name: string;
  exposure: string;
  risk: HoldingRisk;
  pnl: string;
  up: boolean;
  status: HoldingStatus;
}

// "Imported Assets" stays in the PortfolioTab union but is NOT a tab — it's an Overview
// drill-down reached via the Manage link. So it's intentionally absent from the tab bar.
export const PORTFOLIO_SUBPAGES: PortfolioSubPage[] = [
  { key: "Overview" },
  { key: "Command Center", description: "Alerts, quick actions, and live signals across your positions in one place." },
  { key: "Wallets", description: "Connected wallets and balances, deposits and withdrawals." },
  { key: "Translator", description: "Map positions to narratives, assets, and time horizons." },
  { key: "Hedging", description: "Suggested hedges to offset risk on your open positions." },
  { key: "Scenario Engine", description: "Run what-if scenarios and see projected portfolio impact." },
];

// Reconciled totals: total value INCLUDES imported holdings; market exposure is a % of the real total.
export const PORTFOLIO_STATS: PortfolioStat[] = [
  { label: "Total portfolio value", value: "$577,620", delta: "incl. $329,200 imported", trend: "neutral" },
  { label: "Market exposure", value: "$91,300", delta: "16% of portfolio", trend: "neutral" },
  { label: "Open positions", value: "17", delta: "4 near resolution", trend: "neutral" },
  { label: "PNL", value: "+$12,840", delta: "▲ 5.4% 24h", trend: "up", emphasize: true },
];

// Where the money sits, prediction positions + imported holdings as one reconciled number.
export const NETWORTH_BY_SOURCE: ExposureSegment[] = [
  { label: "Prediction markets ($248,420)", pct: 43, color: "#1e3a8a" },
  { label: "Crypto wallets ($247,400)", pct: 43, color: "#2563eb" },
  { label: "Brokerage ($81,800)", pct: 14, color: "#60a5fa" },
];

export const IMPORTED_TOTAL_VALUE = "$329,200";
export const IMPORTED_CRYPTO_VALUE = "$247,400";
export const IMPORTED_BROKERAGE_VALUE = "$81,800";

export const IMPORTED_SOURCE_SPLIT: ExposureSegment[] = [
  { label: "Crypto wallets ($247,400)", pct: 75, color: "#1e3a8a" },
  { label: "Brokerage ($81,800)", pct: 25, color: "#60a5fa" },
];

export const EXPOSURE_BREAKDOWNS: ExposureBreakdown[] = [
  {
    title: "Group by narrative",
    segments: [
      { label: "AI", pct: 34, color: "#1e3a8a" },
      { label: "Rates", pct: 26, color: "#2563eb" },
      { label: "Geopolitics", pct: 22, color: "#60a5fa" },
      { label: "Energy", pct: 18, color: "#bfdbfe" },
    ],
  },
  {
    title: "Group by market",
    segments: [
      { label: "Kalshi", pct: 58, color: "#1e3a8a" },
      { label: "Polymarket", pct: 42, color: "#60a5fa" },
    ],
  },
  {
    title: "Group by asset",
    segments: [
      { label: "Crypto", pct: 40, color: "#1e3a8a" },
      { label: "Equities", pct: 30, color: "#2563eb" },
      { label: "Macro", pct: 18, color: "#60a5fa" },
      { label: "Commodities", pct: 12, color: "#bfdbfe" },
    ],
  },
  {
    title: "Group by time horizon",
    segments: [
      { label: "under 1w", pct: 22, color: "#1e3a8a" },
      { label: "1 to 4w", pct: 38, color: "#2563eb" },
      { label: "1 to 3m", pct: 28, color: "#60a5fa" },
      { label: "over 3m", pct: 12, color: "#bfdbfe" },
    ],
  },
];

export const HOLDINGS: Holding[] = [
  { id: "hold-fed-jul", side: "YES", name: "Fed July cut", exposure: "$28,400", risk: "Medium", pnl: "+$4,220", up: true, status: "Active" },
  { id: "hold-tariff", side: "NO", name: "tariff action", exposure: "$16,900", risk: "High", pnl: "−$1,180", up: false, status: "Near Resolution" },
  { id: "hold-ai-capex", side: "YES", name: "AI capex beat", exposure: "$22,100", risk: "Medium", pnl: "+$2,610", up: true, status: "Active" },
  { id: "hold-brent", side: "NO", name: "Brent above 90", exposure: "$12,700", risk: "Low", pnl: "+$940", up: true, status: "In Review" },
];

/* ---- Portfolio · Wallets ---- */
export interface WalletAccount {
  id: string;
  label: string;
  address: string;
  balance: string;
  active: boolean;
}

export const INITIAL_WALLETS: WalletAccount[] = [
  { id: "wallet-main", label: "Main", address: "0x4a9c...c21F", balance: "$182,400", active: true },
  { id: "wallet-hedge", label: "Hedge book", address: "0x77b3...9e02", balance: "$54,900", active: false },
  { id: "wallet-cold", label: "Cold storage", address: "bc1q8h...8h7k", balance: "$11,120", active: false },
];

/* ---- Portfolio · Imported Assets ---- */
export interface CryptoAsset {
  symbol: string;
  name: string;
  quantity: string;
  value: string;
  color: string;
}

export type BrokerageAssetType = "Stock" | "Bond";

export interface BrokerageAsset {
  symbol: string;
  name: string;
  type: BrokerageAssetType;
  quantity: string;
  value: string;
}

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: "BTC", name: "Bitcoin", quantity: "1.84 BTC", value: "$121,300", color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", quantity: "22.5 ETH", value: "$84,200", color: "#627eea" },
  { symbol: "SOL", name: "Solana", quantity: "310 SOL", value: "$41,900", color: "#14b8a6" },
];

export const BROKERAGE_ASSETS: BrokerageAsset[] = [
  { symbol: "NV", name: "Nvidia", type: "Stock", quantity: "120 sh", value: "$38,400" },
  { symbol: "AA", name: "Apple", type: "Stock", quantity: "85 sh", value: "$19,100" },
  { symbol: "US", name: "US 10Y Treasury", type: "Bond", quantity: "$25k face", value: "$24,300" },
];

/* ---- Portfolio · Hedging simulator ---- */
export type HedgeRelation = "Correlated" | "Inverse";

export interface HedgeCandidate {
  id: string;
  market: string;
  price: string;
  relation: HedgeRelation;
  /** -1..+1; positive = moves with the position, negative = inverse. Drives the hedge math. */
  correlation: number;
  rationale: string;
}

export interface HedgePosition {
  id: string;
  name: string;
  side: HoldingSide;
  exposure: string;
  /** Numeric exposure (USD) used by the hedge drawer math. */
  exposureValue: number;
  candidates: HedgeCandidate[];
}

/** Which hedge candidate is open in the drawer: position index + candidate index. */
export interface HedgeSelection {
  pi: number;
  ri: number;
}

export const HEDGE_POSITIONS: HedgePosition[] = [
  {
    id: "hedge-fed-jul",
    name: "Fed July cut",
    side: "YES",
    exposure: "$28,400",
    exposureValue: 28400,
    candidates: [
      { id: "hedge-fed-sep", market: "Fed cuts in September", price: "41¢", relation: "Correlated", correlation: 0.62, rationale: "Moves with this position" },
      { id: "hedge-cpi", market: "CPI above 3.5% in July", price: "33¢", relation: "Inverse", correlation: -0.55, rationale: "Offsets a hot inflation print" },
      { id: "hedge-10y", market: "10Y yield above 4.5%", price: "55¢", relation: "Inverse", correlation: -0.70, rationale: "Rates hedge" },
    ],
  },
  {
    id: "hedge-ai-capex",
    name: "AI capex beat",
    side: "YES",
    exposure: "$22,100",
    exposureValue: 22100,
    candidates: [
      { id: "hedge-nvda", market: "NVDA beats Q3 earnings", price: "62¢", relation: "Correlated", correlation: 0.74, rationale: "Same AI demand thesis" },
      { id: "hedge-ai-slow", market: "AI capex slowdown by 2026", price: "28¢", relation: "Inverse", correlation: -0.81, rationale: "Direct offset" },
    ],
  },
  {
    id: "hedge-brent",
    name: "Brent above 90",
    side: "NO",
    exposure: "$12,700",
    exposureValue: 12700,
    candidates: [
      { id: "hedge-opec", market: "OPEC cuts output in Q3", price: "47¢", relation: "Inverse", correlation: -0.58, rationale: "Supply shock hedge" },
      { id: "hedge-recession", market: "US recession in 2026", price: "35¢", relation: "Correlated", correlation: 0.49, rationale: "Demand side" },
    ],
  },
];

/* ---- Portfolio · Command Center ---- */
export type SignalTag = "Opportunity" | "Risk" | "Info";

export interface Signal {
  id: string;
  tag: SignalTag;
  title: string;
  sub: string;
  action: string;
}

export type AlertStatus = "Active" | "Triggered";

export interface PositionAlert {
  id: string;
  market: string;
  condition: string;
  status: AlertStatus;
}

export const SIGNALS: Signal[] = [
  { id: "sig-astor", tag: "Opportunity", title: "ASTOR up 12%, near your target", sub: "ASELS basket · consider taking profit", action: "Review" },
  { id: "sig-fed-drop", tag: "Risk", title: "Fed July cut odds dropped 8% in 1h", sub: "Fed July cut YES · $28,400 exposure", action: "Hedge" },
  { id: "sig-cpi", tag: "Info", title: "CPI print in 2 days", sub: "3 positions sensitive to this event", action: "View" },
  { id: "sig-nvda", tag: "Opportunity", title: "NVDA earnings beat consensus", sub: "AI capex beat YES moving your way", action: "Review" },
];

export const ALERTS: PositionAlert[] = [
  { id: "alert-fed", market: "Fed July cut", condition: "Odds below 55%", status: "Active" },
  { id: "alert-brent", market: "Brent above 90", condition: "Price above 60¢", status: "Active" },
  { id: "alert-ai", market: "AI capex beat", condition: "P&L above $5k", status: "Triggered" },
];

/* ---- Portfolio · Translator ---- */
export const TRANSLATE_GROUPS = ["Narrative", "Asset", "Horizon"] as const;

export interface TranslateRow {
  id: string;
  position: string;
  side: HoldingSide;
  narrative: string;
  assets: string;
  horizon: string;
  exposure: string;
}

export const TRANSLATE: TranslateRow[] = [
  { id: "tr-fed", position: "Fed July cut", side: "YES", narrative: "Dovish Fed", assets: "Long bonds, Gold", horizon: "Short (Jul)", exposure: "$28,400" },
  { id: "tr-ai", position: "AI capex beat", side: "YES", narrative: "AI buildout", assets: "NVDA, Semis", horizon: "Medium (Q3)", exposure: "$22,100" },
  { id: "tr-brent", position: "Brent above 90", side: "NO", narrative: "Soft energy", assets: "Short oil, Airlines", horizon: "Short (Aug)", exposure: "$12,700" },
  { id: "tr-recession", position: "US recession 2026", side: "NO", narrative: "Soft landing", assets: "Equities, Credit", horizon: "Long (2026)", exposure: "$9,400" },
];

/* ---- Portfolio · Scenario Engine ---- */
export interface ScenarioLeg {
  position: string;
  /** Projected USD delta at 100% severity; scaled by the severity slider. */
  delta: number;
}

export interface Scenario {
  id: string;
  name: string;
  legs: ScenarioLeg[];
}

/** Portfolio value the scenario engine projects from (matches the Overview total). */
export const SCENARIO_PORTFOLIO_BASE = 577620;

export const SCENARIOS: Scenario[] = [
  {
    id: "scn-fed",
    name: "Fed cuts in July",
    legs: [
      { position: "Fed July cut · YES", delta: 9200 },
      { position: "10Y above 4.5% · NO", delta: 1800 },
      { position: "AI capex beat · YES", delta: 2400 },
    ],
  },
  {
    id: "scn-recession",
    name: "US recession 2026",
    legs: [
      { position: "US recession · NO", delta: -6400 },
      { position: "Brent above 90 · NO", delta: 2100 },
      { position: "AI capex beat · YES", delta: -3800 },
    ],
  },
  {
    id: "scn-oil",
    name: "Oil supply shock",
    legs: [
      { position: "Brent above 90 · NO", delta: -5600 },
      { position: "OPEC cuts Q3 · YES", delta: 1200 },
      { position: "US recession · NO", delta: -900 },
    ],
  },
];

/* ---- Social ---- */
export interface TraderTrade {
  market: string;
  side: HoldingSide;
  pnl: string;
}

export interface Trader {
  id: string;
  name: string;
  hue: number;
  roi: string;
  win: string;
  /** Risk score out of 7. */
  risk: number;
  drawdown: string;
  copiers: string;
  monthly: string;
  tags: string[];
  recent: TraderTrade[];
}

export const TRADERS: Trader[] = [
  { id: "apex", name: "@apex_trades", hue: 210, roi: "+142%", win: "71%", risk: 4, drawdown: "18%", copiers: "2,481", monthly: "+$28.4k", tags: ["Politics", "Whale"], recent: [{ market: "Fed July cut", side: "YES", pnl: "+$1,240" }, { market: "Brent above 90", side: "NO", pnl: "+$680" }, { market: "NVDA beats Q3", side: "YES", pnl: "-$210" }] },
  { id: "delta", name: "@deltaone", hue: 160, roi: "+118%", win: "66%", risk: 3, drawdown: "12%", copiers: "1,905", monthly: "+$19.2k", tags: ["Econ"], recent: [{ market: "US recession 2026", side: "NO", pnl: "+$420" }, { market: "CPI above 3.5%", side: "NO", pnl: "+$890" }] },
  { id: "wizard", name: "@marketwizard", hue: 280, roi: "+97%", win: "63%", risk: 5, drawdown: "24%", copiers: "1,540", monthly: "+$14.8k", tags: ["Crypto", "Whale"], recent: [{ market: "AI capex beat", side: "YES", pnl: "+$3,100" }, { market: "OPEC cuts Q3", side: "NO", pnl: "-$540" }] },
  { id: "nova", name: "@nova_fade", hue: 20, roi: "+84%", win: "69%", risk: 2, drawdown: "9%", copiers: "1,122", monthly: "+$11.3k", tags: ["Politics"], recent: [{ market: "Fed September cut", side: "YES", pnl: "+$610" }] },
  { id: "orca", name: "@orca_macro", hue: 340, roi: "+72%", win: "61%", risk: 4, drawdown: "16%", copiers: "884", monthly: "+$8.9k", tags: ["Econ", "Sports"], recent: [{ market: "10Y above 4.5%", side: "NO", pnl: "+$300" }] },
];

export const findTrader = (id: string) => TRADERS.find((t) => t.id === id);

export interface TopComment {
  user: string;
  text: string;
}

/**
 * The personalized "For You" feed is a stream of mixed card types, each with a
 * reason line. Modeled as a discriminated union so each card carries only its fields.
 */
export type FeedPost =
  | {
      id: string;
      type: "trade";
      traderId: string;
      reason: string;
      caption: string;
      market: string;
      side: HoldingSide;
      odds: string;
      size: string;
      pnl: string;
      likes: number;
      comments: number;
      reposts: number;
      topComment?: TopComment;
    }
  | {
      id: string;
      type: "success";
      traderId: string;
      reason: string;
      text: string;
      stat: string;
      likes: number;
      comments: number;
      reposts: number;
      topComment?: TopComment;
    }
  | { id: string; type: "live"; traderId: string; reason: string; title: string; viewers: string }
  | { id: string; type: "suggest"; traderId: string; reason: string }
  | { id: string; type: "whale"; reason: string; text: string; market: string; side: HoldingSide }
  | { id: string; type: "move"; reason: string; text: string; market: string; side: HoldingSide; delta: string };

export const FEED_TABS = ["For You", "Following", "Live", "Trades"] as const;

export const FEED: FeedPost[] = [
  { id: "feed-apex-trade", type: "trade", traderId: "apex", reason: "Because you follow @apex_trades", caption: "Loading up on rate cuts before CPI. Macro setup is clean.", market: "Fed July cut", side: "YES", odds: "63¢", size: "$12,000", pnl: "+$1,240", likes: 142, comments: 18, reposts: 9, topComment: { user: "@deltaone", text: "clean entry, in with you" } },
  { id: "feed-fed-move", type: "move", reason: "Moved in your watchlist", text: "Fed July cut jumped +8% in the last hour", market: "Fed July cut", side: "YES", delta: "+8%" },
  { id: "feed-apex-live", type: "live", traderId: "apex", reason: "Popular in Politics right now", title: "Macro session: CPI preview", viewers: "1.2k" },
  { id: "feed-wizard-success", type: "success", traderId: "wizard", reason: "Trending this week", text: "Closed the month at +$14.8k, 63% win rate. Held to resolution, patience pays.", stat: "+$14.8k", likes: 231, comments: 42, reposts: 21, topComment: { user: "@nova_fade", text: "the discipline is unreal" } },
  { id: "feed-delta-trade", type: "trade", traderId: "delta", reason: "Because you view Econ markets", caption: "Fading the crowd on this one.", market: "US recession 2026", side: "NO", odds: "35¢", size: "$8,500", pnl: "+$420", likes: 88, comments: 7, reposts: 4 },
  { id: "feed-orca-suggest", type: "suggest", traderId: "orca", reason: "Trades Econ and energy like you" },
  { id: "feed-ai-whale", type: "whale", reason: "Smart money in a market you watch", text: "A top wallet just bought $48k YES", market: "AI capex beat", side: "YES" },
  { id: "feed-nova-trade", type: "trade", traderId: "nova", reason: "Rising in Politics", caption: "Small starter position, will add on dips.", market: "Fed September cut", side: "YES", odds: "44¢", size: "$3,200", pnl: "+$180", likes: 54, comments: 5, reposts: 2 },
];

export interface LiveStream {
  id: string;
  traderId: string;
  title: string;
  viewers: string;
}

export const LIVE_STREAMS: LiveStream[] = [
  { id: "live-apex", traderId: "apex", title: "Macro session: CPI preview", viewers: "1.2k" },
  { id: "live-wizard", traderId: "wizard", title: "Live: trading the debate", viewers: "864" },
  { id: "live-delta", traderId: "delta", title: "Econ open: jobless claims", viewers: "412" },
  { id: "live-orca", traderId: "orca", title: "Oil and energy desk", viewers: "289" },
];

export interface CopySuggestion {
  id: string;
  reason: string;
}

export const WHO_TO_COPY: CopySuggestion[] = [
  { id: "orca", reason: "Trades Econ like you" },
  { id: "nova", reason: "Low risk, Politics focus" },
  { id: "delta", reason: "Popular with people you follow" },
];

export interface Friend {
  name: string;
  online: boolean;
}

export const FRIENDS: Friend[] = [
  { name: "@deltaone", online: true },
  { name: "@marketwizard", online: true },
  { name: "@nova_fade", online: false },
];

export type CopyMode = "proportional" | "fixed";
export type TraderDrawerMode = "overview" | "copy";

/** Mock balance used by the copy-trading allocation controls. */
export const COPY_BALANCE = 50000;

/** Which trader drawer is open + which mode it opened in. */
export interface TraderSelection {
  id: string;
  mode: TraderDrawerMode;
}

/* ---- Rewards ---- */
export type QuestState = "progress" | "claim" | "action";

export interface Quest {
  id: string;
  title: string;
  xp: string;
  sub: string;
  state: QuestState;
  pct?: number;
  claimLabel?: string;
  actionLabel?: string;
}

export const QUESTS: Quest[] = [
  { id: "quest-trades", title: "Place 10 trades this week", xp: "+200 XP", sub: "6 of 10", pct: 60, state: "progress" },
  { id: "quest-volume", title: "Reach $10k trading volume", xp: "+1,000 XP", sub: "$6.4k of $10k", pct: 64, state: "progress" },
  { id: "quest-streak", title: "3-day login streak", xp: "+150 XP", sub: "Complete, ready to claim", state: "claim", claimLabel: "Claim +150 XP" },
  { id: "quest-refer", title: "Refer a friend who trades", xp: "+500 XP", sub: "Not started", state: "action", actionLabel: "Get referral link" },
  { id: "quest-fade", title: "Win a contrarian fade", xp: "+300 XP", sub: "0 of 1 · take the minority side and win", pct: 0, state: "progress" },
  { id: "quest-hold", title: "Hold a position to resolution", xp: "+400 XP", sub: "0 of 1", pct: 0, state: "progress" },
];

export interface LeaderRow {
  rank: string;
  user: string;
  xp: string;
}

export const LEADERS: LeaderRow[] = [
  { rank: "1", user: "@apex_trades", xp: "184k XP" },
  { rank: "2", user: "@deltaone", xp: "156k XP" },
  { rank: "3", user: "@marketwizard", xp: "142k XP" },
];
