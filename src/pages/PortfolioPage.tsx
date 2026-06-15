import { ArrowDownToLine, ChevronRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WalletsTab } from "@/components/portfolio/WalletsTab";
import { ImportedAssetsTab } from "@/components/portfolio/ImportedAssetsTab";
import { HedgingTab } from "@/components/portfolio/HedgingTab";
import { CommandCenterTab } from "@/components/portfolio/CommandCenterTab";
import { TranslatorTab } from "@/components/portfolio/TranslatorTab";
import { ScenarioEngineTab } from "@/components/portfolio/ScenarioEngineTab";
import { useShellContext } from "@/lib/shell-context";
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
  HoldingRisk,
  HoldingStatus,
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

function SegBar({ segments }: { segments: ExposureSegment[] }) {
  return (
    <div>
      <div className="flex w-full rounded-full overflow-hidden" style={{ height: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2">
              <span className="rounded-full" style={{ width: 8, height: 8, background: s.color }} />
              <span className="text-gray-600">{s.label}</span>
            </span>
            <span className="text-gray-900 font-medium">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioOverview({ onManageImported }: { onManageImported: () => void }) {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Portfolio Overview</h3>
        <div className="grid grid-cols-4 gap-4 mb-7">
          {PORTFOLIO_STATS.map((s) => (
            <div key={s.label} className="border border-gray-200 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400">{s.label}</div>
              <div className={`text-2xl font-semibold mt-1 ${s.emphasize ? "text-green-600" : "text-gray-900"}`}>{s.value}</div>
              <div className={`text-xs mt-1 ${statTrendClass(s.trend)}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Net worth by source</h3>
          <span className="text-xs text-gray-400">Prediction positions and imported holdings, one number</span>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 mb-7">
          <SegBar segments={NETWORTH_BY_SOURCE} />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-3">Exposure Breakdown</h3>
        <div className="grid grid-cols-4 gap-4 mb-7">
          {EXPOSURE_BREAKDOWNS.map((b) => (
            <div key={b.title} className="border border-gray-200 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">{b.title}</div>
              <SegBar segments={b.segments} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Imported assets</h3>
          <button onClick={onManageImported} className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900">
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 mb-7">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-gray-400">Total imported value</div>
            <div className="text-sm font-semibold text-gray-900">{IMPORTED_TOTAL_VALUE}</div>
          </div>
          <SegBar segments={IMPORTED_SOURCE_SPLIT} />
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={onManageImported} className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              <ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import from wallet
            </Button>
            <Button variant="outline" onClick={onManageImported} className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              <Link2 className="w-4 h-4 text-gray-400" /> Connect brokerage
            </Button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-3">Holdings Table</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div
            className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400"
            style={{ gridTemplateColumns: HOLDINGS_COLS }}
          >
            <span>Position</span>
            <span>Exposure</span>
            <span>Risk</span>
            <span>PNL</span>
            <span>Status</span>
          </div>
          {HOLDINGS.map((h) => (
            <div
              key={h.id}
              className="grid items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
              style={{ gridTemplateColumns: HOLDINGS_COLS }}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 30, height: 30, background: "#7c3aed" }}>
                  <span className="rounded-full bg-white" style={{ width: 8, height: 8 }} />
                </span>
                <span className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${h.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{h.side}</span>
                <span className="text-sm text-gray-900 truncate">{h.name}</span>
              </span>
              <span className="text-sm text-gray-900">{h.exposure}</span>
              <span className={`text-sm ${riskClass(h.risk)}`}>{h.risk}</span>
              <span className={`text-sm font-medium ${h.up ? "text-green-600" : "text-red-500"}`}>{h.pnl}</span>
              <span><span className={`text-xs border rounded-full px-2 py-0.5 ${statusClass(h.status)}`}>{h.status}</span></span>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

export function PortfolioPage() {
  const { portfolioTab, setPortfolioTab, hedge, hedged, openHedge } = useShellContext();

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
      </div>
      {portfolioTab === "Overview" ? (
        <PortfolioOverview onManageImported={() => setPortfolioTab("Imported Assets")} />
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
