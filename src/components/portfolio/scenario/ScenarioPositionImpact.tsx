import { Badge } from "@/components/ui/badge";
import type { ScenarioPositionResult, ScenarioResolution } from "./scenario-data";

const money = (n: number) => "$" + Math.round(Math.abs(n)).toLocaleString("en-US");

const RESOLUTION_STYLES: Record<ScenarioResolution, string> = {
  wins: "text-green-700 bg-green-50 border-green-200",
  loses: "text-red-700 bg-red-50 border-red-200",
  unchanged: "text-gray-600 bg-gray-50 border-gray-200",
};
const RESOLUTION_LABEL: Record<ScenarioResolution, string> = {
  wins: "Wins",
  loses: "Loses",
  unchanged: "Unchanged",
};

const deltaText = (n: number) => (n === 0 ? "$0" : (n < 0 ? "−" : "+") + money(n));
const deltaColor = (n: number) => (n < 0 ? "text-red-600" : n > 0 ? "text-green-600" : "text-gray-400");

interface ScenarioPositionImpactProps {
  positions: ScenarioPositionResult[];
  title?: string;
  /** Hide per-row reasons for tighter contexts (e.g. Command Center staging). */
  showNotes?: boolean;
}

// Reusable "Your positions under this scenario" section — also used by Command Center staging.
export function ScenarioPositionImpact({
  positions,
  title = "Your positions under this scenario",
  showNotes = true,
}: ScenarioPositionImpactProps) {
  const net = positions.reduce((acc, p) => acc + p.pnlDelta, 0);
  const affected = positions.filter((p) => p.pnlDelta !== 0).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <span className={`text-xs font-medium ${net < 0 ? "text-red-600" : "text-green-600"}`}>
          Book impact: {net < 0 ? "−" : "+"}{money(net)} across {affected} position{affected === 1 ? "" : "s"}
        </span>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {positions.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <Badge
                variant="outline"
                className={`h-auto text-xs font-medium rounded px-1.5 py-0.5 shrink-0 ${
                  p.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
                }`}
              >
                {p.side}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{p.name}</div>
                {showNotes && <div className="text-xs text-gray-400 truncate">{p.note}</div>}
              </div>
              <Badge
                variant="outline"
                className={`h-auto text-xs font-normal rounded-full px-2 py-0.5 shrink-0 ${RESOLUTION_STYLES[p.resolution]}`}
              >
                {RESOLUTION_LABEL[p.resolution]}
              </Badge>
              <span className={`text-sm font-medium w-20 text-right shrink-0 ${deltaColor(p.pnlDelta)}`}>
                {deltaText(p.pnlDelta)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
