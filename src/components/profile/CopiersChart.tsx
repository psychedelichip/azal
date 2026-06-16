import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface CopiersChartProps {
  monthly: number[];
  copiers: string;
  started: number;
  stopped: number;
}

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const NOW_MONTH = 5; // June 2026 — the app's fixed "today"; series ends on the current month
const TRACK = 104;
// Trailing 12 months ending on the current month, so the highlighted final bar reads correctly.
const MONTH_LABELS = Array.from({ length: 12 }, (_, i) => MONTH_INITIALS[(NOW_MONTH + 1 + i) % 12]);

export function CopiersChart({ monthly, copiers, started, stopped }: CopiersChartProps) {
  const max = Math.max(...monthly, 1);

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-gray-400">Copiers</div>
        <span className="text-sm font-semibold text-gray-900">{copiers}</span>
      </div>
      <div className="flex items-end gap-1.5" style={{ height: TRACK }} aria-hidden="true">
        {monthly.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: Math.max(4, (v / max) * TRACK), background: i === monthly.length - 1 ? "#0b1220" : "#cbd5e1" }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {MONTH_LABELS.map((m, i) => (
          <span key={i} className="flex-1 text-center text-gray-300" style={{ fontSize: 9 }}>{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs">
        <span className="flex items-center gap-1 text-green-600"><ArrowUpRight className="w-3.5 h-3.5" /> +{started} started</span>
        <span className="flex items-center gap-1 text-red-500"><ArrowDownRight className="w-3.5 h-3.5" /> −{stopped} stopped</span>
        <span className="text-gray-400 ml-auto">last 7 days</span>
      </div>
    </div>
  );
}
