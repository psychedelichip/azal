import { ArrowRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HEDGE_POSITIONS } from "@/lib/mock";
import type { HedgeSelection } from "@/lib/mock";

/**
 * Concrete one-tap offsets for the book's most connected exposures. Each route points at a
 * real HEDGE_POSITIONS candidate and opens the existing Hedge drawer prefilled (via onHedge).
 * Coverage shown is the drawer's default-allocation coverage (50% of exposure × |correlation|)
 * so the number here matches what the drawer renders on open.
 */

interface RouteRef {
  id: string;
  /** Indices into HEDGE_POSITIONS. */
  pi: number;
  ri: number;
}

const ROUTES: RouteRef[] = [
  { id: "route-ai", pi: 1, ri: 1 }, // AI capex beat → AI capex slowdown by 2026
  { id: "route-fed", pi: 0, ri: 2 }, // Fed July cut → 10Y yield above 4.5%
  { id: "route-brent", pi: 2, ri: 0 }, // Brent above 90 → OPEC cuts output in Q3
];

interface Props {
  onHedge: (positionIndex: number, candidateIndex: number) => void;
  selected: HedgeSelection | null;
  hedged: string[];
}

export function HedgeRoutes({ onHedge, selected, hedged }: Props) {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Hedge routes</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">One-tap offsets for your most connected exposures.</p>

      <div className="space-y-2">
        {ROUTES.map((r) => {
          const pos = HEDGE_POSITIONS[r.pi];
          const cand = pos.candidates[r.ri];
          // Matches the drawer's default 50%-of-exposure allocation.
          const coverage = Math.round(0.5 * Math.abs(cand.correlation) * 100);
          const key = `${r.pi}-${r.ri}`;
          const isHedged = hedged.includes(key);
          const isSelected = selected?.pi === r.pi && selected?.ri === r.ri;

          return (
            <div
              key={r.id}
              className={`border rounded-lg px-3 py-2.5 ${isSelected ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-gray-400">Offset</span>
                <span className="text-sm font-medium text-gray-900">{pos.name}</span>
                <span
                  className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${
                    pos.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
                  }`}
                >
                  {pos.side}
                </span>
                <div className="flex-1" />
                {isHedged && (
                  <Badge variant="outline" className="h-auto gap-1 text-xs font-medium text-green-700 bg-green-50 border-green-200 rounded-full px-2 py-0.5 shrink-0">
                    <Shield className="w-3 h-3" /> Hedged
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`h-auto text-xs font-normal rounded-full px-2 py-0.5 shrink-0 ${
                    cand.relation === "Inverse" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}
                >
                  {cand.relation}
                </Badge>
                <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{cand.market}</span>
                <span className="text-sm text-gray-400 shrink-0">{cand.price}</span>
              </div>

              <div className="flex items-end gap-3 mt-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Est. coverage</span>
                    <span className="font-medium text-gray-900">~{coverage}%</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: "#e5e7eb" }}>
                    <div style={{ width: `${coverage}%`, background: "#16a34a" }} />
                  </div>
                </div>
                {isHedged ? (
                  <Button
                    variant="outline"
                    onClick={() => onHedge(r.pi, r.ri)}
                    className="h-auto gap-1 text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Edit <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => onHedge(r.pi, r.ri)}
                    className="h-auto gap-1 text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 text-white bg-[#0b1220] hover:bg-[#0b1220]"
                  >
                    Hedge <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
