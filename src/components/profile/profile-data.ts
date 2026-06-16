import { TRADERS, findTrader } from "@/lib/mock";
import type { CopyMode, HoldingSide, Trader, TraderTrade } from "@/lib/mock";

/* ---- Profile mock data ----
 * Self-contained so the shell, routing, tokens, and /lib/mock stay untouched.
 * A real API can replace getProfile() later; the shapes are stable. */

export type RoiRange = "1M" | "6M" | "1Y" | "All";
export const ROI_RANGES: RoiRange[] = ["1M", "6M", "1Y", "All"];

export interface ProfilePost {
  id: string;
  time: string;
  text: string;
  attach?: { side: HoldingSide; market: string; pnl: string };
  likes: number;
  comments: number;
  reposts: number;
}

export interface ProfileTrade {
  id: string;
  side: HoldingSide;
  market: string;
  entry: string;
  exit: string;
  size: string;
  pnl: string;
  up: boolean;
  date: string;
}

export type PositionStatus = "Active" | "Near Resolution" | "In Review";

export interface ProfilePosition {
  id: string;
  side: HoldingSide;
  market: string;
  exposure: string;
  pnl: string;
  up: boolean;
  status: PositionStatus;
}

export interface CompositionSegment {
  label: string;
  pct: number;
  color: string;
}

export interface PerfRow {
  period: string;
  trades: number;
  win: string;
  roi: string;
  pnl: string;
  up: boolean;
}

export type CopyStatus = "Active" | "Paused" | "Pending Close";

export interface CopyRow {
  traderId: string;
  name: string;
  hue: number;
  allocation: string;
  mode: CopyMode;
  pnl: string;
  up: boolean;
  status: CopyStatus;
}

export interface ProfileData {
  handle: string;
  isMe: boolean;
  /** Shell follow/copy key (matches Trader.id). null for the current user. */
  traderId: string | null;
  name: string;
  at: string;
  hue: number;
  bio: string;
  tier: string;
  followers: string;
  following: string;
  copiers: string;
  roi: Record<RoiRange, string>;
  win: string;
  risk: number;
  drawdown: string;
  avgHold: string;
  tradesPerWeek: string;
  equity: Record<RoiRange, number[]>;
  copiersMonthly: number[];
  copiersStarted: number;
  copiersStopped: number;
  posts: ProfilePost[];
  trades: ProfileTrade[];
  positions: ProfilePosition[];
  composition: CompositionSegment[];
  monthly: PerfRow[];
  yearly: PerfRow[];
  followingList: Trader[];
  followersList: Trader[];
  copying: CopyRow[];
}

/* ---- helpers ---- */
export const handleOf = (nameOrHandle: string) => nameOrHandle.replace(/^@/, "");
export const profilePath = (nameOrHandle: string) => `/profile/${handleOf(nameOrHandle)}`;

const displayName = (at: string) =>
  handleOf(at)
    .split(/[_.]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const parseNum = (s: string) => Number(s.replace(/[^0-9.-]/g, "")) || 0;
const normMinus = (s: string) => s.replace(/^-/, "−");
const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v))}%`;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic 0..1 generator so a handle always renders the same profile. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- base records ---- */
interface ProfileBase {
  handle: string;
  isMe: boolean;
  traderId: string | null;
  name: string;
  at: string;
  hue: number;
  bio: string;
  tier: string;
  roiAll: string;
  win: string;
  risk: number;
  drawdown: string;
  copiers: string;
  tags: string[];
  recent: TraderTrade[];
}

const TIERS: Record<string, string> = { apex: "Elite", delta: "Pro", wizard: "Pro", nova: "Rising", orca: "Pro" };
const BIOS: Record<string, string> = {
  apex: "Politics and whale flow. Position trader, sizes up when the crowd is offside.",
  delta: "Macro and rates. Slow, systematic, fades consensus when the data disagrees.",
  wizard: "Crypto and event-driven. High conviction, holds through volatility to resolution.",
  nova: "Low-risk politics specialist. Small starters, adds on dips, protects the downside.",
  orca: "Econ and energy desk. Cross-asset macro with a focus on supply-side catalysts.",
};

const ME_RECENT: TraderTrade[] = [
  { market: "Fed July cut", side: "YES", pnl: "+$640" },
  { market: "BTC $150k by Jun 30", side: "NO", pnl: "+$210" },
  { market: "AI capex beat", side: "YES", pnl: "-$90" },
];

const ME: ProfileBase = {
  handle: "me",
  isMe: true,
  traderId: null,
  name: "John Doe",
  at: "@johndoe",
  hue: 220,
  bio: "Macro and crypto, mostly. Building a book of asymmetric event bets and copying a few traders I trust.",
  tier: "Tier 1",
  roiAll: "+38%",
  win: "58%",
  risk: 3,
  drawdown: "14%",
  copiers: "41",
  tags: ["Macro", "Crypto"],
  recent: ME_RECENT,
};

const traderBase = (t: Trader): ProfileBase => ({
  handle: handleOf(t.name),
  isMe: false,
  traderId: t.id,
  name: displayName(t.name),
  at: t.name,
  hue: t.hue,
  bio: BIOS[t.id] ?? `${t.tags.join(" · ")} trader.`,
  tier: TIERS[t.id] ?? "Pro",
  roiAll: t.roi,
  win: t.win,
  risk: t.risk,
  drawdown: t.drawdown,
  copiers: t.copiers,
  tags: t.tags,
  recent: t.recent,
});

/* ---- generators ---- */
function buildEquity(r: () => number, frac: number, pts: number): number[] {
  const eq: number[] = [];
  for (let i = 0; i < pts; i++) {
    const t = i / (pts - 1);
    const env = Math.sin(Math.PI * t);
    const noise = (r() - 0.5) * 0.16 * env;
    eq.push(Math.round((100 * (1 + frac * t + noise)) * 100) / 100);
  }
  eq[0] = 100;
  eq[pts - 1] = Math.round(100 * (1 + frac) * 100) / 100;
  return eq;
}

const sliceChange = (s: number[]) => (s[s.length - 1] / s[0] - 1) * 100;

function buildCopiers(r: () => number, peak: number): number[] {
  const out: number[] = [];
  let v = peak * 0.45;
  for (let i = 0; i < 12; i++) {
    v += (r() - 0.32) * peak * 0.12;
    v = Math.max(peak * 0.18, Math.min(peak * 1.05, v));
    out.push(Math.round(v));
  }
  out[11] = peak;
  return out;
}

const POST_CAPTIONS = [
  "Loading up here. The setup is clean and the crowd is offside.",
  "Holding to resolution. Patience is the edge most people skip.",
  "Trimmed risk into the move. Booking the win, keeping a runner.",
  "Fading the consensus on this one. Risk is defined.",
  "This catalyst looks underpriced. Adding on any dip.",
  "Closed the month green. Process over outcome, every time.",
  "Watching the tape into the print. No position is also a position.",
  "Scaling in slowly. No need to be a hero on the entry.",
];
const POST_TIMES = ["2h", "6h", "1d", "2d", "4d", "1w"];

function buildPosts(r: () => number, recent: TraderTrade[]): ProfilePost[] {
  return Array.from({ length: 3 }, (_, i) => {
    const cap = POST_CAPTIONS[Math.floor(r() * POST_CAPTIONS.length)];
    const rt = recent[i % recent.length];
    const attach = r() > 0.4 && rt ? { side: rt.side, market: rt.market, pnl: normMinus(rt.pnl) } : undefined;
    return {
      id: `post-${i}`,
      time: POST_TIMES[i],
      text: cap,
      attach,
      likes: 20 + Math.round(r() * 230),
      comments: 2 + Math.round(r() * 40),
      reposts: 1 + Math.round(r() * 24),
    };
  });
}

const TRADE_DATES = ["Jun 14", "Jun 11", "Jun 6", "May 30", "May 22", "May 9"];
const TRADE_EXTRA: Array<{ market: string; side: HoldingSide }> = [
  { market: "S&P 500 new high in Q3", side: "YES" },
  { market: "Powell signals a cut", side: "YES" },
  { market: "Govt shutdown before Oct", side: "NO" },
  { market: "ETH ETF net inflows", side: "YES" },
];

function buildTrades(r: () => number, recent: TraderTrade[]): ProfileTrade[] {
  const fromRecent = recent.map((rt) => ({
    market: rt.market,
    side: rt.side,
    up: !rt.pnl.trim().startsWith("-"),
    pnl: normMinus(rt.pnl),
  }));
  const fromExtra = TRADE_EXTRA.map((e) => {
    const up = r() > 0.32;
    const v = Math.round(120 + r() * 1800);
    return { market: e.market, side: e.side, up, pnl: `${up ? "+$" : "−$"}${v.toLocaleString()}` };
  });
  return [...fromRecent, ...fromExtra].slice(0, 6).map((b, i) => {
    const entry = 38 + Math.round(r() * 22);
    const drift = 4 + Math.round(r() * 14);
    const exit = b.up ? Math.min(96, entry + drift) : Math.max(6, entry - drift);
    const size = (2 + Math.round(r() * 13)) * 1000;
    return {
      id: `trade-${i}`,
      side: b.side,
      market: b.market,
      entry: `${entry}¢`,
      exit: `${exit}¢`,
      size: `$${size.toLocaleString()}`,
      pnl: b.pnl,
      up: b.up,
      date: TRADE_DATES[i],
    };
  });
}

const POS_POOL: Array<{ market: string; side: HoldingSide }> = [
  { market: "Fed July cut", side: "YES" },
  { market: "AI capex beat", side: "YES" },
  { market: "Brent above 90", side: "NO" },
  { market: "US recession 2026", side: "NO" },
  { market: "Trump approval > 45%", side: "YES" },
  { market: "BTC $150k by Jun 30", side: "NO" },
];
const POS_STATUS: PositionStatus[] = ["Active", "Active", "Near Resolution", "In Review"];

function buildPositions(r: () => number): ProfilePosition[] {
  const start = Math.floor(r() * POS_POOL.length);
  return Array.from({ length: 4 }, (_, i) => {
    const p = POS_POOL[(start + i) % POS_POOL.length];
    const up = r() > 0.3;
    const exp = (5 + Math.round(r() * 25)) * 1000;
    const pnlv = Math.round((0.04 + r() * 0.14) * exp);
    return {
      id: `pos-${i}`,
      side: p.side,
      market: p.market,
      exposure: `$${exp.toLocaleString()}`,
      pnl: `${up ? "+$" : "−$"}${pnlv.toLocaleString()}`,
      up,
      status: POS_STATUS[i],
    };
  });
}

const CAT_POOL = ["Politics", "Crypto", "Macro", "Energy", "Sports", "AI"];
const CAT_MAP: Record<string, string> = { Politics: "Politics", Econ: "Macro", Crypto: "Crypto", Whale: "Crypto", Sports: "Sports" };
const CAT_COLORS = ["#1e3a8a", "#2563eb", "#60a5fa", "#bfdbfe"];

function buildComposition(r: () => number, tags: string[]): CompositionSegment[] {
  const labels: string[] = [];
  for (const t of tags) {
    const m = CAT_MAP[t] ?? t;
    if (!labels.includes(m)) labels.push(m);
  }
  for (const c of CAT_POOL) {
    if (labels.length >= 4) break;
    if (!labels.includes(c)) labels.push(c);
  }
  const chosen = labels.slice(0, 4);
  const weights = chosen.map(() => 1 + r());
  const sum = weights.reduce((a, b) => a + b, 0);
  const segs = chosen.map((label, i) => ({ label, pct: Math.round((weights[i] / sum) * 100), color: CAT_COLORS[i] }));
  const total = segs.reduce((a, s) => a + s.pct, 0);
  segs[0].pct += 100 - total;
  return segs;
}

function buildPerf(r: () => number, periods: string[], scale: number, downIndex: number): PerfRow[] {
  return periods.map((period, i) => {
    const down = i === downIndex;
    const roiv = down ? -(2 + Math.round(r() * 8)) : 3 + Math.round(r() * 16);
    const up = roiv >= 0;
    const trades = Math.round((20 + r() * 70) * scale);
    const win = `${52 + Math.round(r() * 22)}%`;
    const pnlv = Math.round(Math.abs(roiv) * (180 + r() * 220) * scale);
    return {
      period,
      trades,
      win,
      roi: `${up ? "+" : "−"}${Math.abs(roiv)}%`,
      pnl: `${up ? "+$" : "−$"}${pnlv.toLocaleString()}`,
      up,
    };
  });
}

const MONTHS = ["Jun 2026", "May 2026", "Apr 2026", "Mar 2026", "Feb 2026", "Jan 2026"];
const YEARS = ["2026 YTD", "2025", "2024"];

const SEED_COPIES: Array<Omit<CopyRow, "name" | "hue">> = [
  { traderId: "apex", allocation: "$12,500", mode: "proportional", pnl: "+$1,840", up: true, status: "Active" },
  { traderId: "delta", allocation: "$6,000", mode: "fixed", pnl: "+$420", up: true, status: "Active" },
  { traderId: "nova", allocation: "$4,000", mode: "proportional", pnl: "−$120", up: false, status: "Paused" },
  { traderId: "orca", allocation: "$3,000", mode: "fixed", pnl: "+$90", up: true, status: "Pending Close" },
];

function buildProfile(base: ProfileBase): ProfileData {
  const r = mulberry32(hashString(base.handle));

  const allFrac = parseNum(base.roiAll) / 100;
  const pts = 72;
  const eqAll = buildEquity(r, allFrac, pts);
  const equity: Record<RoiRange, number[]> = {
    "1M": eqAll.slice(pts - 6),
    "6M": eqAll.slice(pts - 18),
    "1Y": eqAll.slice(pts - 36),
    All: eqAll,
  };
  const roi: Record<RoiRange, string> = {
    "1M": pct(sliceChange(equity["1M"])),
    "6M": pct(sliceChange(equity["6M"])),
    "1Y": pct(sliceChange(equity["1Y"])),
    All: base.roiAll,
  };

  const copiersNum = parseNum(base.copiers);
  const followers = Math.round(copiersNum * 2.4 + r() * 800 + 120);
  const followingN = 48 + Math.round(r() * 180);

  const others = TRADERS.filter((t) => t.id !== base.traderId);
  const copying: CopyRow[] = base.isMe
    ? SEED_COPIES.map((c) => {
        const t = findTrader(c.traderId);
        return { ...c, name: t ? t.name : c.traderId, hue: t ? t.hue : 210 };
      })
    : [];

  return {
    handle: base.handle,
    isMe: base.isMe,
    traderId: base.traderId,
    name: base.name,
    at: base.at,
    hue: base.hue,
    bio: base.bio,
    tier: base.tier,
    followers: followers.toLocaleString(),
    following: followingN.toLocaleString(),
    copiers: base.copiers,
    roi,
    win: base.win,
    risk: base.risk,
    drawdown: base.drawdown,
    avgHold: `${((8 - base.risk) * 1.1 + 1).toFixed(1)}d`,
    tradesPerWeek: String(Math.round(base.risk * 4 + r() * 6)),
    equity,
    copiersMonthly: buildCopiers(r, Math.max(copiersNum, 40)),
    copiersStarted: 6 + Math.round(r() * 38),
    copiersStopped: 1 + Math.round(r() * 12),
    posts: buildPosts(r, base.recent),
    trades: buildTrades(r, base.recent),
    positions: buildPositions(r),
    composition: buildComposition(r, base.tags),
    monthly: buildPerf(r, MONTHS, 1, 3),
    yearly: buildPerf(r, YEARS, 4, -1),
    followingList: base.isMe ? others.slice(0, 4) : others.slice(0, 3),
    followersList: base.isMe ? others : others.slice(0, 4),
    copying,
  };
}

export function getProfile(handle: string): ProfileData | null {
  if (handle === "me") return buildProfile(ME);
  const t = TRADERS.find((x) => handleOf(x.name) === handle);
  return t ? buildProfile(traderBase(t)) : null;
}
