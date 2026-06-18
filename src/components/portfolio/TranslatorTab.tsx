import { useEffect, useState } from "react";
import { Eye, Sparkles, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShellContext } from "@/lib/shell-context";
import { RelationshipGraph } from "./translator/RelationshipGraph";
import { EventSensitivityList } from "./translator/EventSensitivityList";
import { HedgeRoutes } from "./translator/HedgeRoutes";

type PingState = "idle" | "shown" | "dismissed";

export function TranslatorTab() {
  // Reuse the shell-owned Hedge drawer (same drawer Hedging uses) for the hedge routes.
  const { openHedge, hedge, hedged } = useShellContext();

  const [watching, setWatching] = useState(false);
  const [ping, setPing] = useState<PingState>("idle");

  // Mock "re-evaluates over time": once watching, a new correlation pings in shortly after.
  useEffect(() => {
    if (!watching) {
      setPing("idle");
      return;
    }
    if (ping !== "idle") return;
    const t = setTimeout(() => setPing("shown"), 1100);
    return () => clearTimeout(t);
  }, [watching, ping]);

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Translator</h3>
            <div className="text-xs text-gray-400 mt-0.5">
              See how your holdings, the drivers behind them, and prediction markets connect — then offset the links that matter.
            </div>
          </div>
          <button
            onClick={() => setWatching((w) => !w)}
            aria-pressed={watching}
            className={`shrink-0 flex items-center gap-1.5 text-xs font-medium rounded-full border px-3 py-1.5 ${
              watching
                ? "border-[#0b1220] bg-[#0b1220] text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {watching ? (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {watching ? "Watching" : "Watch this translation"}
          </button>
        </div>

        {watching && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Re-evaluating as correlations shift · we'll ping you when a new link forms.
          </div>
        )}

        {/* sample "new correlation" ping */}
        {watching && ping === "shown" && (
          <div className="mt-4 flex items-start gap-2.5 border border-blue-200 bg-blue-50 rounded-xl px-4 py-3">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-900">New correlation detected</div>
              <div className="text-xs text-blue-800/80 mt-0.5">
                ETH and your TLT hedge have started co-moving <span className="font-medium">+0.18</span> since you began watching — Crypto reg is leaking into rate-sensitive markets. The map and routes below were re-scored.
              </div>
            </div>
            <button
              onClick={() => setPing("dismissed")}
              aria-label="Dismiss"
              className="w-7 h-7 flex items-center justify-center rounded-md text-blue-400 hover:bg-blue-100 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* relationship graph */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white mt-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-900">How your book connects</h4>
            <span className="text-xs text-gray-400">Holdings → shared drivers → markets</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Hover a node to trace its links. Solid = aligned, dashed = inverse.</p>
          <RelationshipGraph />
        </div>

        {/* event sensitivity + hedge routes */}
        <div className="grid grid-cols-2 gap-5 mt-5">
          <EventSensitivityList />
          <HedgeRoutes onHedge={openHedge} selected={hedge} hedged={hedged} />
        </div>
      </div>
    </ScrollArea>
  );
}
