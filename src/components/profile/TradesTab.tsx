import type { ProfileData } from "@/components/profile/profile-data";
import type { HoldingSide } from "@/lib/mock";

const sideChip = (side: HoldingSide) =>
  `text-xs font-medium rounded px-1.5 py-0.5 border ${side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`;

const COLS = "minmax(0,2.2fr) 1.1fr 0.9fr 1fr 0.9fr";

export function TradesTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400"
        style={{ gridTemplateColumns: COLS }}
      >
        <span>Market</span>
        <span>Entry → Exit</span>
        <span>Size</span>
        <span>P&amp;L</span>
        <span className="text-right">Date</span>
      </div>
      {profile.trades.map((t) => (
        <div
          key={t.id}
          className="grid items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          style={{ gridTemplateColumns: COLS }}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className={sideChip(t.side)}>{t.side}</span>
            <span className="text-sm text-gray-900 truncate">{t.market}</span>
          </span>
          <span className="text-sm text-gray-500">{t.entry} → {t.exit}</span>
          <span className="text-sm text-gray-900">{t.size}</span>
          <span className={`text-sm font-medium ${t.up ? "text-green-600" : "text-red-500"}`}>{t.pnl}</span>
          <span className="text-sm text-gray-400 text-right">{t.date}</span>
        </div>
      ))}
    </div>
  );
}
