import { ArrowRight, ChevronDown, ChevronRight, GripVertical, LayoutGrid, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetMini } from "@/components/WidgetMini";
import { IntelTypeIcon } from "@/components/dashboard/intel-meta";
import { CATALYSTS, INTEL_ITEMS, POSITIONS, WIDGETS } from "@/lib/mock";
import type { WidgetKey } from "@/lib/mock";

interface RightRailProps {
  editing: boolean;
  slotWidget: WidgetKey | null;
  onRemoveWidget: () => void;
  /** Opens the Intel drawer — an item id opens its detail, no id opens the full feed. */
  onOpenIntel: (id?: string) => void;
}

function CountBadge({ count }: { count: number }) {
  return (
    <Badge variant="outline" className="h-auto text-xs font-normal text-gray-400 border-gray-200 rounded-full px-1.5 py-0">
      {count}
    </Badge>
  );
}

export function RightRail({ editing, slotWidget, onRemoveWidget, onOpenIntel }: RightRailProps) {
  return (
    <aside className="flex flex-col border-l border-gray-200 bg-white shrink-0 min-h-0" style={{ width: 300 }}>
      <ScrollArea className="flex-1 min-h-0">
        {/* Azal Intel */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editing && <GripVertical className="w-4 h-4 text-gray-300" />}
            <span className="text-sm font-semibold text-gray-900">Azal Intel</span>
            <CountBadge count={INTEL_ITEMS.length} />
          </div>
          <button onClick={() => onOpenIntel()} className="text-xs font-medium text-blue-600 hover:text-blue-700">View all</button>
        </div>
        {INTEL_ITEMS.map((it) => (
          <button key={it.id} onClick={() => onOpenIntel(it.id)} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50">
            <span className="text-sm font-semibold text-gray-900 border-l-2 border-gray-300 pl-2 shrink-0" style={{ minWidth: 30 }}>{it.score}</span>
            <IntelTypeIcon item={it} />
            <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{it.headline}</span>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
        ))}

        {/* Catalysts */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between border-t border-gray-100 mt-1">
          <div className="flex items-center gap-2">
            {editing && <GripVertical className="w-4 h-4 text-gray-300" />}
            <span className="text-sm font-semibold text-gray-900">Catalysts</span>
            <CountBadge count={CATALYSTS.length} />
          </div>
          <span className="text-xs text-gray-400">calendar</span>
        </div>
        {CATALYSTS.map((c) => (
          <button key={c.id} className="w-full text-left flex items-center gap-3 px-4 py-2.5 border-t border-gray-100 hover:bg-gray-50">
            <span className="flex flex-col items-center justify-center border border-gray-200 rounded-md shrink-0" style={{ width: 40, height: 40 }}>
              <span className="text-sm font-semibold text-gray-900 leading-none">{c.day}</span>
              <span className="text-xs text-gray-400 leading-none mt-0.5">{c.month}</span>
            </span>
            <span className="flex-1">
              <span className="block text-sm text-gray-900">{c.title}</span>
              <span className="block text-xs text-blue-600 mt-0.5">→ {c.linkedMarket}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
          </button>
        ))}

        {/* Positions */}
        <div className="px-4 pt-4 pb-2 border-t border-gray-100 mt-1 flex items-center gap-2">
          {editing && <GripVertical className="w-4 h-4 text-gray-300" />}
          <span className="text-sm font-semibold text-gray-900">Positions</span>
        </div>
        {POSITIONS.map((p) => (
          <div key={p.id} className="px-4 py-2.5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">{p.name}</span>
              <span className={`text-sm font-semibold ${p.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>{p.pnl >= 0 ? "+" : "−"}${Math.abs(p.pnl)}</span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-gray-400">{p.detail}</span>
              <button className="text-xs text-gray-400 flex items-center gap-0.5 hover:text-gray-700">exit <ChevronDown className="w-3 h-3" /></button>
            </div>
          </div>
        ))}

        {/* Free slot / added widget */}
        {slotWidget ? (
          <div className="mx-4 my-3 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                {editing && <GripVertical className="w-3.5 h-3.5 text-gray-300" />}
                {WIDGETS.find((w) => w.key === slotWidget)?.name}
              </span>
              {editing && (
                <button onClick={onRemoveWidget} className="text-gray-400 hover:text-gray-700"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
            <WidgetMini kind={slotWidget} />
          </div>
        ) : editing ? (
          <div className="mx-4 my-3 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-6 text-center">
            <div className="text-sm text-blue-700 font-medium">Drop a widget here</div>
            <div className="text-xs text-blue-500 mt-1">Add one from the widget editor</div>
          </div>
        ) : (
          <div className="mx-4 my-3 rounded-lg border border-dashed border-gray-200 px-4 py-5 flex flex-col items-center text-center">
            <LayoutGrid className="w-4 h-4 text-gray-300 mb-1.5" />
            <div className="text-sm text-gray-500">Pin a widget here</div>
            <div className="text-xs text-gray-400 mt-0.5">Add Markets, Intel, or a chart from the editor</div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
