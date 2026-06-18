import { useMemo, useState } from "react";
import { ArrowDownToLine, ChevronRight, Copy, Link2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PositionBadge } from "@/components/PositionBadge";
import { WalletsTab } from "@/components/portfolio/WalletsTab";
import { ImportedAssetsTab } from "@/components/portfolio/ImportedAssetsTab";
import { HedgingTab } from "@/components/portfolio/HedgingTab";
import { CommandCenterTab } from "@/components/portfolio/CommandCenterTab";
import { TranslatorTab } from "@/components/portfolio/TranslatorTab";
import { ScenarioEngineTab } from "@/components/portfolio/ScenarioEngineTab";
import { useShellContext } from "@/lib/shell-context";
import { activeWallets, useWalletBook } from "@/lib/wallet-store";
import type { WalletBook } from "@/lib/wallet-store";
import {
  EXPOSURE_BREAKDOWNS,
  HOLDINGS,
  IMPORTED_SOURCE_SPLIT,
  IMPORTED_TOTAL_VALUE,
  NETWORTH_BY_SOURCE,
  PORTFOLIO_STATS,
  PORTFOLIO_SUBPAGES,
} from "@/lib/mock";
import type {
  ExposureSegment,
  Holding,
  HoldingRisk,
  HoldingStatus,
  PortfolioStat,
  StatTrend,
} from "@/lib/mock";

const HOLDINGS_COLS = "minmax(0,2.4fr) 1fr 1fr 1fr 1.1fr";

function statTrendClass(trend: StatTrend) {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-500";
  return "text-gray-400";
}

function riskClass(risk: HoldingRisk) {
  if (risk === "High") return "text-red-600";
  if (risk === "Medium") return "text-amber-600";
  return "text-gray-500";
}

function statusClass(status: HoldingStatus) {
  if (status === "Active") return "text-green-700 border-green-200 bg-green-50";
  if (status === "Near Resolution") return "text-amber-700 border-amber-200 bg-amber-50";
  return "text-gray-500 border-gray-200 bg-gray-50";
}

// A holding tagged with where it came from. source = "@handle" if copied, null if self;
// former marks a self holding kept after a copy was stopped. A real API would put this on
// the Holding itself — layered locally here so /lib/mock stays untouched.
interface SourcedHolding extends Holding {
  source: string | null;
  former?: string;
  /** Which connected wallet this position sits in — drives Portfolio's active-wallet scoping. */
  walletId: string;
}

const HOLDING_SOURCE: Record<string, { source: string | null; former?: string }> = {
  "hold-fed-jul": { source: null },
  "hold-tariff": { source: "@apex_trades" },
  "hold-ai-capex": { source: "@marketwizard" },
  "hold-brent": { source: null, former: "@deltaone" },
};

// Position → wallet, layered locally so /lib/mock stays untouched (same overlay pattern as
// HOLDING_SOURCE). Cold storage holds no positions; unmapped ids fall back to the main wallet.
const HOLDING_WALLET: Record<string, string> = {
  "hold-fed-jul": "wallet-main",
  "hold-tariff": "wallet-main",
  "hold-ai-capex": "wallet-main",
  "hold-brent": "wallet-hedge",
  "hold-rate-path": "wallet-hedge",
  "hold-cpi-soft": "wallet-hedge",
};

// Extra copied positions so a trader holds several — exercises the grouping + counts.
const EXTRA_COPIED: Array<Omit<SourcedHolding, "walletId">> = [
  { id: "hold-rate-path", side: "YES", name: "Rate path 2026", exposure: "$9,800", risk: "Medium", pnl: "+$1,120", up: true, status: "Active", source: "@apex_trades" },
  { id: "hold-cpi-soft", side: "NO", name: "CPI under 3%", exposure: "$7,400", risk: "Low", pnl: "+$540", up: true, status: "Active", source: "@apex_trades" },
];

const SOURCED_HOLDINGS: SourcedHolding[] = [
  ...HOLDINGS.map((h) => ({ ...h, ...(HOLDING_SOURCE[h.id] ?? { source: null }) })),
  ...EXTRA_COPIED,
].map((h) => ({ ...h, walletId: HOLDING_WALLET[h.id] ?? "wallet-main" }));

/* ---- active-wallet scoping ---- */

// Tolerates "$28,400", "+$4,220", and unicode-minus "−$1,180".
function parseUsd(s: string): number {
  const negative = /[-−]/.test(s);
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return negative ? -Math.abs(n) : n;
}

function fmtUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function fmtPnl(n: number): string {
  const rounded = Math.round(n);
  return `${rounded < 0 ? "−" : "+"}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

// Whole-portfolio value (incl. imported) — kept as the exposure-% denominator so the scoped
// figure reads as a share of net worth, not of a single wallet (preserves the reconciliation).
const PORTFOLIO_TOTAL = parseUsd(PORTFOLIO_STATS[0].value);

// Position-level cards derived from the scoped holdings. Card 1 (total net worth incl. imported)
// stays portfolio-wide; exposure / open positions / PNL reflect the active wallet(s) only.
function scopedStats(holdings: SourcedHolding[]): PortfolioStat[] {
  const exposure = holdings.reduce((sum, h) => sum + parseUsd(h.exposure), 0);
  const pnl = holdings.reduce((sum, h) => sum + parseUsd(h.pnl), 0);
  const nearResolution = holdings.filter((h) => h.status === "Near Resolution").length;
  const pct = PORTFOLIO_TOTAL > 0 ? Math.round((exposure / PORTFOLIO_TOTAL) * 100) : 0;
  const count = holdings.length;
  return [
    PORTFOLIO_STATS[0],
    { label: "Market exposure", value: fmtUsd(exposure), delta: `${pct}% of portfolio`, trend: "neutral" },
    { label: "Open positions", value: String(count), delta: `${nearResolution} near resolution`, trend: "neutral" },
    {
      label: "PNL",
      value: fmtPnl(pnl),
      delta: `across ${count} position${count === 1 ? "" : "s"}`,
      trend: pnl >= 0 ? "up" : "down",
      emphasize: pnl >= 0,
    },
  ];
}

// Badge text: a single wallet's name, "{group} · N wallets", or "All wallets" when unscoped.
function trackingLabel(book: WalletBook): string {
  const { active, wallets, groups } = book;
  if (!active) return "All wallets";
  if (active.kind === "wallet") return wallets.find((w) => w.id === active.id)?.label ?? "—";
  const group = groups.find((g) => g.id === active.id);
  const n = wallets.filter((w) => w.groupId === active.id).length;
  return group ? `${group.name} · ${n} wallet${n === 1 ? "" : "s"}` : "—";
}

function HoldingRow({ h }: { h: SourcedHolding }) {
  return (
    <div className="grid items-center gap-x-4 px-3 border-b border-gray-100 hover:bg-gray-50" style={{ gridTemplateColumns: HOLDINGS_COLS, height: 32 }}>
      <span className="flex items-center gap-2 min-w-0">
        <span className="rounded-md flex items-center justify-center shrink-0" style={{ width: 20, height: 20, background: "#7c3aed" }}>
          <span className="rounded-full bg-white" style={{ width: 6, height: 6 }} />
        </span>
        <span className={`text-[11px] font-medium rounded px-1 py-0.5 border shrink-0 ${h.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{h.side}</span>
        <span className="text-[13px] text-gray-900 truncate min-w-0">{h.name}</span>
        <PositionBadge source={h.source} former={h.former} />
      </span>
      <span className="text-[13px] text-gray-900 text-right tabular-nums">{h.exposure}</span>
      <span className={`text-[13px] ${riskClass(h.risk)}`}>{h.risk}</span>
      <span className={`text-[13px] font-medium text-right tabular-nums ${h.up ? "text-green-600" : "text-red-500"}`}>{h.pnl}</span>
      <span><span className={`text-[11px] border rounded-full px-2 py-0.5 ${statusClass(h.status)}`}>{h.status}</span></span>
    </div>
  );
}

function HoldingsTable({ holdings }: { holdings: SourcedHolding[] }) {
  const selfHoldings = useMemo(() => holdings.filter((h) => !h.source), [holdings]);
  const groups = useMemo(() => {
    const handles = [...new Set(holdings.filter((h) => h.source).map((h) => h.source as string))];
    return handles.map((handle) => ({ handle, rows: holdings.filter((h) => h.source === handle) }));
  }, [holdings]);

  // filter: "all" | "self" | "copied" | a trader handle ("@…"). collapsed keyed by handle.
  const [filter, setFilter] = useState("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (handle: string) => setCollapsed((c) => ({ ...c, [handle]: !c[handle] }));

  const chips = [
    { value: "all", label: "All" },
    { value: "self", label: "Self" },
    { value: "copied", label: "Copied" },
    ...groups.map((g) => ({ value: g.handle, label: g.handle })),
  ];

  const showSelf = filter === "all" || filter === "self";
  const visibleGroups =
    filter === "all" || filter === "copied" ? groups : filter === "self" ? [] : groups.filter((g) => g.handle === filter);
  const empty = (!showSelf || selfHoldings.length === 0) && visibleGroups.length === 0;

  return (
    <>
      <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-0.5">
        {chips.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            aria-pressed={filter === c.value}
            className={`text-xs whitespace-nowrap rounded-full border px-2.5 py-1 ${
              filter === c.value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div
          className="grid items-center gap-x-4 px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400"
          style={{ gridTemplateColumns: HOLDINGS_COLS }}
        >
          <span>Position</span>
          <span className="text-right">Exposure</span>
          <span>Risk</span>
          <span className="text-right">PNL</span>
          <span>Status</span>
        </div>
        {showSelf && selfHoldings.map((h) => <HoldingRow key={h.id} h={h} />)}
        {visibleGroups.map((g) => {
          const isCollapsed = collapsed[g.handle];
          return (
            <div key={g.handle}>
              <button
                onClick={() => toggle(g.handle)}
                aria-expanded={!isCollapsed}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-left hover:bg-gray-100/70"
              >
                <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCollapsed ? "" : "rotate-90"}`} />
                <Copy className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium text-gray-700">Copied from {g.handle}</span>
                <span className="text-xs text-gray-400">· {g.rows.length} position{g.rows.length === 1 ? "" : "s"}</span>
              </button>
              {!isCollapsed && g.rows.map((h) => <HoldingRow key={h.id} h={h} />)}
            </div>
          );
        })}
        {empty && <div className="px-4 py-6 text-center text-sm text-gray-400">No positions match this filter.</div>}
      </div>
    </>
  );
}

function SegBar({
  segments,
  layout = "stacked",
  barHeight = 8,
}: {
  segments: ExposureSegment[];
  layout?: "stacked" | "inline";
  barHeight?: number;
}) {
  return (
    <div>
      <div className="flex w-full rounded-full overflow-hidden" style={{ height: barHeight }}>
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      {layout === "inline" ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {segments.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: s.color }} />
              <span className="text-gray-600">{s.label}</span>
              <span className="text-gray-900 font-medium tabular-nums">{s.pct}%</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-[11px]" style={{ height: 22 }}>
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: s.color }} />
                <span className="text-gray-600 truncate">{s.label}</span>
              </span>
              <span className="text-gray-900 font-medium tabular-nums">{s.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioOverview({ onManageImported, scopedIds }: { onManageImported: () => void; scopedIds: Set<string> }) {
  const scopedHoldings = useMemo(() => SOURCED_HOLDINGS.filter((h) => scopedIds.has(h.walletId)), [scopedIds]);
  const stats = useMemo(() => scopedStats(scopedHoldings), [scopedHoldings]);
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-4">
        {/* KPI stat strip — one dense row, divided cells */}
        <div className="grid grid-cols-4 border border-gray-200 rounded-lg divide-x divide-gray-200 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-2">
              <div className="text-[11px] uppercase tracking-wider text-gray-400">{s.label}</div>
              <div className={`text-[19px] leading-tight font-semibold mt-0.5 tabular-nums ${s.emphasize ? "text-green-600" : "text-gray-900"}`}>{s.value}</div>
              <div className={`text-[11px] mt-0.5 ${statTrendClass(s.trend)}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Net worth by source — imported composition folded in (both are net-worth breakdowns) */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-semibold text-gray-900">Net worth by source</h3>
          <span className="text-[11px] text-gray-400">Prediction positions and imported holdings, one number</span>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 mb-4">
          <SegBar segments={NETWORTH_BY_SOURCE} layout="inline" barHeight={8} />
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Imported assets ·{" "}
                <span className="text-gray-900 font-semibold normal-case tracking-normal tabular-nums">{IMPORTED_TOTAL_VALUE}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" onClick={onManageImported} className="h-6 gap-1 text-[11px] font-normal border-gray-200 rounded-md px-2 text-gray-700 hover:bg-gray-50">
                  <ArrowDownToLine className="w-3.5 h-3.5 text-gray-400" /> Import
                </Button>
                <Button variant="outline" onClick={onManageImported} className="h-6 gap-1 text-[11px] font-normal border-gray-200 rounded-md px-2 text-gray-700 hover:bg-gray-50">
                  <Link2 className="w-3.5 h-3.5 text-gray-400" /> Connect
                </Button>
                <button onClick={onManageImported} className="flex items-center gap-0.5 text-[11px] font-medium text-gray-600 hover:text-gray-900">
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <SegBar segments={IMPORTED_SOURCE_SPLIT} layout="inline" barHeight={6} />
          </div>
        </div>

        <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Exposure Breakdown</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {EXPOSURE_BREAKDOWNS.map((b) => (
            <div key={b.title} className="border border-gray-200 rounded-lg p-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">{b.title}</div>
              <SegBar segments={b.segments} barHeight={6} />
            </div>
          ))}
        </div>

        <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Holdings Table</h3>
        <HoldingsTable holdings={scopedHoldings} />
      </div>
    </ScrollArea>
  );
}

export function PortfolioPage() {
  const { portfolioTab, setPortfolioTab, hedge, hedged, openHedge } = useShellContext();
  const book = useWalletBook();
  // active null ⇒ portfolio-wide (all wallets); otherwise the active wallet or group's wallets.
  const scopedIds = useMemo(
    () => new Set((book.active ? activeWallets(book) : book.wallets).map((w) => w.id)),
    [book],
  );
  const tracking = trackingLabel(book);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <div className="flex items-center gap-1 px-6 border-b border-gray-200 bg-white overflow-x-auto" style={{ minHeight: 44 }}>
        {PORTFOLIO_SUBPAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPortfolioTab(p.key)}
            className={`text-sm whitespace-nowrap px-3 py-2.5 border-b-2 ${
              portfolioTab === p.key ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {p.key}
          </button>
        ))}
        <button
          onClick={() => setPortfolioTab("Wallets")}
          title="Portfolio is scoped to your active wallet — manage in Wallets"
          className="ml-auto shrink-0 flex items-center gap-1.5 rounded-full border border-gray-200 pl-2 pr-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300"
        >
          <Wallet className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400">Tracking:</span>
          <span className="font-medium text-gray-900 truncate max-w-[160px]">{tracking}</span>
        </button>
      </div>
      {portfolioTab === "Overview" ? (
        <PortfolioOverview onManageImported={() => setPortfolioTab("Imported Assets")} scopedIds={scopedIds} />
      ) : portfolioTab === "Command Center" ? (
        <CommandCenterTab />
      ) : portfolioTab === "Wallets" ? (
        <WalletsTab />
      ) : portfolioTab === "Imported Assets" ? (
        <ImportedAssetsTab onBack={() => setPortfolioTab("Overview")} />
      ) : portfolioTab === "Translator" ? (
        <TranslatorTab />
      ) : portfolioTab === "Hedging" ? (
        <HedgingTab onHedge={openHedge} selected={hedge} hedged={hedged} />
      ) : (
        <ScenarioEngineTab />
      )}
    </div>
  );
}
