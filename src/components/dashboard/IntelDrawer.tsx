import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IntelTypeIcon, INTEL_TYPE_LABEL } from "@/components/dashboard/intel-meta";
import { INTEL_ITEMS } from "@/lib/mock";
import type { HoldingSide, IntelAction, IntelItem, IntelRecommendation, IntelType } from "@/lib/mock";

interface IntelDrawerProps {
  open: boolean;
  /** An id opens that item's detail; null/undefined opens the full ranked feed. */
  initialId?: string | null;
  onClose: () => void;
  onSelectMarket: (marketId: string) => void;
  onTrade: (marketId: string, side?: HoldingSide) => void;
  onHedge: (positionId?: string) => void;
}

type Filter = IntelType | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "recommendation", label: "Recommendations" },
  { key: "news", label: "News" },
  { key: "market_move", label: "Market moves" },
  { key: "signal", label: "Signals" },
];

const sideChip = (side: HoldingSide) =>
  `text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${
    side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
  }`;

const actionLabel = (it: IntelRecommendation, a: IntelAction) =>
  a === "buy" ? `Buy ${it.side}` : a === "sell" ? `Sell ${it.side}` : "Hedge";

const PRIMARY_BTN = "flex-1 h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220]";
const SECONDARY_BTN = "flex-1 h-auto rounded-lg py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50";

function feedSubline(it: IntelItem): string {
  switch (it.type) {
    case "recommendation":
      return `${actionLabel(it, it.actions[0])} · ${it.market}`;
    case "news":
      return `${it.source} · ${it.relatedMarkets.length} market${it.relatedMarkets.length === 1 ? "" : "s"}`;
    case "market_move":
      return `${it.market} ${it.delta}`;
    case "signal":
      return `Crowd ${it.crowd} vs model ${it.model}`;
  }
}

function SentimentDot({ s }: { s?: "up" | "down" | "neutral" }) {
  const color = s === "up" ? "bg-green-500" : s === "down" ? "bg-red-500" : "bg-gray-300";
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color}`} />;
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  if (points.length < 2) return null;
  const w = 100;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const coords = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - 2 - ((p - min) / span) * (h - 4)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height: 28 }}>
      <polyline
        points={coords}
        fill="none"
        stroke={up ? "#16a34a" : "#ef4444"}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function IntelDrawer({ open, initialId, onClose, onSelectMarket, onTrade, onHedge }: IntelDrawerProps) {
  const [view, setView] = useState<"feed" | "detail">("feed");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!open) return;
    if (initialId) {
      setSelectedId(initialId);
      setView("detail");
    } else {
      setSelectedId(null);
      setView("feed");
    }
    setFilter("all");
  }, [open, initialId]);

  const item = selectedId ? INTEL_ITEMS.find((i) => i.id === selectedId) : undefined;
  const showDetail = view === "detail" && !!item;

  const list = [...INTEL_ITEMS]
    .sort((a, b) => b.score - a.score)
    .filter((i) => filter === "all" || i.type === filter);

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l border-gray-200 rounded-r-xl shadow-[-10px_0_30px_rgba(0,0,0,0.08)]"
        style={{ top: 16, right: 16, bottom: 16, width: 416, maxWidth: 416, height: "auto" }}
      >
        {showDetail && item ? (
          <>
            <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <button onClick={() => setView("feed")} className="w-7 h-7 -ml-1.5 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 shrink-0" aria-label="All intel">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <IntelTypeIcon item={item} />
                <div className="min-w-0">
                  <SheetTitle className="text-sm font-semibold text-gray-900">{INTEL_TYPE_LABEL[item.type]}</SheetTitle>
                  <SheetDescription className="text-xs text-gray-400 truncate">{item.headline}</SheetDescription>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 shrink-0"><X className="w-4 h-4" /></button>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-4">
                {/* full headline + score/meta (header truncates) */}
                <div>
                  <div className="text-[15px] font-semibold text-gray-900 leading-snug">{item.headline}</div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                    <span className="text-gray-700 font-medium">{item.score}</span>
                    <span>Azal score</span>
                    <span>·</span>
                    <span>{item.timeAgo} ago</span>
                    {item.type === "news" && (
                      <>
                        <span>·</span>
                        <SentimentDot s={item.sentiment} />
                        <span>{item.source}</span>
                      </>
                    )}
                  </div>
                </div>

                {item.type === "recommendation" && (
                  <>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">Why this</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.rationale}</p>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Target market</div>
                      <button onClick={() => onSelectMarket(item.marketId)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-gray-50">
                        <span className={sideChip(item.side)}>{item.side}</span>
                        <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{item.market}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                      </button>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-gray-500">
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                      <span>Azal Intel is a model estimate, not a guarantee. Size positions to your own risk.</span>
                    </div>
                  </>
                )}

                {item.type === "news" && (
                  <>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.body}</p>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Related markets</div>
                      <div className="space-y-1.5">
                        {item.relatedMarkets.map((m) => (
                          <button key={m.id} onClick={() => onSelectMarket(m.id)} className="w-full border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2.5 text-left hover:bg-gray-50">
                            <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{m.name}</span>
                            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                    {item.affectedPositions && item.affectedPositions.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Affected positions</div>
                        <div className="space-y-1.5">
                          {item.affectedPositions.map((p) => (
                            <div key={p.id} className="border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">{p.name}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {item.type === "market_move" && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{item.market}</span>
                      <span className={`text-lg font-semibold shrink-0 ${item.direction === "up" ? "text-green-600" : "text-red-500"}`}>{item.delta}</span>
                    </div>
                    <div className="mt-2.5"><Sparkline points={item.sparkline} up={item.direction === "up"} /></div>
                    <div className="text-xs text-gray-400 mt-1.5">{item.volumeLabel}</div>
                  </div>
                )}

                {item.type === "signal" && (
                  <>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.alert}</p>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-2.5">Crowd vs. model</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1"><div className="text-xs text-gray-400">Crowd</div><div className="text-lg font-semibold text-gray-900">{item.crowd}¢</div></div>
                        <div className="flex-1 text-right"><div className="text-xs text-gray-400">Azal model</div><div className="text-lg font-semibold text-blue-600">{item.model}¢</div></div>
                      </div>
                      <div className="relative mt-3" style={{ height: 8 }}>
                        <div className="absolute inset-0 rounded-full bg-gray-100" />
                        <div className="absolute top-1/2 rounded-full bg-gray-400 border-2 border-white" style={{ left: `${item.crowd}%`, width: 12, height: 12, transform: "translate(-50%,-50%)" }} />
                        <div className="absolute top-1/2 rounded-full bg-blue-600 border-2 border-white" style={{ left: `${item.model}%`, width: 12, height: 12, transform: "translate(-50%,-50%)" }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="shrink-0 border-t border-gray-200 px-4 py-3">
              {item.type === "recommendation" ? (
                <div className="flex gap-2">
                  {item.actions.map((a, i) => (
                    <Button
                      key={a}
                      onClick={() => (a === "hedge" ? onHedge(item.positionId) : onTrade(item.marketId, item.side))}
                      className={i === 0 ? PRIMARY_BTN : SECONDARY_BTN}
                    >
                      {actionLabel(item, a)}
                    </Button>
                  ))}
                </div>
              ) : item.type === "news" ? (
                <Button
                  onClick={() => { const f = item.relatedMarkets[0]; if (f) onSelectMarket(f.id); }}
                  className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] min-w-0"
                >
                  <span className="truncate">View {item.relatedMarkets[0]?.name ?? "market"}</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => onSelectMarket(item.marketId)} className={SECONDARY_BTN}>View market</Button>
                  <Button onClick={() => onTrade(item.marketId)} className={PRIMARY_BTN}>Trade</Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
              <div className="min-w-0">
                <SheetTitle className="text-sm font-semibold text-gray-900">Azal Intel</SheetTitle>
                <SheetDescription className="text-xs text-gray-400">scored · ranked · {INTEL_ITEMS.length} signals</SheetDescription>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 shrink-0"><X className="w-4 h-4" /></button>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`text-xs rounded-full px-2.5 py-1 border ${
                      filter === f.key ? "bg-[#0b1220] text-white border-[#0b1220]" : "text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {list.map((it) => (
                <button
                  key={it.id}
                  onClick={() => { setSelectedId(it.id); setView("detail"); }}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50"
                >
                  <span className="text-sm font-semibold text-gray-900 border-l-2 border-gray-300 pl-2 shrink-0" style={{ minWidth: 30 }}>{it.score}</span>
                  <IntelTypeIcon item={it} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-gray-900 truncate">{it.headline}</span>
                    <span className="block text-xs text-gray-400 truncate">{feedSubline(it)}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              ))}
              {list.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-gray-400">No intel of this type right now.</div>
              )}
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
