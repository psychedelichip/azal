import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { SCENARIO_PORTFOLIO_BASE, SCENARIOS } from "@/lib/mock";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function ScenarioEngineTab() {
  const [selected, setSelected] = useState(0);
  const [severity, setSeverity] = useState(60);

  const scenario = SCENARIOS[selected];
  const scaled = scenario.legs.map((leg) => ({ ...leg, delta: Math.round((leg.delta * severity) / 100) }));
  const net = scaled.reduce((acc, leg) => acc + leg.delta, 0);
  const before = SCENARIO_PORTFOLIO_BASE;
  const after = before + net;

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Scenario Engine</h3>
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
          <div className="border border-gray-200 rounded-xl overflow-hidden h-fit">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
              <div className="col-span-9">Position</div>
              <div className="col-span-3 text-right">Projected</div>
            </div>
            <div className="divide-y divide-gray-100">
              {scaled.map((leg) => (
                <div key={leg.position} className="grid grid-cols-12 px-4 py-3 items-center">
                  <div className="col-span-9 text-sm text-gray-900">{leg.position}</div>
                  <div className={`col-span-3 text-right text-sm font-medium ${leg.delta < 0 ? "text-red-600" : "text-green-600"}`}>
                    {leg.delta < 0 ? "-" : "+"}{money(Math.abs(leg.delta))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400">Severity</span>
                <span className="text-sm font-medium text-gray-900">{severity}%</span>
              </div>
              <Slider value={[severity]} onValueChange={([v]) => setSeverity(v)} min={0} max={100} step={5} className="my-1" />
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-[#f8fafc]">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Projected portfolio impact</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Now</div>
                  <div className="text-base font-semibold text-gray-900">{money(before)}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Projected</div>
                  <div className={`text-base font-semibold ${net < 0 ? "text-red-600" : "text-green-600"}`}>{money(after)}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${net < 0 ? "text-red-600" : "text-green-600"}`}>
                Net {net < 0 ? "-" : "+"}{money(Math.abs(net))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
