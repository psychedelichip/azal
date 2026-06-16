import { useState } from "react";
import type { ProfileData, PerfRow } from "@/components/profile/profile-data";

const COLS = "minmax(0,1.4fr) 1fr 1fr 1fr 1.1fr";

function Table({ rows }: { rows: PerfRow[] }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400"
        style={{ gridTemplateColumns: COLS }}
      >
        <span>Period</span>
        <span>Trades</span>
        <span>Win rate</span>
        <span>ROI</span>
        <span className="text-right">P&amp;L</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.period}
          className="grid items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          style={{ gridTemplateColumns: COLS }}
        >
          <span className="text-sm font-medium text-gray-900">{row.period}</span>
          <span className="text-sm text-gray-500">{row.trades}</span>
          <span className="text-sm text-gray-500">{row.win}</span>
          <span className={`text-sm font-medium ${row.up ? "text-green-600" : "text-red-500"}`}>{row.roi}</span>
          <span className={`text-sm font-medium text-right ${row.up ? "text-green-600" : "text-red-500"}`}>{row.pnl}</span>
        </div>
      ))}
    </div>
  );
}

export function PerformanceTab({ profile }: { profile: ProfileData }) {
  const [view, setView] = useState<"Monthly" | "Yearly">("Monthly");
  return (
    <div>
      <div className="flex gap-1 mb-3">
        {(["Monthly", "Yearly"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`text-sm rounded-md px-3 py-1.5 ${view === v ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}
          >
            {v}
          </button>
        ))}
      </div>
      <Table rows={view === "Monthly" ? profile.monthly : profile.yearly} />
    </div>
  );
}
