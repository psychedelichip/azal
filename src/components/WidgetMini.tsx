import type { WidgetKey } from "@/lib/mock";

const MINI_MARKETS: Array<[string, string]> = [
  ["Will BTC hit $150k?", "7%"],
  ["Fed cuts in July?", "38%"],
  ["Trump approval?", "52%"],
];

const MINI_INTEL: Array<[string, string]> = [
  ["92", "BTC reacted to headline"],
  ["87", "ETH near catalyst"],
];

const MINI_CATALYSTS: Array<[string, string]> = [
  ["18 JUN", "ETH token unlock"],
  ["30 JUL", "Fed rate decision"],
];

const MINI_POSITIONS: Array<[string, string, boolean]> = [
  ["BTC $150k · Yes", "+$215", true],
  ["Fed cut · Yes", "−$22", false],
];

export function WidgetMini({ kind }: { kind: WidgetKey }) {
  switch (kind) {
    case "markets":
      return (
        <div className="w-full">
          {MINI_MARKETS.map(([q, p], i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <span className="text-xs text-gray-600 truncate" style={{ maxWidth: 150 }}>{q}</span>
              <span className="text-xs font-semibold text-gray-900 shrink-0 ml-2">{p}</span>
            </div>
          ))}
        </div>
      );
    case "chart":
      return (
        <svg viewBox="0 0 200 48" width="100%" className="block" style={{ height: 48 }}>
          <path d="M0,34 L28,28 L56,36 L84,20 L112,26 L140,16 L168,22 L200,18" fill="none" stroke="#111827" strokeWidth="1.5" />
        </svg>
      );
    case "intel":
      return (
        <div className="w-full space-y-1">
          {MINI_INTEL.map(([s, t], i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 border-l-2 border-gray-300 pl-1.5">{s}</span>
              <span className="text-xs text-gray-600 truncate">{t}</span>
            </div>
          ))}
        </div>
      );
    case "catalysts":
      return (
        <div className="w-full space-y-1">
          {MINI_CATALYSTS.map(([d, t], i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900 border border-gray-200 rounded px-1.5">{d}</span>
              <span className="text-xs text-gray-600 truncate">{t}</span>
            </div>
          ))}
        </div>
      );
    case "positions":
      return (
        <div className="w-full space-y-1">
          {MINI_POSITIONS.map(([n, v, up], i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 truncate" style={{ maxWidth: 150 }}>{n}</span>
              <span className={`text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>{v}</span>
            </div>
          ))}
        </div>
      );
    case "news":
      return (
        <div className="w-full space-y-1">
          <div className="text-xs text-gray-700 truncate">Trump signals openness to BTC reserve</div>
          <div className="text-xs text-gray-500 truncate">Spot BTC ETF inflows hit weekly record</div>
        </div>
      );
  }
}
