import { ArrowRight } from "lucide-react";
import { CATALYSTS, CONTEXTUAL_NEWS, INTEL_ITEMS } from "@/lib/mock";

function SectionLabel({ label, fallback }: { label: string; fallback: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1 bg-gray-50/40">
      <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
      {fallback && <span className="text-xs text-gray-400">Across all markets</span>}
    </div>
  );
}

function SentimentDot({ s }: { s?: "up" | "down" | "neutral" }) {
  const color = s === "up" ? "bg-green-500" : s === "down" ? "bg-red-500" : "bg-gray-300";
  return <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />;
}

export function WhyThisMarket({ marketId }: { marketId: string }) {
  const intelScoped = INTEL_ITEMS.filter((i) => i.relatedMarketId === marketId);
  const catsScoped = CATALYSTS.filter((c) => c.relatedMarketId === marketId);
  const newsScoped = CONTEXTUAL_NEWS.filter((n) => n.marketId === marketId);

  const intel = intelScoped.length ? intelScoped : INTEL_ITEMS.slice(0, 2);
  const cats = catsScoped.length ? catsScoped : CATALYSTS.slice(0, 2);
  const news = newsScoped.length ? newsScoped : CONTEXTUAL_NEWS.slice(0, 2);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">Why this market</span>
        <span className="text-xs text-gray-400"> · signals, events, news</span>
      </div>

      <SectionLabel label="Azal Intel" fallback={!intelScoped.length} />
      {intel.map((it) => (
        <button key={it.id} className="w-full text-left flex items-center gap-3 px-4 py-2 border-t border-gray-100 hover:bg-gray-50">
          <span className="text-sm font-semibold text-gray-900 border-l-2 border-gray-300 pl-2 shrink-0" style={{ minWidth: 30 }}>{it.score}</span>
          <span className="text-sm text-gray-700 flex-1">{it.text}</span>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
        </button>
      ))}

      <SectionLabel label="Catalysts" fallback={!catsScoped.length} />
      {cats.map((c) => (
        <button key={c.id} className="w-full text-left flex items-center gap-3 px-4 py-2 border-t border-gray-100 hover:bg-gray-50">
          <span className="flex flex-col items-center justify-center border border-gray-200 rounded-md shrink-0" style={{ width: 40, height: 40 }}>
            <span className="text-sm font-semibold text-gray-900 leading-none">{c.day}</span>
            <span className="text-xs text-gray-400 leading-none mt-0.5">{c.month}</span>
          </span>
          <span className="text-sm text-gray-900 flex-1">{c.title}</span>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
        </button>
      ))}

      <SectionLabel label="News" fallback={!newsScoped.length} />
      {news.map((n) => (
        <button key={n.id} className="w-full text-left flex items-start gap-2.5 px-4 py-2 border-t border-gray-100 hover:bg-gray-50">
          <SentimentDot s={n.sentiment} />
          <span className="flex-1 min-w-0">
            <span className="block text-sm text-gray-700">{n.headline}</span>
            <span className="block text-xs text-gray-400 mt-0.5">{n.source} · {n.timeAgo}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
