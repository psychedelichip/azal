import { useState } from "react";
import { ChevronDown, GripVertical, Plus, Settings, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_PILLS, MARKETS, SECTION_OPTIONS } from "@/lib/mock";
import type { MarketFilter } from "@/lib/mock";

export function MarketsColumn({ editing }: { editing: boolean }) {
  const [filter, setFilter] = useState<MarketFilter>("Trending");
  const visibleMarkets = filter === "Trending" ? MARKETS : MARKETS.filter((m) => m.section === filter);

  return (
    <section className="flex flex-col border-r border-gray-200 bg-white shrink-0" style={{ width: 340 }}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {editing && <GripVertical className="w-4 h-4 text-gray-300" />}
          <span className="text-base font-semibold text-gray-900">Markets</span>
          <Badge variant="outline" className="h-auto text-xs font-normal text-gray-400 border-gray-200 rounded-full px-2 py-0.5">
            {visibleMarkets.length}
          </Badge>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">scannable list <ChevronDown className="w-3 h-3" /></button>
      </div>

      <div className="flex items-center gap-1.5 px-4 pb-2">
        {CATEGORY_PILLS.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`flex items-center gap-1 text-sm rounded-full px-3 py-1 border ${
              filter === p ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p === "Trending" && <Star className="w-3.5 h-3.5" />} {p}
          </button>
        ))}
        <button className="text-gray-400 border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50">Trending <ChevronDown className="w-3 h-3 text-gray-400" /></button>
        <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50">Open markets <ChevronDown className="w-3 h-3 text-gray-400" /></button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-1 text-xs rounded-md px-2 py-1 border ${
                filter !== "Trending" ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter === "Trending" ? "All sections" : filter} <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 rounded-lg border border-gray-200 shadow-lg ring-0 p-0 py-1">
            {SECTION_OPTIONS.map((s) => (
              <DropdownMenuItem
                key={s}
                onSelect={() => setFilter(s === "All sections" ? "Trending" : s)}
                className="rounded-none px-3 py-1.5 text-sm text-gray-700 focus:bg-gray-50 focus:text-gray-700"
              >
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-gray-400 border border-gray-200 hover:bg-gray-50"><Settings className="w-3.5 h-3.5" /></button>
      </div>

      <div className="mx-4 mb-1 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
        <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Featured · Scraped news</div>
        <div className="text-sm font-medium text-gray-900">Will China invade Taiwan in 2026?</div>
        <div className="text-xs text-gray-500 mt-0.5">Reuters: Taiwan reports increased PLA activity near strait · 4m</div>
      </div>

      <ScrollArea className="flex-1 min-h-0 mt-1">
        {visibleMarkets.map((m) => (
          <button key={m.id} className="w-full text-left px-4 py-3 border-t border-gray-100 hover:bg-gray-50">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm text-gray-900 font-medium">{m.question}</span>
              <span className="text-sm font-semibold text-gray-900 shrink-0">{m.probability}%</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-gray-400">{m.volumeLabel} · {m.timeLabel}</span>
              <span className="flex items-center gap-1">
                <span className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">Y {m.yesPrice}¢</span>
                <span className="text-xs text-gray-500 border border-gray-200 rounded px-1.5 py-0.5">N {m.noPrice}¢</span>
              </span>
            </div>
          </button>
        ))}
        {visibleMarkets.length === 0 && <div className="px-4 py-6 text-sm text-gray-400">No markets in this section.</div>}
      </ScrollArea>
    </section>
  );
}
