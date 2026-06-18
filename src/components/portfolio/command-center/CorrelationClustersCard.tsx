import { Layers } from "lucide-react";

// Positions that are secretly the same bet, grouped by their shared driver. Mock.
interface Cluster {
  id: string;
  name: string;
  driver: string;
  count: number;
  value: string;
  positions: string[];
}

const CLUSTERS: Cluster[] = [
  {
    id: "cl-rates",
    name: "Rate-decision cluster",
    driver: "Fed Jul 30",
    count: 5,
    value: "$148k",
    positions: ["Fed July cut · YES", "10Y above 4.5% · NO", "US recession · NO", "Fed Sep cut · YES", "CPI above 3.5% · NO"],
  },
  {
    id: "cl-ai",
    name: "AI-buildout cluster",
    driver: "NVDA earnings",
    count: 3,
    value: "$61k",
    positions: ["AI capex beat · YES", "NVDA beats Q3 · YES", "Semis rally · YES"],
  },
];

export function CorrelationClustersCard() {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Correlation clusters</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">Positions that are secretly the same bet.</p>

      <div className="space-y-3">
        {CLUSTERS.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-900">{c.name}</span>
              <span className="text-xs text-gray-400 shrink-0">
                {c.count} positions · <span className="text-gray-700 font-medium">{c.value}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 mb-2.5">
              <span className="text-[11px] text-gray-400">driver</span>
              <span className="text-[11px] font-medium rounded-full px-2 py-0.5 bg-[#0b1220] text-white">{c.driver}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.positions.map((p) => (
                <span key={p} className="text-[11px] text-gray-600 rounded border border-gray-200 px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
