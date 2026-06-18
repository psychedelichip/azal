import { useState } from "react";
import { CornerDownLeft, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TradeDrawer } from "@/components/dashboard/TradeDrawer";
import { ScenarioPositionImpact } from "./scenario/ScenarioPositionImpact";
import { RelatedMarkets } from "./scenario/RelatedMarkets";
import { resolveScenario, SCENARIO_RESULTS } from "./scenario/scenario-data";
import type { ResolvedScenario } from "./scenario/scenario-data";
import type { FeaturedMarket } from "@/lib/mock";

const QUICK_STARTS = SCENARIO_RESULTS.map((s) => s.label);

export function ScenarioEngineTab() {
  const [query, setQuery] = useState("");
  const [resolved, setResolved] = useState<ResolvedScenario | null>(null);
  const [tradeMarket, setTradeMarket] = useState<FeaturedMarket | null>(null);

  const run = (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    setResolved(resolveScenario(q));
  };

  const pickQuickStart = (label: string) => {
    setQuery(label);
    run(label);
  };

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5 max-w-4xl">
        <div className="mb-1">
          <h3 className="text-sm font-semibold text-gray-900">Scenario Engine</h3>
          <div className="text-xs text-gray-400 mt-0.5">Describe a what-if in plain language and see how your book responds.</div>
        </div>

        {/* ChatGPT-style scenario composer */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f8fafc] focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-300 transition-colors">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                run();
              }
            }}
            rows={2}
            placeholder="What happens if interest rates rise to 5%?"
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Sparkles className="w-3.5 h-3.5" /> Mocked — try a rates, Fed, or BTC scenario
            </span>
            <Button
              onClick={() => run()}
              disabled={!query.trim()}
              className="h-auto gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
            >
              Run <CornerDownLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Quick-start chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-0.5">Quick start</span>
          {QUICK_STARTS.map((label) => (
            <button
              key={label}
              onClick={() => pickQuickStart(label)}
              className="text-xs rounded-full px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {resolved && (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                {resolved.matched ? "Scenario" : "Closest match"}
              </div>
              <div className="text-sm text-gray-900">{resolved.result.interpretation}</div>
              {!resolved.matched && (
                <div className="mt-1.5 text-xs text-gray-400">
                  No exact match for your input — showing the closest example, “{resolved.result.label}”.
                </div>
              )}
            </div>

            <ScenarioPositionImpact positions={resolved.result.positions} />
            <RelatedMarkets markets={resolved.result.relatedMarkets} onTrade={setTradeMarket} />
          </div>
        )}
      </div>

      {tradeMarket && (
        <TradeDrawer open={!!tradeMarket} market={tradeMarket} onClose={() => setTradeMarket(null)} />
      )}
    </ScrollArea>
  );
}
