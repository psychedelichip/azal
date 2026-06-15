import { useState } from "react";
import {
  Flame, ChevronDown, ChevronRight, ChevronLeft, LayoutGrid, Share2, Gift, Settings,
  PanelLeft, Search, Wallet, CircleDollarSign, ArrowDownToLine, Star, Bell, MoreHorizontal,
  Plus, ArrowRight, MessageSquare, Pencil, X, GripVertical,
  PieChart, Gauge, Languages, GitBranch, Shield, Copy, Trash2, Link2,
  TrendingDown, Info, Radio, Heart
} from "lucide-react";

const TRENDING = ["Silver", "China", "Midterms", "Weather", "Crypto Prices", "Movies", "Parlays", "ICE", "Ukraine", "Epstein"];
const LIVE = ["Lakers @ Celtics", "Fed rate decision", "Greenland vote", "NATO summit", "Oscars 2026", "Primaries"];

const PILLS = ["Trending", "Crypto", "Politics"];
const SECTIONS = ["All sections", "Crypto", "Politics", "Economics", "Sports", "Weather", "Companies"];
const MARKETS = [
  { q: "Will BTC hit $150k by Jun 30?", pct: 7, vol: "$544k vol", time: "12:42:48 left", y: 7, n: 93, section: "Crypto" },
  { q: "Fed cuts rates in July?", pct: 38, vol: "$1.2M vol", time: "21d left", y: 38, n: 62, section: "Economics" },
  { q: "Trump approval > 45% end Q2?", pct: 52, vol: "$890k vol", time: "18d left", y: 52, n: 48, section: "Politics" },
  { q: "ETH above $4k by Jul 1?", pct: 44, vol: "$410k vol", time: "22d left", y: 44, n: 56, section: "Crypto" },
  { q: "Gov shutdown before October?", pct: 29, vol: "$320k vol", time: "open", y: 29, n: 71, section: "Politics" },
  { q: "Lakers win NBA title?", pct: 12, vol: "$760k vol", time: "live", y: 12, n: 88, section: "Sports" },
  { q: "AI safety bill passes Senate?", pct: 18, vol: "$140k vol", time: "40d left", y: 18, n: 82, section: "Politics" },
  { q: "Rain in NYC tomorrow?", pct: 71, vol: "$22k vol", time: "14h left", y: 71, n: 29, section: "Weather" },
];

const FEATURED = [
  { title: "Will BTC hit $150k by Jun 30, 2026?", venue: "Kalshi", vol: "$544,393 vol", yes: 7, no: 93,
    a: [12, 10, 14, 9, 11, 8, 10, 9, 7], b: [88, 90, 86, 91, 89, 92, 90, 91, 93] },
  { title: "Fed cuts rates in July?", venue: "Kalshi", vol: "$1.2M vol", yes: 38, no: 62,
    a: [30, 33, 31, 36, 34, 37, 35, 39, 38], b: [70, 67, 69, 64, 66, 63, 65, 61, 62] },
  { title: "Trump approval > 45% end Q2?", venue: "Polymarket", vol: "$890k vol", yes: 52, no: 48,
    a: [48, 50, 47, 53, 51, 49, 54, 50, 52], b: [52, 50, 53, 47, 49, 51, 46, 50, 48] },
];

const INTEL = [
  { score: 92, text: "BTC market reacted +2.4% to Reuters headline" },
  { score: 87, text: "Your ETH position near a resolution catalyst" },
  { score: 74, text: "High disagreement detected on Fed-cut market" },
];
const CATALYSTS = [
  { day: "18", mon: "JUN", title: "ETH token unlock", link: "ETH above $4k" },
  { day: "30", mon: "JUL", title: "Fed rate decision", link: "Fed cuts in July" },
  { day: "16", mon: "SEP", title: "Presidential debate", link: "Trump approval" },
];
const POSITIONS = [
  { name: "BTC $150k · Yes", detail: "0.58 → 0.63 · 4,200 sh", pnl: 215 },
  { name: "ETH $4k · No", detail: "0.44 → 0.41 · 1,100 sh", pnl: 48 },
  { name: "Fed cut Jul · Yes", detail: "0.38 → 0.35 · 600 sh", pnl: -22 },
];

const WIDGETS = [
  { key: "markets", name: "Markets tab" },
  { key: "chart", name: "Price chart" },
  { key: "intel", name: "Azal Intel" },
  { key: "catalysts", name: "Catalysts" },
  { key: "positions", name: "Positions" },
  { key: "news", name: "Scraped news" },
];

/* ---- Portfolio page data ---- */
const PSUBPAGES = [
  { key: "Overview" },
  { key: "Command Center", icon: Gauge, desc: "Alerts, quick actions, and live signals across your positions in one place." },
  { key: "Wallets", icon: Wallet, desc: "Connected wallets and balances, deposits and withdrawals." },
  { key: "Translator", icon: Languages, desc: "Map positions to narratives, assets, and time horizons." },
  { key: "Hedging", icon: Shield, desc: "Suggested hedges to offset risk on your open positions." },
  { key: "Scenario Engine", icon: GitBranch, desc: "Run what-if scenarios and see projected portfolio impact." },
];
const PSTATS = [
  { label: "Total portfolio value", value: "$577,620", delta: "incl. $329,200 imported", up: null },
  { label: "Market exposure", value: "$91,300", delta: "16% of portfolio", up: null },
  { label: "Open positions", value: "17", delta: "4 near resolution", up: null },
  { label: "PNL", value: "+$12,840", delta: "▲ 5.4% 24h", up: true, valueColor: "text-green-600" },
];
const NETWORTH_SOURCE = [
  { label: "Prediction markets ($248,420)", pct: 43, color: "#1e3a8a" },
  { label: "Crypto wallets ($247,400)", pct: 43, color: "#2563eb" },
  { label: "Brokerage ($81,800)", pct: 14, color: "#60a5fa" },
];
const PBREAKDOWN = [
  { title: "Group by narrative", segs: [
    { label: "AI", pct: 34, color: "#1e3a8a" }, { label: "Rates", pct: 26, color: "#2563eb" },
    { label: "Geopolitics", pct: 22, color: "#60a5fa" }, { label: "Energy", pct: 18, color: "#bfdbfe" } ]},
  { title: "Group by market", segs: [
    { label: "Kalshi", pct: 58, color: "#1e3a8a" }, { label: "Polymarket", pct: 42, color: "#60a5fa" } ]},
  { title: "Group by asset", segs: [
    { label: "Crypto", pct: 40, color: "#1e3a8a" }, { label: "Equities", pct: 30, color: "#2563eb" },
    { label: "Macro", pct: 18, color: "#60a5fa" }, { label: "Commodities", pct: 12, color: "#bfdbfe" } ]},
  { title: "Group by time horizon", segs: [
    { label: "under 1w", pct: 22, color: "#1e3a8a" }, { label: "1 to 4w", pct: 38, color: "#2563eb" },
    { label: "1 to 3m", pct: 28, color: "#60a5fa" }, { label: "over 3m", pct: 12, color: "#bfdbfe" } ]},
];
const PHOLDINGS = [
  { side: "YES", name: "Fed July cut", exposure: "$28,400", risk: "Medium", pnl: "+$4,220", up: true, status: "Active" },
  { side: "NO", name: "tariff action", exposure: "$16,900", risk: "High", pnl: "−$1,180", up: false, status: "Near Resolution" },
  { side: "YES", name: "AI capex beat", exposure: "$22,100", risk: "Medium", pnl: "+$2,610", up: true, status: "Active" },
  { side: "NO", name: "Brent above 90", exposure: "$12,700", risk: "Low", pnl: "+$940", up: true, status: "In Review" },
];
const PCOLS = "minmax(0,2.4fr) 1fr 1fr 1fr 1.1fr";

function pStatus(s) {
  if (s === "Active") return "text-green-700 border-green-200 bg-green-50";
  if (s === "Near Resolution") return "text-amber-700 border-amber-200 bg-amber-50";
  return "text-gray-500 border-gray-200 bg-gray-50";
}

function SegBar({ segs }) {
  return (
    <div>
      <div className="flex w-full rounded-full overflow-hidden" style={{ height: 8 }}>
        {segs.map((s, i) => <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />)}
      </div>
      <div className="mt-3 space-y-1.5">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2"><span className="rounded-full" style={{ width: 8, height: 8, background: s.color }} /><span className="text-gray-600">{s.label}</span></span>
            <span className="text-gray-900 font-medium">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioOverview({ onManageImported }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Portfolio Overview</h3>
      <div className="grid grid-cols-4 gap-4 mb-7">
        {PSTATS.map((s) => (
          <div key={s.label} className="border border-gray-200 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400">{s.label}</div>
            <div className={`text-2xl font-semibold mt-1 ${s.valueColor || "text-gray-900"}`}>{s.value}</div>
            <div className={`text-xs mt-1 ${s.up === true ? "text-green-600" : s.up === false ? "text-red-500" : "text-gray-400"}`}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Net worth by source</h3>
        <span className="text-xs text-gray-400">Prediction positions and imported holdings, one number</span>
      </div>
      <div className="border border-gray-200 rounded-xl p-4 mb-7">
        <SegBar segs={NETWORTH_SOURCE} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Exposure Breakdown</h3>
      <div className="grid grid-cols-4 gap-4 mb-7">
        {PBREAKDOWN.map((b) => (
          <div key={b.title} className="border border-gray-200 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">{b.title}</div>
            <SegBar segs={b.segs} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Imported assets</h3>
        <button onClick={onManageImported} className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900">Manage <ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="border border-gray-200 rounded-xl p-4 mb-7">
        <div className="flex items-center justify-between mb-3"><div className="text-xs uppercase tracking-wider text-gray-400">Total imported value</div><div className="text-sm font-semibold text-gray-900">$329,200</div></div>
        <SegBar segs={[{ label: "Crypto wallets ($247,400)", pct: 75, color: "#1e3a8a" }, { label: "Brokerage ($81,800)", pct: 25, color: "#60a5fa" }]} />
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <button onClick={onManageImported} className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50"><ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import from wallet</button>
          <button onClick={onManageImported} className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50"><Link2 className="w-4 h-4 text-gray-400" /> Connect brokerage</button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Holdings Table</h3>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400" style={{ gridTemplateColumns: PCOLS }}>
          <span>Position</span><span>Exposure</span><span>Risk</span><span>PNL</span><span>Status</span>
        </div>
        {PHOLDINGS.map((h, i) => (
          <div key={i} className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50" style={{ gridTemplateColumns: PCOLS }}>
            <span className="flex items-center gap-2 min-w-0">
              <span className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 30, height: 30, background: "#7c3aed" }}><span className="rounded-full bg-white" style={{ width: 8, height: 8 }} /></span>
              <span className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${h.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{h.side}</span>
              <span className="text-sm text-gray-900 truncate">{h.name}</span>
            </span>
            <span className="text-sm text-gray-900">{h.exposure}</span>
            <span className={`text-sm ${h.risk === "High" ? "text-red-600" : h.risk === "Medium" ? "text-amber-600" : "text-gray-500"}`}>{h.risk}</span>
            <span className={`text-sm font-medium ${h.up ? "text-green-600" : "text-red-500"}`}>{h.pnl}</span>
            <span><span className={`text-xs border rounded-full px-2 py-0.5 ${pStatus(h.status)}`}>{h.status}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioSub({ page }) {
  const Icon = page.icon;
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">{Icon && <Icon className="w-6 h-6 text-gray-400" />}</div>
      <div className="text-base font-semibold text-gray-900">{page.key}</div>
      <div className="text-sm text-gray-500 mt-1" style={{ maxWidth: 360 }}>{page.desc}</div>
      <div className="text-xs text-gray-300 mt-3 uppercase tracking-wider">Sub page, structure ready</div>
    </div>
  );
}

const INITIAL_WALLETS = [
  { id: 1, label: "Main", address: "0x4a9c...c21F", balance: "$182,400", active: true },
  { id: 2, label: "Hedge book", address: "0x77b3...9e02", balance: "$54,900", active: false },
  { id: 3, label: "Cold storage", address: "bc1q8h...8h7k", balance: "$11,120", active: false },
];

function WalletsPage() {
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [nextId, setNextId] = useState(4);
  const setActive = (id) => setWallets((ws) => ws.map((w) => ({ ...w, active: w.id === id })));
  const remove = (id) => setWallets((ws) => ws.filter((w) => w.id !== id));
  const add = (label) => { const id = nextId; setWallets((ws) => [...ws, { id, label, address: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6), balance: "$0", active: false }]); setNextId((n) => n + 1); };
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Connected wallets</h3>
          <div className="text-xs text-gray-400 mt-0.5">{wallets.length} wallets connected</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => add("Imported wallet")} className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"><ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import wallet</button>
          <button onClick={() => add("New wallet")} className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-2 text-white font-medium" style={{ background: "#0b1220" }}><Plus className="w-4 h-4" /> Create wallet</button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {wallets.map((w, i) => (
          <div key={w.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""} hover:bg-gray-50`}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#ede9fe" }}><Wallet className="w-4 h-4" style={{ color: "#7c3aed" }} /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="text-sm font-medium text-gray-900">{w.label}</span>{w.active && <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Active</span>}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">{w.address}<Copy className="w-3 h-3 hover:text-gray-600" /></div>
            </div>
            <div className="text-sm font-medium text-gray-900">{w.balance}</div>
            {!w.active && <button onClick={() => setActive(w.id)} className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-50">Set active</button>}
            <button onClick={() => remove(w.id)} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {wallets.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-400">No wallets yet. Create or import one.</div>}
      </div>
      <div className="text-xs text-gray-400 mt-3">Created wallets are generated in app; imported wallets use your existing keys. Fund a wallet by copying its address.</div>
    </div>
  );
}

const CRYPTO_ASSETS = [
  { sym: "BTC", name: "Bitcoin", qty: "1.84 BTC", value: "$121,300", color: "#f7931a" },
  { sym: "ETH", name: "Ethereum", qty: "22.5 ETH", value: "$84,200", color: "#627eea" },
  { sym: "SOL", name: "Solana", qty: "310 SOL", value: "$41,900", color: "#14b8a6" },
];
const BROKERAGE_ASSETS = [
  { sym: "NV", name: "Nvidia", type: "Stock", qty: "120 sh", value: "$38,400" },
  { sym: "AA", name: "Apple", type: "Stock", qty: "85 sh", value: "$19,100" },
  { sym: "US", name: "US 10Y Treasury", type: "Bond", qty: "$25k face", value: "$24,300" },
];

function ImportedAssetsPage({ onBack }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5 space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900"><ChevronLeft className="w-3.5 h-3.5" /> Back to overview</button>
      <div className="flex items-end justify-between">
        <div><div className="text-xs uppercase tracking-wider text-gray-400">Total imported value</div><div className="text-2xl font-semibold text-gray-900 mt-1">$329,200</div></div>
        <div className="text-xs text-gray-400">Crypto $247,400 · Brokerage $81,800</div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-gray-900">Crypto wallets</h3><span className="text-sm font-semibold text-gray-900">$247,400</span></div><div className="text-xs text-gray-400 mt-0.5">Imported from connected wallets</div></div>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50"><ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import from wallet</button>
        </div>
        {CRYPTO_ASSETS.map((a, i) => (
          <div key={a.sym} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: a.color }}>{a.sym.slice(0, 1)}</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900">{a.name}</div><div className="text-xs text-gray-400">{a.qty}</div></div>
            <div className="text-sm font-medium text-gray-900">{a.value}</div>
          </div>
        ))}
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-gray-900">Brokerage</h3><span className="text-sm font-semibold text-gray-900">$81,800</span></div><div className="text-xs text-gray-400 mt-0.5">Stocks and bonds from your broker</div></div>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50"><Link2 className="w-4 h-4 text-gray-400" /> Connect brokerage</button>
        </div>
        {BROKERAGE_ASSETS.map((a, i) => (
          <div key={a.sym} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">{a.sym}</div>
            <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900">{a.name}</div><div className="text-xs text-gray-400">{a.qty}</div></div>
            <span className="text-xs text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">{a.type}</span>
            <div className="text-sm font-medium text-gray-900" style={{ minWidth: 72, textAlign: "right" }}>{a.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HEDGE_POSITIONS = [
  { name: "Fed July cut", side: "YES", exposure: "$28,400", exp: 28400, related: [
    { m: "Fed cuts in September", price: "41¢", rel: "Correlated", corr: 0.62, note: "Moves with this position" },
    { m: "CPI above 3.5% in July", price: "33¢", rel: "Inverse", corr: -0.55, note: "Offsets a hot inflation print" },
    { m: "10Y yield above 4.5%", price: "55¢", rel: "Inverse", corr: -0.70, note: "Rates hedge" },
  ]},
  { name: "AI capex beat", side: "YES", exposure: "$22,100", exp: 22100, related: [
    { m: "NVDA beats Q3 earnings", price: "62¢", rel: "Correlated", corr: 0.74, note: "Same AI demand thesis" },
    { m: "AI capex slowdown by 2026", price: "28¢", rel: "Inverse", corr: -0.81, note: "Direct offset" },
  ]},
  { name: "Brent above 90", side: "NO", exposure: "$12,700", exp: 12700, related: [
    { m: "OPEC cuts output in Q3", price: "47¢", rel: "Inverse", corr: -0.58, note: "Supply shock hedge" },
    { m: "US recession in 2026", price: "35¢", rel: "Correlated", corr: 0.49, note: "Demand side" },
  ]},
];

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const parsePrice = (s) => parseFloat(s) / 100;
const corrBand = (c) => { const a = Math.abs(c); return a >= 0.66 ? "Strong" : a >= 0.4 ? "Moderate" : "Weak"; };
// positive correlation -> hedge by taking the opposite side; inverse -> same side
const hedgeSide = (posSide, corr) => (corr >= 0 ? (posSide === "YES" ? "NO" : "YES") : posSide);

function HedgingPage({ onHedge, selected, hedged }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Hedging simulator</h3>
        <div className="text-xs text-gray-400 mt-0.5">Expand a position to see related markets you can hedge with</div>
      </div>
      <div className="space-y-2">
        {HEDGE_POSITIONS.map((p, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <span className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${p.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{p.side}</span>
                <span className="text-sm font-medium text-gray-900 flex-1 text-left">{p.name}</span>
                <span className="text-xs text-gray-400">Exposure</span>
                <span className="text-sm font-medium text-gray-900">{p.exposure}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
              </button>
              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Related markets to hedge</div>
                  <div className="space-y-2">
                    {p.related.map((r, j) => {
                      const isSel = selected && selected.pi === i && selected.ri === j;
                      const isHedged = hedged.includes(`${i}-${j}`);
                      return (
                        <div key={j} className={`flex items-center gap-3 bg-white border rounded-lg px-3 py-2 transition-shadow ${isSel ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"}`}>
                          <span className={`text-xs rounded-full px-2 py-0.5 border shrink-0 ${r.rel === "Inverse" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>{r.rel}</span>
                          <div className="flex-1 min-w-0"><div className="text-sm text-gray-900 truncate">{r.m}</div><div className="text-xs text-gray-400">{r.note}</div></div>
                          {isHedged && <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 shrink-0"><Shield className="w-3 h-3" /> Hedged</span>}
                          <span className="text-sm font-medium text-gray-900">{r.price}</span>
                          <button onClick={() => onHedge(i, j)} className={`text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 ${isHedged ? "text-gray-700 border border-gray-200 hover:bg-gray-50" : "text-white"}`} style={isHedged ? {} : { background: "#0b1220" }}>{isHedged ? "Edit" : "Hedge"}</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HedgeDrawer({ pos, rel, ri, amount, setAmount, onPickRel, onConfirm, onClose }) {
  const exp = pos.exp;
  const c = rel.corr;
  const eff = amount * Math.abs(c);
  const net = Math.max(0, exp - eff);
  const coverage = exp > 0 ? Math.min(1, eff / exp) : 0;
  const give = amount * parsePrice(rel.price);
  const buy = hedgeSide(pos.side, c);
  const markerPct = ((c + 1) / 2) * 100;
  const positive = c >= 0;
  const pct = (n) => `${Math.round(n)}%`;

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.10)" }} />
      <aside className="absolute top-0 right-0 bottom-0 z-20 bg-white border-l border-gray-200 flex flex-col" style={{ width: 416, boxShadow: "-10px 0 30px rgba(0,0,0,0.08)" }}>
        {/* header */}
        <div className="flex items-center justify-between px-4 border-b border-gray-200" style={{ height: 56 }}>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" /><div><div className="text-sm font-semibold text-gray-900">Hedge position</div><div className="text-xs text-gray-400">{pos.name} · {pos.side}</div></div></div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* your position */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Your position</div>
            <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
              <span className={`text-xs font-medium rounded px-1.5 py-0.5 border ${pos.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{pos.side}</span>
              <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{pos.name}</span>
              <span className="text-sm font-medium text-gray-900">{pos.exposure}</span>
            </div>
          </div>

          {/* hedge market picker */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Hedge with</div>
            <div className="space-y-1.5">
              {pos.related.map((r, j) => {
                const sel = j === ri;
                return (
                  <button key={j} onClick={() => onPickRel(j)} className={`w-full flex items-center gap-2.5 border rounded-lg px-3 py-2 text-left ${sel ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:bg-gray-50"}`}>
                    <span className={`text-xs rounded-full px-2 py-0.5 border shrink-0 ${r.rel === "Inverse" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>{r.rel}</span>
                    <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{r.m}</span>
                    <span className="text-sm font-medium text-gray-900">{r.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* correlation band (supporting context, no false precision) */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs uppercase tracking-wider text-gray-400">Correlation</span>
              <span className="text-xs font-medium text-gray-700">{corrBand(c)} · {positive ? "same direction" : "inverse"}</span>
            </div>
            <div className="relative" style={{ height: 8 }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg,#16a34a 0%,#e5e7eb 50%,#d97706 100%)", opacity: 0.35 }} />
              <div className="absolute top-1/2 rounded-full border-2 border-white" style={{ left: `${markerPct}%`, width: 14, height: 14, transform: "translate(-50%,-50%)", background: positive ? "#d97706" : "#16a34a", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5"><span>Inverse</span><span>Independent</span><span>Same</span></div>
            <div className="flex items-start gap-1.5 mt-2.5 text-xs text-gray-500"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /><span>{positive ? "These move together, so a straight bet would add risk. Hedge by taking the opposite side." : "These move opposite, a natural hedge. Take the same side as your thesis."} Estimated, not a guarantee.</span></div>
          </div>

          {/* derived action */}
          <div className="rounded-lg px-3 py-2.5 flex items-center gap-2.5" style={{ background: "#0b1220" }}>
            <span className={`text-xs font-semibold rounded px-1.5 py-0.5 ${buy === "YES" ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"}`}>BUY {buy}</span>
            <span className="text-sm text-white flex-1 min-w-0 truncate">{rel.m}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-gray-400">Amount to hedge</span>
              <button onClick={() => setAmount(exp)} className="text-xs font-medium text-blue-600 hover:text-blue-700">Max {pos.exposure}</button>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 mb-2.5">
              <span className="text-sm text-gray-400 mr-1">$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, Math.min(exp, Number(e.target.value) || 0)))} className="flex-1 min-w-0 text-sm text-gray-900 outline-none" />
            </div>
            <input type="range" min={0} max={exp} step={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" style={{ accentColor: "#0b1220" }} />
            <div className="flex gap-1.5 mt-2.5">
              {[0.25, 0.5, 1].map((f) => (
                <button key={f} onClick={() => setAmount(Math.round(exp * f))} className="flex-1 text-xs border border-gray-200 rounded-md py-1.5 text-gray-600 hover:bg-gray-50">{pct(f * 100)}</button>
              ))}
            </div>
          </div>

          {/* payoff hero: risk before vs after */}
          <div className="rounded-xl border border-gray-200 p-3.5" style={{ background: "#f8fafc" }}>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400 mb-3"><TrendingDown className="w-3.5 h-3.5" /> If it resolves against you</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1"><div className="text-xs text-gray-400">Risk now</div><div className="text-lg font-semibold text-gray-900">−{money(exp)}</div></div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
              <div className="flex-1"><div className="text-xs text-gray-400">After hedge</div><div className="text-lg font-semibold text-green-600">−{money(net)}</div></div>
            </div>
            <div className="flex w-full rounded-full overflow-hidden mb-1.5" style={{ height: 8, background: "#e5e7eb" }}>
              <div style={{ width: `${coverage * 100}%`, background: "#16a34a" }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Covers {pct(coverage * 100)} of exposure</span>
              <span className="text-gray-400">Upside given up if you win ≈ {money(give)}</span>
            </div>
          </div>
        </div>

        {/* footer CTA */}
        <div className="border-t border-gray-200 px-4 py-3">
          <button disabled={amount <= 0} onClick={onConfirm} className="w-full rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-40" style={{ background: "#0b1220" }}>
            {amount <= 0 ? "Enter an amount" : `Hedge ${money(amount)} · covers ${pct(coverage * 100)}`}
          </button>
        </div>
      </aside>
    </>
  );
}

function Chart({ a, b }) {
  const W = 600, H = 170, n = a.length;
  const x = (i) => (i / (n - 1)) * W;
  const y = (v) => H - (v / 100) * H * 0.8 - H * 0.1;
  const d = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ height: 170, display: "block" }}>
      <path d={d(a)} fill="none" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
      <path d={d(b)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function WidgetMini({ kind }) {
  switch (kind) {
    case "markets":
      return (<div className="w-full">{[["Will BTC hit $150k?", "7%"], ["Fed cuts in July?", "38%"], ["Trump approval?", "52%"]].map(([q, p], i) => (<div key={i} className="flex items-center justify-between py-0.5"><span className="text-xs text-gray-600 truncate" style={{ maxWidth: 150 }}>{q}</span><span className="text-xs font-semibold text-gray-900 shrink-0 ml-2">{p}</span></div>))}</div>);
    case "chart":
      return (<svg viewBox="0 0 200 48" width="100%" style={{ height: 48, display: "block" }}><path d="M0,34 L28,28 L56,36 L84,20 L112,26 L140,16 L168,22 L200,18" fill="none" stroke="#111827" strokeWidth="1.5" /></svg>);
    case "intel":
      return (<div className="w-full space-y-1">{[["92", "BTC reacted to headline"], ["87", "ETH near catalyst"]].map(([s, t], i) => (<div key={i} className="flex items-center gap-2"><span className="text-xs font-semibold text-gray-900 border-l-2 border-gray-300 pl-1.5">{s}</span><span className="text-xs text-gray-600 truncate">{t}</span></div>))}</div>);
    case "catalysts":
      return (<div className="w-full space-y-1">{[["18 JUN", "ETH token unlock"], ["30 JUL", "Fed rate decision"]].map(([d, t], i) => (<div key={i} className="flex items-center gap-2"><span className="text-xs font-semibold text-gray-900 border border-gray-200 rounded px-1.5">{d}</span><span className="text-xs text-gray-600 truncate">{t}</span></div>))}</div>);
    case "positions":
      return (<div className="w-full space-y-1">{[["BTC $150k · Yes", "+$215", true], ["Fed cut · Yes", "−$22", false]].map(([n, v, up], i) => (<div key={i} className="flex items-center justify-between"><span className="text-xs text-gray-600 truncate" style={{ maxWidth: 150 }}>{n}</span><span className={`text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>{v}</span></div>))}</div>);
    case "news":
      return (<div className="w-full space-y-1"><div className="text-xs text-gray-700 truncate">Trump signals openness to BTC reserve</div><div className="text-xs text-gray-500 truncate">Spot BTC ETF inflows hit weekly record</div></div>);
    default:
      return null;
  }
}

const QUESTS = [
  { title: "Place 10 trades this week", xp: "+200 XP", sub: "6 of 10", pct: 60, state: "progress" },
  { title: "Reach $10k trading volume", xp: "+1,000 XP", sub: "$6.4k of $10k", pct: 64, state: "progress" },
  { title: "3-day login streak", xp: "+150 XP", sub: "Complete, ready to claim", state: "claim", claimLabel: "Claim +150 XP" },
  { title: "Refer a friend who trades", xp: "+500 XP", sub: "Not started", state: "action", actionLabel: "Get referral link" },
  { title: "Win a contrarian fade", xp: "+300 XP", sub: "0 of 1 · take the minority side and win", pct: 0, state: "progress" },
  { title: "Hold a position to resolution", xp: "+400 XP", sub: "0 of 1", pct: 0, state: "progress" },
];

const LEADERS = [["1", "@apex_trades", "184k XP"], ["2", "@deltaone", "156k XP"], ["3", "@marketwizard", "142k XP"]];

const Num = ({ n }) => <span className="inline-flex items-center justify-center text-gray-400 border border-gray-200 rounded-full shrink-0" style={{ width: 16, height: 16, fontSize: 10 }}>{n}</span>;

function RewardsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Rewards</h2>
        <span className="text-sm text-gray-400">Season 3 · ends in 18 days</span>
      </div>

      {/* hero */}
      <div className="border border-gray-200 rounded-xl p-5 mb-5 flex">
        <div className="flex-1 pr-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold text-gray-900">Level 7</span>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">Pro</span>
            </div>
            <span className="text-sm text-gray-400">2,550 XP to Level 8</span>
          </div>
          <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: 8, background: "#e5e7eb" }}>
            <div className="h-full" style={{ width: "78%", background: "#2563eb" }} />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">12,450 XP · XP doubles as your $AZAL balance</span>
            <span className="text-gray-400">Next level unlocks lower fees</span>
          </div>
        </div>
        <div className="border-l border-gray-200" />
        <div className="pl-6 flex flex-col items-end justify-center text-right" style={{ width: 260 }}>
          <div className="text-xs uppercase tracking-wider text-gray-400">Claimable now</div>
          <div className="text-3xl font-bold text-green-600 mt-1">$128.40</div>
          <div className="text-xs text-gray-400 mt-1">Next drop in 2 days · from fees + quests</div>
          <button className="mt-3 rounded-lg px-6 py-2 text-sm font-medium text-white" style={{ background: "#0b1220" }}>Claim</button>
        </div>
      </div>

      {/* two columns */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        {/* quests */}
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">Quests &amp; Challenges <Num n="2" /></div>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Earn XP →</button>
          </div>
          <div className="divide-y divide-gray-100">
            {QUESTS.map((q, i) => (
              <div key={i} className="py-3.5 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{q.title}</span>
                  <span className="text-sm font-medium text-blue-600">{q.xp}</span>
                </div>
                <div className={`text-xs mt-1 ${q.state === "claim" ? "text-green-600" : "text-gray-400"}`}>{q.sub}</div>
                {q.state === "progress" && (
                  <div className="w-full rounded-full overflow-hidden mt-2" style={{ height: 6, background: "#e5e7eb" }}>
                    <div className="h-full" style={{ width: `${q.pct}%`, background: "#0b1220" }} />
                  </div>
                )}
                {q.state === "claim" && (
                  <button className="mt-2.5 rounded-md px-3 py-1.5 text-xs font-medium text-white" style={{ background: "#0b1220" }}>{q.claimLabel}</button>
                )}
                {q.state === "action" && (
                  <button className="mt-2.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">{q.actionLabel} →</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* right rail */}
        <div className="space-y-5">
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-4">Your stats <Num n="1" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><div className="text-xs text-gray-400">Total claimed</div><div className="text-lg font-semibold text-gray-900 mt-0.5">$1,842</div></div>
              <div><div className="text-xs text-gray-400">Account age</div><div className="text-lg font-semibold text-gray-900 mt-0.5">94 days</div></div>
              <div><div className="text-xs text-gray-400">Rewards rate</div><div className="text-lg font-semibold text-gray-900 mt-0.5">0.8%</div></div>
            </div>
            <div className="text-xs text-gray-400 mt-3">Rate scales with level · partners earn a higher rate.</div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-4">Referrals <Num n="3" /></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 min-w-0 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">azal.xyz/r/johndoe</div>
              <button className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 shrink-0">Copy</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><div className="text-lg font-semibold text-gray-900">14</div><div className="text-xs text-gray-400">Referred</div></div>
              <div><div className="text-lg font-semibold text-gray-900">$214</div><div className="text-xs text-gray-400">Earned</div></div>
              <div><div className="text-lg font-semibold text-gray-900">30/3/2%</div><div className="text-xs text-gray-400">Tier 1/2/3</div></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">Leaderboard <Num n="4" /></div>
              <span className="text-xs text-gray-400">Season 3</span>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1"><span>Your rank</span><span>Season XP</span></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">#1,284 <span className="text-green-600 font-medium">top 3%</span></span>
                <span className="text-sm font-semibold text-gray-900">12,450</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {LEADERS.map(([r, u, xp]) => (
                <div key={r} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-3">{r}</span>
                  <span className="text-sm text-gray-900 flex-1">{u}</span>
                  <span className="text-sm font-medium text-gray-900">{xp}</span>
                </div>
              ))}
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-3">View full leaderboard →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TRADERS = [
  { id: "apex", name: "@apex_trades", hue: 210, roi: "+142%", win: "71%", risk: 4, dd: "18%", copiers: "2,481", monthly: "+$28.4k", tags: ["Politics", "Whale"], recent: [{ m: "Fed July cut", s: "YES", pl: "+$1,240" }, { m: "Brent above 90", s: "NO", pl: "+$680" }, { m: "NVDA beats Q3", s: "YES", pl: "-$210" }] },
  { id: "delta", name: "@deltaone", hue: 160, roi: "+118%", win: "66%", risk: 3, dd: "12%", copiers: "1,905", monthly: "+$19.2k", tags: ["Econ"], recent: [{ m: "US recession 2026", s: "NO", pl: "+$420" }, { m: "CPI above 3.5%", s: "NO", pl: "+$890" }] },
  { id: "wizard", name: "@marketwizard", hue: 280, roi: "+97%", win: "63%", risk: 5, dd: "24%", copiers: "1,540", monthly: "+$14.8k", tags: ["Crypto", "Whale"], recent: [{ m: "AI capex beat", s: "YES", pl: "+$3,100" }, { m: "OPEC cuts Q3", s: "NO", pl: "-$540" }] },
  { id: "nova", name: "@nova_fade", hue: 20, roi: "+84%", win: "69%", risk: 2, dd: "9%", copiers: "1,122", monthly: "+$11.3k", tags: ["Politics"], recent: [{ m: "Fed September cut", s: "YES", pl: "+$610" }] },
  { id: "orca", name: "@orca_macro", hue: 340, roi: "+72%", win: "61%", risk: 4, dd: "16%", copiers: "884", monthly: "+$8.9k", tags: ["Econ", "Sports"], recent: [{ m: "10Y above 4.5%", s: "NO", pl: "+$300" }] },
];
const findTrader = (id) => TRADERS.find((t) => t.id === id);

const FEED = [
  { t: "apex", cap: "Loading up on rate cuts before CPI. Macro setup is clean.", m: "Fed July cut", s: "YES", odds: "63¢", size: "$12,000", pl: "+$1,240", likes: 142, comments: 18 },
  { t: "delta", cap: "Fading the crowd on this one.", m: "US recession 2026", s: "NO", odds: "35¢", size: "$8,500", pl: "+$420", likes: 88, comments: 7 },
  { t: "wizard", cap: "Held to resolution. Patience pays.", m: "AI capex beat", s: "YES", odds: "58¢", size: "$20,000", pl: "+$3,100", likes: 231, comments: 42 },
];
const LIVE_STREAMS = [
  { t: "apex", title: "Macro session: CPI preview", viewers: "1.2k" },
  { t: "wizard", title: "Live: trading the debate", viewers: "864" },
];
const FRIENDS = [{ name: "@deltaone", on: true }, { name: "@marketwizard", on: true }, { name: "@nova_fade", on: false }];

function Avatar({ name, hue = 210, size = 32 }) {
  const initials = name.replace("@", "").slice(0, 2).toUpperCase();
  return <div className="flex items-center justify-center rounded-full text-white font-medium shrink-0" style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 55% 45%)` }}>{initials}</div>;
}

function SocialPage({ onOpenTrader, following, copying, onFollow }) {
  const [tab, setTab] = useState("Trending");
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Social</h2>
        <span className="text-sm text-gray-400">Discover traders, copy the best</span>
      </div>
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input placeholder="Search traders, wallets, users..." className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 pl-9 pr-3 py-2 focus:outline-none focus:bg-white focus:border-gray-300" />
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 shrink-0"><Copy className="w-4 h-4 text-gray-400" /> Paste a wallet to copy</button>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        {/* FEED */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            {["Following", "Trending", "Trades"].map((x) => (
              <button key={x} onClick={() => setTab(x)} className={`text-sm rounded-md px-3 py-1.5 ${tab === x ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}>{x}</button>
            ))}
          </div>
          <div className="space-y-3">
            {FEED.map((p, i) => {
              const tr = findTrader(p.t);
              return (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => onOpenTrader(tr.id, "overview")} className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={tr.name} hue={tr.hue} size={36} />
                      <div className="min-w-0 text-left">
                        <div className="text-sm font-semibold text-gray-900 truncate">{tr.name}</div>
                        <div className="text-xs text-gray-400">{tr.monthly} this month · {tr.win} win</div>
                      </div>
                    </button>
                    <div className="flex-1" />
                    <button onClick={() => onFollow(tr.id)} className={`text-xs font-medium rounded-md px-2.5 py-1.5 border ${following.includes(tr.id) ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}>{following.includes(tr.id) ? "Following" : "Follow"}</button>
                    <button onClick={() => onOpenTrader(tr.id, "copy")} className="text-xs font-medium text-white rounded-md px-2.5 py-1.5" style={{ background: "#0b1220" }}>{copying.includes(tr.id) ? "Copying" : "Copy"}</button>
                  </div>
                  <div className="text-sm text-gray-700 mt-3">{p.cap}</div>
                  <div className="mt-3 border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-3">
                    <span className={`text-xs font-medium rounded px-1.5 py-0.5 border ${p.s === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{p.s}</span>
                    <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{p.m}</span>
                    <span className="text-xs text-gray-400 shrink-0">{p.odds} · {p.size}</span>
                    <span className={`text-sm font-medium shrink-0 ${p.pl.startsWith("-") ? "text-red-600" : "text-green-600"}`}>{p.pl}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {p.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {p.comments}</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="space-y-5">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-gray-400">Top traders</div>
              <div className="flex gap-1">
                <span className="text-xs text-gray-900 font-medium bg-gray-100 rounded px-1.5 py-0.5">ROI</span>
                <span className="text-xs text-gray-400 rounded px-1.5 py-0.5">Win rate</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {TRADERS.map((t, i) => (
                <div key={t.id} className="flex items-center gap-2.5">
                  <span className="text-xs text-gray-400 w-3 shrink-0">{i + 1}</span>
                  <button onClick={() => onOpenTrader(t.id, "overview")} className="flex items-center gap-2 min-w-0 flex-1">
                    <Avatar name={t.name} hue={t.hue} size={26} />
                    <div className="min-w-0 text-left">
                      <div className="text-sm text-gray-900 truncate">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.win} win · risk {t.risk}/7</div>
                    </div>
                  </button>
                  <span className="text-sm font-medium text-green-600 shrink-0">{t.roi}</span>
                  <button onClick={() => onOpenTrader(t.id, "copy")} className="text-xs font-medium rounded-md px-2 py-1 border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">Copy</button>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400"><Radio className="w-3.5 h-3.5 text-red-500" /> Live now</div>
              <span className="text-xs text-gray-400">Curated</span>
            </div>
            <div className="space-y-2">
              {LIVE_STREAMS.map((l, i) => {
                const tr = findTrader(l.t);
                return (
                  <button key={i} className="w-full flex items-center gap-2.5 text-left hover:bg-gray-50 rounded-lg p-1.5">
                    <div className="relative shrink-0"><Avatar name={tr.name} hue={tr.hue} size={32} /><span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" /></div>
                    <div className="min-w-0 flex-1"><div className="text-sm text-gray-900 truncate">{l.title}</div><div className="text-xs text-gray-400">{tr.name} · {l.viewers} watching</div></div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-gray-400">Messages</div>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Open chat →</button>
            </div>
            <div className="space-y-2">
              {FRIENDS.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="relative shrink-0"><Avatar name={f.name} hue={(i * 67) % 360} size={28} />{f.on && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}</div>
                  <span className="text-sm text-gray-900 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{f.on ? "online" : "offline"}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-3">DMs and friends live in the chat overlay.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TraderDrawer({ trader, mode, setMode, amount, setAmount, copyMode, setCopyMode, isFollowing, isCopying, onFollow, onConfirmCopy, onClose }) {
  const balance = 50000;
  return (
    <>
      <div onClick={onClose} className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.10)" }} />
      <aside className="absolute top-0 right-0 bottom-0 z-20 bg-white border-l border-gray-200 flex flex-col" style={{ width: 416, boxShadow: "-10px 0 30px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center justify-between px-4 border-b border-gray-200" style={{ height: 56 }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={trader.name} hue={trader.hue} size={34} />
            <div className="min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{trader.name}</div><div className="text-xs text-gray-400">{trader.copiers} copiers · risk {trader.risk}/7</div></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-4 border-b border-gray-200">
          {[["ROI", trader.roi, "text-green-600"], ["Win", trader.win, ""], ["Drawdown", trader.dd, "text-red-500"], ["Monthly", trader.monthly, ""]].map(([l, v, c]) => (
            <div key={l} className="px-3 py-2.5 border-r border-gray-100 last:border-r-0"><div className="text-xs text-gray-400">{l}</div><div className={`text-sm font-semibold ${c || "text-gray-900"}`}>{v}</div></div>
          ))}
        </div>

        <div className="flex gap-1 p-3">
          {["overview", "copy"].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 text-sm rounded-md py-1.5 capitalize ${mode === m ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}>{m}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {mode === "overview" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => onFollow(trader.id)} className={`flex-1 text-sm font-medium rounded-lg py-2 border ${isFollowing ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}>{isFollowing ? "Following" : "Follow"}</button>
                <div className="flex gap-1">{trader.tags.map((t) => <span key={t} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">{t}</span>)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Recent trades</div>
                <div className="space-y-1.5">
                  {trader.recent.map((r, i) => (
                    <div key={i} className="flex items-center gap-2.5 border border-gray-100 rounded-lg px-3 py-2">
                      <span className={`text-xs font-medium rounded px-1.5 py-0.5 border ${r.s === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{r.s}</span>
                      <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{r.m}</span>
                      <span className={`text-sm font-medium ${r.pl.startsWith("-") ? "text-red-600" : "text-green-600"}`}>{r.pl}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-gray-500"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /> Stats include wins and losses. Past performance does not guarantee future results.</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Copy mode</div>
                <div className="flex gap-1">
                  {["proportional", "fixed"].map((m) => (
                    <button key={m} onClick={() => setCopyMode(m)} className={`flex-1 text-sm rounded-md py-1.5 border capitalize ${copyMode === m ? "border-gray-900 ring-1 ring-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{m}</button>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1.5">{copyMode === "proportional" ? "Mirror their position sizes, scaled to your allocation." : "Same fixed amount on every trade they make."}</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wider text-gray-400">Allocation</span><button onClick={() => setAmount(balance)} className="text-xs font-medium text-blue-600">Max ${balance.toLocaleString()}</button></div>
                <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 mb-2.5"><span className="text-sm text-gray-400 mr-1">$</span><input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, Math.min(balance, Number(e.target.value) || 0)))} className="flex-1 min-w-0 text-sm text-gray-900 outline-none" /></div>
                <input type="range" min={0} max={balance} step={500} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full" style={{ accentColor: "#0b1220" }} />
                <div className="flex gap-1.5 mt-2.5">{[0.25, 0.5, 1].map((f) => <button key={f} onClick={() => setAmount(Math.round(balance * f))} className="flex-1 text-xs border border-gray-200 rounded-md py-1.5 text-gray-600 hover:bg-gray-50">{Math.round(f * 100)}%</button>)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><div className="text-xs text-gray-400 mb-1">Slippage guard</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">2%</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Max open positions</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">10</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Stop loss</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">Off</div></div>
                <div><div className="text-xs text-gray-400 mb-1">Take profit</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">Off</div></div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1.5">Markets</div>
                <div className="flex flex-wrap gap-1.5">{["All", "Politics", "Crypto", "Econ", "Sports"].map((c, i) => <span key={c} className={`text-xs rounded-full px-2 py-1 border ${i === 0 ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-500"}`}>{c}</span>)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-3">
          {mode === "overview" ? (
            <button onClick={() => setMode("copy")} className="w-full rounded-lg py-2.5 text-sm font-medium text-white" style={{ background: "#0b1220" }}>{isCopying ? "Manage copy" : "Copy this trader"}</button>
          ) : (
            <button disabled={amount <= 0} onClick={onConfirmCopy} className="w-full rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-40" style={{ background: "#0b1220" }}>{amount <= 0 ? "Set an allocation" : `Copy ${trader.name} · $${amount.toLocaleString()}`}</button>
          )}
        </div>
      </aside>
    </>
  );
}

const SIGNALS = [
  { tag: "Opportunity", title: "ASTOR up 12%, near your target", sub: "ASELS basket · consider taking profit", action: "Review" },
  { tag: "Risk", title: "Fed July cut odds dropped 8% in 1h", sub: "Fed July cut YES · $28,400 exposure", action: "Hedge" },
  { tag: "Info", title: "CPI print in 2 days", sub: "3 positions sensitive to this event", action: "View" },
  { tag: "Opportunity", title: "NVDA earnings beat consensus", sub: "AI capex beat YES moving your way", action: "Review" },
];
const ALERTS = [
  { m: "Fed July cut", cond: "Odds below 55%", status: "Active" },
  { m: "Brent above 90", cond: "Price above 60¢", status: "Active" },
  { m: "AI capex beat", cond: "P&L above $5k", status: "Triggered" },
];
const TRANSLATE = [
  { pos: "Fed July cut", side: "YES", narrative: "Dovish Fed", assets: "Long bonds, Gold", horizon: "Short (Jul)", exp: "$28,400" },
  { pos: "AI capex beat", side: "YES", narrative: "AI buildout", assets: "NVDA, Semis", horizon: "Medium (Q3)", exp: "$22,100" },
  { pos: "Brent above 90", side: "NO", narrative: "Soft energy", assets: "Short oil, Airlines", horizon: "Short (Aug)", exp: "$12,700" },
  { pos: "US recession 2026", side: "NO", narrative: "Soft landing", assets: "Equities, Credit", horizon: "Long (2026)", exp: "$9,400" },
];
const SCENARIOS = [
  { name: "Fed cuts in July", base: [["Fed July cut · YES", 9200], ["10Y above 4.5% · NO", 1800], ["AI capex beat · YES", 2400]] },
  { name: "US recession 2026", base: [["US recession · NO", -6400], ["Brent above 90 · NO", 2100], ["AI capex beat · YES", -3800]] },
  { name: "Oil supply shock", base: [["Brent above 90 · NO", -5600], ["OPEC cuts Q3 · YES", 1200], ["US recession · NO", -900]] },
];

function CommandCenter() {
  const tagCls = { Opportunity: "text-green-700 bg-green-50 border-green-200", Risk: "text-red-700 bg-red-50 border-red-200", Info: "text-blue-700 bg-blue-50 border-blue-200" };
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Command Center</h3>
      <div className="flex flex-wrap gap-2 mb-5">
        <button className="flex items-center gap-1.5 text-sm text-white rounded-lg px-3 py-2" style={{ background: "#0b1220" }}><Plus className="w-4 h-4" /> New order</button>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"><Shield className="w-4 h-4 text-gray-400" /> Hedge all</button>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"><X className="w-4 h-4 text-gray-400" /> Close all</button>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"><Bell className="w-4 h-4 text-gray-400" /> New alert</button>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Live signals</div>
          <div className="space-y-2">
            {SIGNALS.map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
                <span className={`text-xs rounded-full px-2 py-0.5 border shrink-0 ${tagCls[s.tag]}`}>{s.tag}</span>
                <div className="flex-1 min-w-0"><div className="text-sm text-gray-900 truncate">{s.title}</div><div className="text-xs text-gray-400 truncate">{s.sub}</div></div>
                <button className="text-xs font-medium rounded-md px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">{s.action}</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Alerts</div>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {ALERTS.map((a, i) => (
              <div key={i} className="px-3 py-2.5 flex items-center gap-2">
                <div className="flex-1 min-w-0"><div className="text-sm text-gray-900 truncate">{a.m}</div><div className="text-xs text-gray-400">{a.cond}</div></div>
                <span className={`text-xs rounded-full px-2 py-0.5 ${a.status === "Triggered" ? "text-amber-700 bg-amber-50" : "text-green-700 bg-green-50"}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranslatorPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Translator</h3>
        <div className="flex gap-1.5">{["Narrative", "Asset", "Horizon"].map((c, i) => <span key={c} className={`text-xs rounded-full px-2.5 py-1 border ${i === 0 ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-500"}`}>{c}</span>)}</div>
      </div>
      <div className="text-xs text-gray-400 mb-4">Translate prediction positions into the narratives, assets, and horizons they map to.</div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
          <div className="col-span-3">Position</div><div className="col-span-3">Narrative</div><div className="col-span-3">Maps to</div><div className="col-span-2">Horizon</div><div className="col-span-1 text-right">Exp.</div>
        </div>
        <div className="divide-y divide-gray-100">
          {TRANSLATE.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
              <div className="col-span-3 flex items-center gap-2 min-w-0"><span className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${r.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{r.side}</span><span className="text-sm text-gray-900 truncate">{r.pos}</span></div>
              <div className="col-span-3 text-sm text-gray-700">{r.narrative}</div>
              <div className="col-span-3 text-sm text-gray-500">{r.assets}</div>
              <div className="col-span-2 text-sm text-gray-500">{r.horizon}</div>
              <div className="col-span-1 text-sm font-medium text-gray-900 text-right">{r.exp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScenarioEngine() {
  const [sel, setSel] = useState(0);
  const [mag, setMag] = useState(60);
  const sc = SCENARIOS[sel];
  const scaled = sc.base.map(([n, v]) => [n, Math.round((v * mag) / 100)]);
  const net = scaled.reduce((a, [, v]) => a + v, 0);
  const before = 577620;
  const after = before + net;
  return (
    <div className="flex-1 overflow-y-auto bg-white px-6 py-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Scenario Engine</h3>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SCENARIOS.map((s, i) => <button key={i} onClick={() => setSel(i)} className={`text-sm rounded-lg px-3 py-1.5 border ${sel === i ? "border-gray-900 ring-1 ring-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{s.name}</button>)}
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        <div className="border border-gray-200 rounded-xl overflow-hidden h-fit">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-gray-50 text-xs uppercase tracking-wider text-gray-400"><div className="col-span-9">Position</div><div className="col-span-3 text-right">Projected</div></div>
          <div className="divide-y divide-gray-100">
            {scaled.map(([n, v], i) => (
              <div key={i} className="grid grid-cols-12 px-4 py-3 items-center"><div className="col-span-9 text-sm text-gray-900">{n}</div><div className={`col-span-3 text-right text-sm font-medium ${v < 0 ? "text-red-600" : "text-green-600"}`}>{v < 0 ? "-" : "+"}{money(Math.abs(v))}</div></div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2"><span className="text-xs uppercase tracking-wider text-gray-400">Severity</span><span className="text-sm font-medium text-gray-900">{mag}%</span></div>
            <input type="range" min={0} max={100} step={5} value={mag} onChange={(e) => setMag(Number(e.target.value))} className="w-full" style={{ accentColor: "#0b1220" }} />
          </div>
          <div className="rounded-xl border border-gray-200 p-4" style={{ background: "#f8fafc" }}>
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Projected portfolio impact</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1"><div className="text-xs text-gray-400">Now</div><div className="text-base font-semibold text-gray-900">{money(before)}</div></div>
              <ArrowRight className="w-4 h-4 text-gray-300" />
              <div className="flex-1"><div className="text-xs text-gray-400">Projected</div><div className={`text-base font-semibold ${net < 0 ? "text-red-600" : "text-green-600"}`}>{money(after)}</div></div>
            </div>
            <div className={`text-sm font-medium ${net < 0 ? "text-red-600" : "text-green-600"}`}>Net {net < 0 ? "-" : "+"}{money(Math.abs(net))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AzalShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(true);
  const [liveOpen, setLiveOpen] = useState(true);
  const [active, setActive] = useState("China");

  const [page, setPage] = useState("dashboard");
  const [ptab, setPtab] = useState("Overview");
  const pcurrent = PSUBPAGES.find((p) => p.key === ptab);

  const [section, setSection] = useState("Trending");
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);
  const visibleMarkets = section === "Trending" ? MARKETS : MARKETS.filter((m) => m.section === section);

  const [slide, setSlide] = useState(0);
  const [buySide, setBuySide] = useState("yes");
  const [amount, setAmount] = useState(50);
  const cur = FEATURED[slide];
  const price = buySide === "yes" ? cur.yes : cur.no;
  const shares = price > 0 ? Math.round(amount / (price / 100)) : 0;
  const payout = shares;
  const maxProfit = payout - amount;
  const prev = () => setSlide((slide - 1 + FEATURED.length) % FEATURED.length);
  const next = () => setSlide((slide + 1) % FEATURED.length);

  const [editing, setEditing] = useState(false);
  const [slotWidget, setSlotWidget] = useState(null);

  const [hedge, setHedge] = useState(null);        // { pi, ri } or null
  const [hedgeAmt, setHedgeAmt] = useState(0);
  const [hedged, setHedged] = useState([]);        // ["pi-ri", ...]
  const openHedge = (pi, ri) => { setHedge({ pi, ri }); setHedgeAmt(Math.round(HEDGE_POSITIONS[pi].exp * 0.5)); };
  const confirmHedge = () => { if (hedge) { const k = `${hedge.pi}-${hedge.ri}`; setHedged((h) => (h.includes(k) ? h : [...h, k])); } setHedge(null); };

  const [social, setSocial] = useState(null);      // { id, mode } or null
  const [copyAmt, setCopyAmt] = useState(0);
  const [copyMode, setCopyMode] = useState("proportional");
  const [following, setFollowing] = useState([]);
  const [copying, setCopying] = useState([]);
  const openTrader = (id, mode) => { setSocial({ id, mode }); if (mode === "copy" && copyAmt === 0) setCopyAmt(12500); };
  const toggleFollow = (id) => setFollowing((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const confirmCopy = () => { if (social) setCopying((c) => (c.includes(social.id) ? c : [...c, social.id])); setSocial(null); };

  const go = (p) => { setPage(p); setEditing(false); setHedge(null); setSocial(null); };

  const SubItem = ({ label, live }) => {
    const isActive = active === label;
    return (
      <button onClick={() => { setActive(label); go("dashboard"); }}
        className={`relative w-full text-left pl-4 pr-2 py-1.5 text-sm rounded-md ${isActive && page === "dashboard" ? "text-blue-700 font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
        {isActive && page === "dashboard" && <span style={{ position: "absolute", left: -1, top: 7, bottom: 7, width: 2, background: "#2563eb", borderRadius: 2 }} />}
        <span className="flex items-center gap-2">{live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />}{label}</span>
      </button>
    );
  };

  const MenuItem = ({ icon: Icon, label, active: isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm ${isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  const RailIcon = ({ icon: Icon, accent, onClick }) => (
    <button onClick={onClick} className={`w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 ${accent ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}><Icon className="w-4 h-4" /></button>
  );

  const IconBtn = ({ icon: Icon, dot }) => (
    <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700"><Icon className="w-4 h-4" />{dot && <span className="absolute w-2 h-2 rounded-full bg-red-500" style={{ top: 6, right: 7 }} />}</button>
  );

  return (
    <div className="flex w-full bg-gray-100 p-4" style={{ height: 900 }}>
      <div className="relative flex w-full bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* ===== SIDEBAR ===== */}
        {collapsed ? (
          <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-3">
            <div className="w-7 h-7 rounded-md bg-blue-600 mb-4" />
            <div className="flex flex-col items-center gap-1">
              <RailIcon icon={Flame} accent onClick={() => go("dashboard")} />
              <button onClick={() => go("dashboard")} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /></button>
            </div>
            <div className="w-6 border-t border-gray-200 my-3" />
            <div className="flex flex-col items-center gap-1">
              <RailIcon icon={LayoutGrid} onClick={() => go("portfolio")} />
              <RailIcon icon={Share2} onClick={() => go("social")} />
              <RailIcon icon={Gift} onClick={() => go("rewards")} />
            </div>
            <div className="mt-auto"><RailIcon icon={Settings} /></div>
          </aside>
        ) : (
          <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 px-4 border-b border-gray-100" style={{ height: 56 }}>
              <div className="w-5 h-5 rounded bg-blue-600" />
              <span className="font-semibold text-gray-900">Azal</span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-3">
              <div className="px-2 mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Categories</div>
              <button onClick={() => setTrendingOpen(!trendingOpen)} className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-900">
                <Flame className="w-4 h-4 text-blue-600" /> Trending
                <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${trendingOpen ? "" : "-rotate-90"}`} />
              </button>
              {trendingOpen && <div className="ml-5 border-l border-gray-200 mt-0.5 mb-2 pl-1">{TRENDING.map((i) => <SubItem key={i} label={i} />)}</div>}
              <button onClick={() => setLiveOpen(!liveOpen)} className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-900">
                <span className="w-4 h-4 flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /></span>
                Live <span className="text-xs text-gray-400 font-normal">6</span>
                <ChevronDown className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${liveOpen ? "" : "-rotate-90"}`} />
              </button>
              {liveOpen && <div className="ml-5 border-l border-gray-200 mt-0.5 mb-2 pl-1">{LIVE.map((i) => <SubItem key={i} label={i} live />)}</div>}
              <div className="px-2 mt-4 mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Menu</div>
              <MenuItem icon={LayoutGrid} label="Portfolio" active={page === "portfolio"} onClick={() => go("portfolio")} />
              <MenuItem icon={Share2} label="Social" active={page === "social"} onClick={() => go("social")} />
              <MenuItem icon={Gift} label="Rewards" active={page === "rewards"} onClick={() => go("rewards")} />
            </div>
            <div className="border-t border-gray-100 px-3 py-2.5 flex items-center">
              <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Settings"><Settings className="w-4 h-4" /></button>
            </div>
          </aside>
        )}

        {/* ===== RIGHT ===== */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* TOP BAR */}
          <header className="flex items-center gap-2 px-3 border-b border-gray-200 bg-white overflow-hidden" style={{ height: 56 }}>
            <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 shrink-0" title="Collapse sidebar"><PanelLeft className="w-4 h-4" /></button>
            <div className="shrink-0" style={{ width: 1, height: 20, background: "#e5e7eb" }} />
            <nav className="flex items-center gap-1.5 text-sm min-w-0">
              {page === "portfolio" ? (
                <>
                  <PieChart className="w-4 h-4 text-gray-400 shrink-0" />
                  <button onClick={() => setPtab("Overview")} className="text-gray-500 hover:text-gray-900 shrink-0">Portfolio</button>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="text-gray-900 font-medium truncate">{ptab}</span>
                </>
              ) : page === "dashboard" ? (
                <>
                  <Flame className="w-4 h-4 text-gray-400 shrink-0" />
                  <button className="text-gray-500 hover:text-gray-900 shrink-0">Trending</button>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="text-gray-900 font-medium truncate">Will BTC hit $150k by Jun 30?</span>
                </>
              ) : (
                <span className="text-gray-900 font-medium capitalize">{page}</span>
              )}
            </nav>
            <div className="flex-1 min-w-0">
              <div className="relative" style={{ maxWidth: 260 }}>
                <Search className="w-4 h-4 text-gray-400 absolute" style={{ left: 12, top: 9 }} />
                <input placeholder="Search markets..." className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 pl-9 pr-8 py-2 focus:outline-none focus:bg-white focus:border-gray-300" />
                <span className="absolute text-xs text-gray-400 border border-gray-200 rounded bg-white" style={{ right: 8, top: 7, padding: "1px 6px" }}>/</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <span className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600"><Wallet className="w-4 h-4 text-gray-400" /> 0×4..9F</span>
                <button className="px-1 py-2 border-l border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900"><CircleDollarSign className="w-4 h-4 text-blue-600" /> 0.001</span>
              <div className="flex items-center rounded-lg overflow-hidden" style={{ background: "#0b1220" }}>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-white"><ArrowDownToLine className="w-4 h-4" /> Deposit</button>
                <button className="px-1 py-2 text-white" style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}><ChevronDown className="w-4 h-4" /></button>
              </div>
              <IconBtn icon={Star} />
              <IconBtn icon={Bell} dot />
              {page === "dashboard" && (
                <button onClick={() => setEditing(!editing)} title="Edit layout" className={`w-8 h-8 flex items-center justify-center rounded-md ${editing ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}><Pencil className="w-4 h-4" /></button>
              )}
              <div className="flex items-center gap-1.5 pl-0.5">
                <div className="text-right leading-tight"><div className="text-sm text-gray-900 font-medium">John Doe</div><div className="text-xs text-gray-400">Tier 1</div></div>
                <div className="w-8 h-8 rounded-full bg-blue-600" />
              </div>
              <IconBtn icon={MoreHorizontal} />
            </div>
          </header>

          {/* ===== MAIN (page switch) ===== */}
          {page === "dashboard" && (
            <div className="flex-1 flex min-w-0 min-h-0">

              {/* MARKETS COLUMN */}
              <section className="flex flex-col border-r border-gray-200 bg-white" style={{ width: 340 }}>
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2">{editing && <GripVertical className="w-4 h-4 text-gray-300" />}<span className="text-base font-semibold text-gray-900">Markets</span><span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">{visibleMarkets.length}</span></div>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">scannable list <ChevronDown className="w-3 h-3" /></button>
                </div>
                <div className="flex items-center gap-1.5 px-4 pb-2">
                  {PILLS.map((p) => (<button key={p} onClick={() => setSection(p)} className={`flex items-center gap-1 text-sm rounded-full px-3 py-1 border ${section === p ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{p === "Trending" && <Star className="w-3.5 h-3.5" />} {p}</button>))}
                  <button className="text-gray-400 border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2 px-4 pb-3">
                  <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50">Trending <ChevronDown className="w-3 h-3 text-gray-400" /></button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50">Open markets <ChevronDown className="w-3 h-3 text-gray-400" /></button>
                  <div className="relative">
                    <button onClick={() => setSectionMenuOpen(!sectionMenuOpen)} className={`flex items-center gap-1 text-xs rounded-md px-2 py-1 border ${section !== "Trending" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{section === "Trending" ? "All sections" : section} <ChevronDown className="w-3 h-3" /></button>
                    {sectionMenuOpen && (<div className="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1" style={{ left: 0 }}>{SECTIONS.map((s) => (<button key={s} onClick={() => { setSection(s === "All sections" ? "Trending" : s); setSectionMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">{s}</button>))}</div>)}
                  </div>
                  <button className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-gray-400 border border-gray-200 hover:bg-gray-50"><Settings className="w-3.5 h-3.5" /></button>
                </div>
                <div className="mx-4 mb-1 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Featured · Scraped news</div>
                  <div className="text-sm font-medium text-gray-900">Will China invade Taiwan in 2026?</div>
                  <div className="text-xs text-gray-500 mt-0.5">Reuters: Taiwan reports increased PLA activity near strait · 4m</div>
                </div>
                <div className="flex-1 overflow-y-auto mt-1">
                  {visibleMarkets.map((m, i) => (
                    <button key={i} className="w-full text-left px-4 py-3 border-t border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-3"><span className="text-sm text-gray-900 font-medium">{m.q}</span><span className="text-sm font-semibold text-gray-900 shrink-0">{m.pct}%</span></div>
                      <div className="flex items-center justify-between mt-1.5"><span className="text-xs text-gray-400">{m.vol} · {m.time}</span><span className="flex items-center gap-1"><span className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">Y {m.y}¢</span><span className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">N {m.n}¢</span></span></div>
                    </button>
                  ))}
                  {visibleMarkets.length === 0 && <div className="px-4 py-6 text-sm text-gray-400">No markets in this section.</div>}
                </div>
              </section>

              {/* CENTER CAROUSEL */}
              <section className="flex-1 flex flex-col bg-white min-w-0 overflow-y-auto">
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">{editing && <GripVertical className="w-4 h-4 text-gray-300" />}Featured market {slide + 1} / {FEATURED.length}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">{FEATURED.map((_, i) => (<button key={i} onClick={() => setSlide(i)} className="rounded-full" style={{ width: i === slide ? 16 : 6, height: 6, background: i === slide ? "#111827" : "#d1d5db" }} />))}</div>
                    <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="px-5 pt-1">
                  <h2 className="text-lg font-semibold text-gray-900">{cur.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500"><span>{cur.venue}</span><span>·</span><span>{cur.vol}</span><span className="flex items-center gap-1 text-green-600 text-xs border border-green-200 bg-green-50 rounded-full px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active</span></div>
                </div>
                <div className="px-5 mt-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-1"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-900" /> Yes {cur.yes}%</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> No {cur.no}%</span></div>
                  <Chart a={cur.a} b={cur.b} />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Jun 1</span><span>Jun 4</span><span>Jun 7</span><span>Jun 10</span></div>
                </div>
                <div className="px-5 mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5"><span className="text-sm text-gray-700">Yes</span><span className="text-sm font-semibold text-gray-900">{cur.yes}¢</span></div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5"><span className="text-sm text-gray-700">No</span><span className="text-sm font-semibold text-gray-900">{cur.no}¢</span></div>
                </div>
                <div className="mx-5 my-4 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 mb-3"><Star className="w-3.5 h-3.5" /> Order ticket</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button onClick={() => setBuySide("yes")} className={`rounded-lg py-2.5 text-sm font-medium border ${buySide === "yes" ? "border-gray-900 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>Buy Yes · {cur.yes}¢</button>
                    <button onClick={() => setBuySide("no")} className={`rounded-lg py-2.5 text-sm font-medium border ${buySide === "no" ? "border-gray-900 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>Buy No · {cur.no}¢</button>
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 mb-2"><span className="text-gray-400 text-sm">$</span><input value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="flex-1 mx-2 text-lg text-gray-900 focus:outline-none" /><span className="text-xs text-gray-400">Amount</span></div>
                  <div className="flex items-center gap-2 mb-3">{[25, 50, 100].map((v) => <button key={v} onClick={() => setAmount(v)} className="text-xs border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50">${v}</button>)}<button onClick={() => setAmount(1000)} className="text-xs border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50">Max</button></div>
                  <div className="space-y-1.5 text-sm mb-3">
                    <div className="flex items-center justify-between"><span className="text-gray-500">Shares</span><span className="text-gray-900 font-medium">≈ {shares}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Avg price</span><span className="text-gray-900 font-medium">{price}¢</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Potential payout</span><span className="text-gray-900 font-medium">${payout}</span></div>
                    <div className="flex items-center justify-between"><span className="text-gray-500">Max profit</span><span className="text-green-600 font-medium">+${maxProfit}</span></div>
                  </div>
                  <button className="w-full rounded-lg py-3 text-sm font-medium text-white" style={{ background: "#0b1220" }}>Place order</button>
                  <div className="text-xs text-gray-400 mt-2">Order type: Market · Slippage: 1%</div>
                </div>
              </section>

              {/* RIGHT RAIL */}
              <aside className="flex flex-col border-l border-gray-200 bg-white overflow-y-auto" style={{ width: 300 }}>
                <div className="px-4 pt-3 pb-2 flex items-center justify-between"><div className="flex items-center gap-2">{editing && <GripVertical className="w-4 h-4 text-gray-300" />}<span className="text-sm font-semibold text-gray-900">Azal Intel</span><span className="text-xs text-gray-400 border border-gray-200 rounded-full px-1.5">{INTEL.length}</span></div><span className="text-xs text-gray-400">scored · ranked</span></div>
                {INTEL.map((it, i) => (<button key={i} className="w-full text-left flex items-center gap-3 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50"><span className="text-sm font-semibold text-gray-900 border-l-2 border-gray-300 pl-2 shrink-0" style={{ minWidth: 34 }}>{it.score}</span><span className="text-sm text-gray-700 flex-1">{it.text}</span><ArrowRight className="w-4 h-4 text-gray-300 shrink-0" /></button>))}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between border-t border-gray-100 mt-1"><div className="flex items-center gap-2">{editing && <GripVertical className="w-4 h-4 text-gray-300" />}<span className="text-sm font-semibold text-gray-900">Catalysts</span><span className="text-xs text-gray-400 border border-gray-200 rounded-full px-1.5">{CATALYSTS.length}</span></div><span className="text-xs text-gray-400">calendar</span></div>
                {CATALYSTS.map((c, i) => (<button key={i} className="w-full text-left flex items-center gap-3 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50"><span className="flex flex-col items-center justify-center border border-gray-200 rounded-md shrink-0" style={{ width: 40, height: 40 }}><span className="text-sm font-semibold text-gray-900 leading-none">{c.day}</span><span className="text-xs text-gray-400 leading-none mt-0.5">{c.mon}</span></span><span className="flex-1"><span className="block text-sm text-gray-900">{c.title}</span><span className="block text-xs text-blue-600 mt-0.5">→ {c.link}</span></span><ArrowRight className="w-4 h-4 text-gray-300 shrink-0" /></button>))}
                <div className="px-4 pt-4 pb-2 border-t border-gray-100 mt-1 flex items-center gap-2">{editing && <GripVertical className="w-4 h-4 text-gray-300" />}<span className="text-sm font-semibold text-gray-900">Positions</span></div>
                {POSITIONS.map((p, i) => (<div key={i} className="px-4 py-2.5 border-t border-gray-100"><div className="flex items-center justify-between"><span className="text-sm text-gray-900">{p.name}</span><span className={`text-sm font-semibold ${p.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>{p.pnl >= 0 ? "+" : "−"}${Math.abs(p.pnl)}</span></div><div className="flex items-center justify-between mt-0.5"><span className="text-xs text-gray-400">{p.detail}</span><button className="text-xs text-gray-400 flex items-center gap-0.5 hover:text-gray-700">exit <ChevronDown className="w-3 h-3" /></button></div></div>))}
                {slotWidget ? (
                  <div className="mx-4 my-3 rounded-lg border border-gray-200 p-3"><div className="flex items-center justify-between mb-2"><span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">{editing && <GripVertical className="w-3.5 h-3.5 text-gray-300" />}{WIDGETS.find((w) => w.key === slotWidget)?.name}</span>{editing && <button onClick={() => setSlotWidget(null)} className="text-gray-400 hover:text-gray-700"><X className="w-3.5 h-3.5" /></button>}</div><WidgetMini kind={slotWidget} /></div>
                ) : editing ? (
                  <div className="mx-4 my-3 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-6 text-center"><div className="text-sm text-blue-700 font-medium">Drop a widget here</div><div className="text-xs text-blue-500 mt-1">Add one from the widget editor</div></div>
                ) : (
                  <div className="mx-4 my-3 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center"><div className="text-sm text-gray-400">Free slot</div><div className="text-xs text-gray-300 mt-1">Reserved space, drop a widget here later</div></div>
                )}
              </aside>
            </div>
          )}

          {page === "portfolio" && (
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <div className="flex items-center gap-1 px-6 border-b border-gray-200 bg-white overflow-x-auto" style={{ minHeight: 44 }}>
                {PSUBPAGES.map((p) => (<button key={p.key} onClick={() => setPtab(p.key)} className={`text-sm whitespace-nowrap px-3 py-2.5 border-b-2 ${ptab === p.key ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{p.key}</button>))}
              </div>
              {ptab === "Overview" ? <PortfolioOverview onManageImported={() => setPtab("Imported Assets")} />
                : ptab === "Command Center" ? <CommandCenter />
                : ptab === "Wallets" ? <WalletsPage />
                : ptab === "Imported Assets" ? <ImportedAssetsPage onBack={() => setPtab("Overview")} />
                : ptab === "Translator" ? <TranslatorPage />
                : ptab === "Hedging" ? <HedgingPage onHedge={openHedge} selected={hedge} hedged={hedged} />
                : ptab === "Scenario Engine" ? <ScenarioEngine />
                : <PortfolioSub page={pcurrent} />}
            </div>
          )}

          {page === "social" && <SocialPage onOpenTrader={openTrader} following={following} copying={copying} onFollow={toggleFollow} />}

          {page === "rewards" && <RewardsPage />}

          {/* STATUS BAR */}
          <footer className="flex items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-500" style={{ height: 36 }}>
            <div className="flex items-center gap-4 min-w-0 overflow-hidden">
              <span className="shrink-0">Venue: <span className="text-gray-900 font-medium">Kalshi</span></span>
              <span className="shrink-0">Session: <span className="text-gray-900 font-medium">Open</span></span>
              <span className="shrink-0">Feed latency: <span className="text-gray-900 font-medium">32ms</span></span>
              <span className="flex items-center gap-1 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> WebSocket connected</span>
              <span className="text-gray-400 shrink-0">15:42:13</span>
            </div>
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50 shrink-0"><MessageSquare className="w-3.5 h-3.5" /> Chat (overlay)</button>
          </footer>
        </div>

        {/* WIDGET EDITOR */}
        {editing && page === "dashboard" && (
          <>
            <div onClick={() => setEditing(false)} className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.10)" }} />
            <aside className="absolute top-0 right-0 bottom-0 z-20 bg-white border-l border-gray-200 flex flex-col" style={{ width: 360, boxShadow: "-10px 0 30px rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between px-4 border-b border-gray-200" style={{ height: 56 }}><div><div className="text-sm font-semibold text-gray-900">Widget editor</div><div className="text-xs text-gray-400">Add widgets to your dashboard</div></div><button onClick={() => setEditing(false)} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button></div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Available widgets</div>
                {WIDGETS.map((w) => {
                  const added = slotWidget === w.key;
                  return (
                    <div key={w.key} className="border border-gray-200 rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-900">{w.name}</span>{added ? (<span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-1">Added</span>) : (<button onClick={() => setSlotWidget(w.key)} className="flex items-center gap-1 text-xs font-medium text-white rounded-md px-2 py-1" style={{ background: "#0b1220" }}><Plus className="w-3 h-3" /> Add</button>)}</div>
                      <div className="rounded-md bg-gray-50 border border-gray-100 p-2 overflow-hidden" style={{ minHeight: 46 }}><WidgetMini kind={w.key} /></div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 px-4 py-3"><button onClick={() => setEditing(false)} className="w-full rounded-lg py-2.5 text-sm font-medium text-white" style={{ background: "#0b1220" }}>Done</button></div>
            </aside>
          </>
        )}

        {/* HEDGE DRAWER */}
        {hedge && (
          <HedgeDrawer
            pos={HEDGE_POSITIONS[hedge.pi]}
            rel={HEDGE_POSITIONS[hedge.pi].related[hedge.ri]}
            ri={hedge.ri}
            amount={hedgeAmt}
            setAmount={setHedgeAmt}
            onPickRel={(j) => setHedge({ pi: hedge.pi, ri: j })}
            onConfirm={confirmHedge}
            onClose={() => setHedge(null)}
          />
        )}

        {/* TRADER / COPY DRAWER */}
        {social && (
          <TraderDrawer
            trader={findTrader(social.id)}
            mode={social.mode}
            setMode={(m) => { setSocial({ id: social.id, mode: m }); if (m === "copy" && copyAmt === 0) setCopyAmt(12500); }}
            amount={copyAmt}
            setAmount={setCopyAmt}
            copyMode={copyMode}
            setCopyMode={setCopyMode}
            isFollowing={following.includes(social.id)}
            isCopying={copying.includes(social.id)}
            onFollow={toggleFollow}
            onConfirmCopy={confirmCopy}
            onClose={() => setSocial(null)}
          />
        )}

      </div>
    </div>
  );
}
