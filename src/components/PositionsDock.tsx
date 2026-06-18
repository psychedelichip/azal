import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { POSITIONS } from "@/lib/mock";

/**
 * Floating dock pinned to the dashboard's bottom-right, above the status bar.
 * Collapsed by default to a compact pill (count + net P&L); clicking expands the
 * full positions list upward. Floats over content — never pushes layout.
 */
export function PositionsDock() {
  const [open, setOpen] = useState(false);
  const net = POSITIONS.reduce((sum, p) => sum + p.pnl, 0);
  const netUp = net >= 0;

  return (
    <div className="absolute bottom-3 right-4 z-30 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden divide-y divide-gray-100 animate-in fade-in-0 slide-in-from-bottom-1 duration-150">
          {POSITIONS.map((p) => (
            <div key={p.id} className="px-4 py-2.5">
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
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">Positions</span>
        <span className="text-gray-300">·</span>
        <span className="tabular-nums text-gray-500">{POSITIONS.length}</span>
        <span className="text-gray-300">·</span>
        <span className={`font-semibold tabular-nums ${netUp ? "text-green-600" : "text-red-500"}`}>{netUp ? "+" : "−"}${Math.abs(net)}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400 ml-0.5" /> : <ChevronUp className="w-4 h-4 text-gray-400 ml-0.5" />}
      </button>
    </div>
  );
}
