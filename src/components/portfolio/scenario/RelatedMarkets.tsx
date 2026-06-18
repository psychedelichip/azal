import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScenarioRelatedMarket } from "./scenario-data";
import type { FeaturedMarket } from "@/lib/mock";

interface RelatedMarketsProps {
  markets: ScenarioRelatedMarket[];
  /** Opens the existing order ticket prefilled with this market. */
  onTrade: (market: FeaturedMarket) => void;
  title?: string;
}

// Reusable "Related markets you don't hold" section — also used by Command Center staging.
export function RelatedMarkets({
  markets,
  onTrade,
  title = "Related markets you don't hold",
}: RelatedMarketsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <span className="text-xs text-gray-400">{markets.length} affected · you don't hold these</span>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {markets.map((m) => {
            const Arrow = m.direction === "up" ? ArrowUpRight : ArrowDownRight;
            return (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">{m.market.title}</div>
                  <div className="text-xs text-gray-400 truncate">{m.rationale}</div>
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium shrink-0 ${m.direction === "up" ? "text-green-600" : "text-red-600"}`}>
                  <Arrow className="w-3.5 h-3.5" /> {m.move}
                </span>
                <Badge
                  variant="outline"
                  className={`h-auto text-xs font-medium rounded-full px-2 py-0.5 shrink-0 ${
                    m.suggestedSide === "yes" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
                  }`}
                >
                  Buy {m.suggestedSide === "yes" ? "Yes" : "No"}
                </Badge>
                <Button
                  onClick={() => onTrade(m.market)}
                  className="h-auto text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 text-white bg-[#0b1220] hover:bg-[#0b1220]"
                >
                  Trade
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
