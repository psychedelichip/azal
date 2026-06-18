import { Activity, Newspaper, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { IntelItem, IntelType } from "@/lib/mock";

export const INTEL_TYPE_LABEL: Record<IntelType, string> = {
  recommendation: "Recommendation",
  news: "News",
  market_move: "Market move",
  signal: "Signal",
};

/** Type-driven icon + accent color, so each intel kind reads at a glance. */
export function IntelTypeIcon({ item, className = "w-4 h-4 shrink-0" }: { item: IntelItem; className?: string }) {
  if (item.type === "recommendation") return <Sparkles className={`${className} text-blue-600`} />;
  if (item.type === "news") return <Newspaper className={`${className} text-slate-500`} />;
  if (item.type === "market_move")
    return item.direction === "up" ? (
      <TrendingUp className={`${className} text-green-600`} />
    ) : (
      <TrendingDown className={`${className} text-red-500`} />
    );
  return <Activity className={`${className} text-amber-600`} />;
}
