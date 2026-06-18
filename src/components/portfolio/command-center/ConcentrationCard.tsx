import { Fragment } from "react";
import { Grid3x3 } from "lucide-react";

// Markets (rows) x narratives (cols). Cell = mock risk weight 0..100 that the
// position loads onto that narrative. The Fed / Macro column runs hot on purpose.
const NARRATIVES = ["Fed / Macro", "AI", "Energy", "Geopol"];

const ROWS: { position: string; cells: number[] }[] = [
  { position: "Fed July cut", cells: [92, 8, 4, 14] },
  { position: "10Y above 4.5%", cells: [80, 6, 10, 8] },
  { position: "AI capex beat", cells: [42, 88, 6, 6] },
  { position: "US recession 2026", cells: [70, 24, 18, 22] },
  { position: "Brent above 90", cells: [24, 4, 86, 30] },
  { position: "tariff action", cells: [34, 10, 12, 78] },
];

// Darker = more concentrated.
function heat(v: number) {
  return `rgba(11, 18, 32, ${(0.06 + (v / 100) * 0.84).toFixed(3)})`;
}

export function ConcentrationCard() {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Grid3x3 className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Concentration</h4>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">62%</span>
        <span className="text-sm text-gray-700">of your risk is Fed / Macro</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 mb-5">
        Positions co-move, so true concentration runs higher than the Overview's 26% rates split — you're less diversified than it implies.
      </p>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: "minmax(96px, auto) repeat(4, 1fr)" }}>
        <div />
        {NARRATIVES.map((n) => (
          <div key={n} className="text-[11px] text-gray-400 text-center truncate px-1">{n}</div>
        ))}
        {ROWS.map((r) => (
          <Fragment key={r.position}>
            <div className="text-xs text-gray-600 truncate pr-2 flex items-center">{r.position}</div>
            {r.cells.map((v, i) => (
              <div
                key={i}
                className={`h-8 rounded-[3px] flex items-center justify-center text-[11px] font-medium ${v >= 55 ? "text-white" : "text-gray-500"}`}
                style={{ background: heat(v) }}
              >
                {v}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-[11px] text-gray-400">darker = more concentrated</span>
        <div className="flex-1" />
        <span className="text-[11px] text-gray-400">less</span>
        <div className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg, rgba(11,18,32,0.06), rgba(11,18,32,0.9))" }} />
        <span className="text-[11px] text-gray-400">more</span>
      </div>
    </section>
  );
}
