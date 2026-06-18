import type { FeaturedMarket, HoldingSide } from "@/lib/mock";

/* Natural-language Scenario Engine — mock interpreter.
   A typed query maps to one of a few predefined results; anything unrecognized
   falls back to the closest example (see resolveScenario). Wired so a real
   model + portfolio service can drop in behind the same shapes later. */

export type ScenarioResolution = "wins" | "loses" | "unchanged";

/** How one held position fares under a scenario. Reused by Command Center staging. */
export interface ScenarioPositionResult {
  id: string;
  name: string;
  side: HoldingSide;
  resolution: ScenarioResolution;
  /** Projected USD P&L delta under the scenario. */
  pnlDelta: number;
  /** One-line reason the scenario moves this position. */
  note: string;
}

/** A market the user doesn't hold that the scenario moves, with a suggested trade. */
export interface ScenarioRelatedMarket {
  id: string;
  /** Projected move, e.g. "+14¢ to YES". */
  move: string;
  direction: "up" | "down";
  /** Side the scenario favors — drives the order-ticket prefill intent. */
  suggestedSide: "yes" | "no";
  rationale: string;
  /** Full market so the existing order ticket opens prefilled. */
  market: FeaturedMarket;
}

export interface ScenarioResult {
  id: string;
  /** Quick-start chip label. */
  label: string;
  /** Plain-language restatement of what the scenario assumes. */
  interpretation: string;
  /** Lowercase substrings that route a free-text query to this result. */
  keywords: string[];
  positions: ScenarioPositionResult[];
  relatedMarkets: ScenarioRelatedMarket[];
}

export interface ResolvedScenario {
  result: ScenarioResult;
  /** false when no keyword matched and we fell back to the closest example. */
  matched: boolean;
}

// Minimal featured-market factory so related markets can feed the order ticket.
const market = (id: string, title: string, yes: number, venue = "Kalshi"): FeaturedMarket => ({
  id,
  title,
  venue,
  volumeLabel: "$1.2M Vol",
  yes,
  no: 100 - yes,
  yesSeries: [yes - 6, yes - 3, yes - 4, yes, yes + 2, yes],
  noSeries: [100 - yes + 6, 100 - yes + 3, 100 - yes + 4, 100 - yes, 100 - yes - 2, 100 - yes],
});

export const SCENARIO_RESULTS: ScenarioResult[] = [
  {
    id: "scn-rates-5",
    label: "Rates rise to 5%",
    interpretation: "The policy rate climbs to 5.00% — real yields rise, risk assets de-rate, and rate-sensitive markets reprice.",
    keywords: ["interest rate", "rates rise", "rate rise", "rates to 5", "5%", "5 percent", "rates", "interest", "hike", "tighten", "tightening"],
    positions: [
      { id: "p-fed-cut", name: "Fed cut Jul · Yes", side: "YES", resolution: "loses", pnlDelta: -3400, note: "A hike to 5% kills the July-cut thesis" },
      { id: "p-btc", name: "BTC $150k · Yes", side: "YES", resolution: "loses", pnlDelta: -5200, note: "Higher real rates pressure risk assets" },
      { id: "p-eth", name: "ETH $4k · No", side: "NO", resolution: "wins", pnlDelta: 1900, note: "Risk-off keeps ETH under $4k" },
      { id: "p-10y", name: "10Y above 4.5% · No", side: "NO", resolution: "loses", pnlDelta: -2700, note: "The hike drags the 10Y back above 4.5%" },
      { id: "p-ai", name: "AI capex beat · Yes", side: "YES", resolution: "unchanged", pnlDelta: -300, note: "Capex cycle is rate-insensitive near term" },
    ],
    relatedMarkets: [
      { id: "r-ff5", move: "+14¢ to YES", direction: "up", suggestedSide: "yes", rationale: "Directly priced by a move to 5%", market: market("ff-above-5", "Fed funds above 5% by Q3", 41) },
      { id: "r-spx", move: "−9¢ to YES", direction: "down", suggestedSide: "no", rationale: "De-rating caps the index", market: market("spx-6000", "S&P 500 closes above 6,000 in 2026", 56) },
      { id: "r-jpy", move: "+8¢ to YES", direction: "up", suggestedSide: "yes", rationale: "Widening rate differential lifts the dollar", market: market("usdjpy-160", "USD/JPY above 160 this year", 54) },
    ],
  },
  {
    id: "scn-fed-hold",
    label: "Fed holds in July",
    interpretation: "The FOMC keeps the target range unchanged at the July meeting — no cut, no hike.",
    keywords: ["fed hold", "fed holds", "holds", "hold", "pause", "unchanged", "july", "fomc", "no cut", "stays"],
    positions: [
      { id: "p-fed-cut", name: "Fed cut Jul · Yes", side: "YES", resolution: "loses", pnlDelta: -2600, note: "A hold means no July cut" },
      { id: "p-btc", name: "BTC $150k · Yes", side: "YES", resolution: "unchanged", pnlDelta: -300, note: "A hold is largely priced in" },
      { id: "p-eth", name: "ETH $4k · No", side: "NO", resolution: "unchanged", pnlDelta: 120, note: "Little spot impact from a hold" },
      { id: "p-10y", name: "10Y above 4.5% · No", side: "NO", resolution: "unchanged", pnlDelta: 200, note: "The curve barely moves on a hold" },
      { id: "p-ai", name: "AI capex beat · Yes", side: "YES", resolution: "unchanged", pnlDelta: 0, note: "No read-through to AI capex" },
    ],
    relatedMarkets: [
      { id: "r-sep", move: "+6¢ to YES", direction: "up", suggestedSide: "yes", rationale: "A hold pushes the cut to September", market: market("fed-sep-cut", "Fed cuts by September", 58) },
      { id: "r-two", move: "−5¢ to YES", direction: "down", suggestedSide: "no", rationale: "Patience trims the 2026 cut count", market: market("two-cuts-26", "Two or more cuts in 2026", 43) },
    ],
  },
  {
    id: "scn-btc-drop",
    label: "BTC drops 20%",
    interpretation: "Bitcoin sells off 20% — the move propagates across crypto-linked and levered-proxy markets.",
    keywords: ["btc", "bitcoin", "crypto crash", "crypto selloff", "drops 20", "drop 20", "drops", "drop", "selloff", "sell off", "-20", "20%", "crash"],
    positions: [
      { id: "p-btc", name: "BTC $150k · Yes", side: "YES", resolution: "loses", pnlDelta: -7800, note: "A 20% drop puts $150k out of reach" },
      { id: "p-eth", name: "ETH $4k · No", side: "NO", resolution: "wins", pnlDelta: 2400, note: "A crypto-wide selloff keeps ETH under $4k" },
      { id: "p-fed-cut", name: "Fed cut Jul · Yes", side: "YES", resolution: "unchanged", pnlDelta: 400, note: "Risk-off nudges cut odds up slightly" },
      { id: "p-10y", name: "10Y above 4.5% · No", side: "NO", resolution: "unchanged", pnlDelta: 150, note: "Mild flight-to-quality bid" },
      { id: "p-ai", name: "AI capex beat · Yes", side: "YES", resolution: "unchanged", pnlDelta: 0, note: "No crypto read-through" },
    ],
    relatedMarkets: [
      { id: "r-eth3k", move: "+15¢ to YES", direction: "up", suggestedSide: "yes", rationale: "Correlated crypto drawdown", market: market("eth-below-3k", "ETH below $3k this quarter", 44) },
      { id: "r-btc130", move: "−11¢ to YES", direction: "down", suggestedSide: "no", rationale: "The selloff erodes the path higher", market: market("btc-130-eoy", "BTC above $130k by year-end", 55) },
      { id: "r-mstr", move: "+9¢ to YES", direction: "up", suggestedSide: "yes", rationale: "Levered BTC proxy amplifies the drop", market: market("mstr-1000", "MicroStrategy below $1,000", 42) },
    ],
  },
];

/** Map a free-text scenario to a result. Scores keyword hits; no hit → closest example. */
export function resolveScenario(query: string): ResolvedScenario {
  const q = query.toLowerCase();
  let best: ScenarioResult | null = null;
  let bestScore = 0;
  for (const s of SCENARIO_RESULTS) {
    const score = s.keywords.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  if (best && bestScore > 0) return { result: best, matched: true };
  return { result: SCENARIO_RESULTS[0], matched: false };
}
