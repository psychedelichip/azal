import { useState } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { SCENARIO_PORTFOLIO_BASE, SCENARIOS } from "@/lib/mock";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// Docks the Scenario Engine here: same scenarios/math, read book-wide deltas inline.
export function ScenarioStagingCard() {
  const [selected, setSelected] = useState(0);
  const [severity, setSeverity] = useState(60);

  const scenario = SCENARIOS[selected];
  const scaled = scenario.legs.map((leg) => ({ ...leg, delta: Math.round((leg.delta * severity) / 100) }));
  const net = scaled.reduce((acc, leg) => acc + leg.delta, 0);
  const before = SCENARIO_PORTFOLIO_BASE;
  const after = before + net;
  const hit = scaled.filter((l) => l.delta !== 0).length;

  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Scenario staging</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">Stage a what-if and read the book-wide hit. Staged from the Scenario Engine.</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(i)}
            className={`text-sm rounded-lg px-3 py-1.5 border ${
              selected === i ? "border-gray-900 ring-1 ring-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
        <div className="rounded-xl border border-gray-200 p-4 bg-[#f8fafc]">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">If this plays out</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1">
              <div className="text-xs text-gray-400">Book now</div>
              <div className="text-base font-semibold text-gray-900">{money(before)}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className="flex-1">
              <div className="text-xs text-gray-400">Projected</div>
              <div className={`text-base font-semibold ${net < 0 ? "text-red-600" : "text-green-600"}`}>{money(after)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${net < 0 ? "text-red-600" : "text-green-600"}`}>
              Net {net < 0 ? "-" : "+"}{money(Math.abs(net))}
            </span>
            <span className="text-xs text-gray-400">
              hits <span className="font-medium text-gray-700">{hit} positions</span>
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-gray-400">Severity</span>
            <span className="text-sm font-medium text-gray-900">{severity}%</span>
          </div>
          <Slider value={[severity]} onValueChange={([v]) => setSeverity(v)} min={0} max={100} step={5} className="my-1" />
          <div className="mt-3 space-y-1">
            {scaled.map((leg) => (
              <div key={leg.position} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate pr-2">{leg.position}</span>
                <span className={`font-medium shrink-0 ${leg.delta < 0 ? "text-red-600" : "text-green-600"}`}>
                  {leg.delta < 0 ? "-" : "+"}{money(Math.abs(leg.delta))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
