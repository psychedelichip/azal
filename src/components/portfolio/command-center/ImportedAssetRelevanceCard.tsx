import { Wallet } from "lucide-react";
import { IMPORTED_TOTAL_VALUE } from "@/lib/mock";

// Imported holdings (from the Translator/Overview model) share narratives with
// open prediction positions, so they amplify the same risk. Mock overlaps.
interface Overlap {
  asset: string;
  value: string;
  narrative: string;
  position: string;
}

const OVERLAPS: Overlap[] = [
  { asset: "NVDA · 120 sh", value: "$38.4k", narrative: "AI buildout", position: "AI capex beat · YES" },
  { asset: "US 10Y Treasury", value: "$24.3k", narrative: "Dovish Fed / rates", position: "Fed July cut · YES" },
  { asset: "BTC · 1.84", value: "$121.3k", narrative: "Risk-on / liquidity", position: "AI capex beat · YES" },
  { asset: "AAPL · 85 sh", value: "$19.1k", narrative: "Soft landing", position: "US recession · NO" },
];

export function ImportedAssetRelevanceCard() {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Imported assets in the risk picture</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        {IMPORTED_TOTAL_VALUE} across 4 imported assets <span className="text-gray-500">(via Translator)</span> is included in the risk above — not a separate silo.
      </p>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-3 py-2 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400">
          <div className="col-span-4">Imported asset</div>
          <div className="col-span-3">Narrative</div>
          <div className="col-span-5">Amplifies your position</div>
        </div>
        <div className="divide-y divide-gray-100">
          {OVERLAPS.map((o) => (
            <div key={o.asset} className="grid grid-cols-12 gap-3 px-3 py-2.5 items-center">
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-900 truncate">{o.asset}</span>
                <span className="text-xs text-gray-400 shrink-0">{o.value}</span>
              </div>
              <div className="col-span-3 text-sm text-gray-600 truncate">{o.narrative}</div>
              <div className="col-span-5 text-sm text-gray-700 truncate">{o.position}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
