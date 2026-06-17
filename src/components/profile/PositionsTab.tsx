import { PositionBadge } from "@/components/PositionBadge";
import type { ProfileData, PositionStatus } from "@/components/profile/profile-data";
import type { HoldingSide } from "@/lib/mock";

// Mock copy provenance for the current user's own positions (source = handle copied from,
// null = self, former = kept after stopping a copy). Other traders' profiles show their
// own trades, so they carry no copy badges. A real API would put this on the position.
const ME_POSITION_SOURCE: Record<string, { source: string | null; former?: string }> = {
  "pos-0": { source: null },
  "pos-1": { source: "@apex_trades" },
  "pos-2": { source: "@deltaone" },
  "pos-3": { source: null, former: "@nova_fade" },
};

const sideChip = (side: HoldingSide) =>
  `text-xs font-medium rounded px-1.5 py-0.5 border ${side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`;

function statusClass(status: PositionStatus) {
  if (status === "Active") return "text-green-700 border-green-200 bg-green-50";
  if (status === "Near Resolution") return "text-amber-700 border-amber-200 bg-amber-50";
  return "text-gray-500 border-gray-200 bg-gray-50";
}

const COLS = "minmax(0,2.4fr) 1.1fr 1fr 1.1fr";

export function PositionsTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="space-y-5">
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">Portfolio composition</div>
        <div className="flex w-full rounded-full overflow-hidden" style={{ height: 8 }}>
          {profile.composition.map((s) => (
            <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-3">
          {profile.composition.map((s) => (
            <span key={s.label} className="flex items-center gap-2 text-xs">
              <span className="rounded-full" style={{ width: 8, height: 8, background: s.color }} />
              <span className="text-gray-600">{s.label}</span>
              <span className="text-gray-900 font-medium">{s.pct}%</span>
            </span>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div
          className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400"
          style={{ gridTemplateColumns: COLS }}
        >
          <span>Position</span>
          <span>Exposure</span>
          <span>P&amp;L</span>
          <span>Status</span>
        </div>
        {profile.positions.map((p) => {
          const prov = profile.isMe ? ME_POSITION_SOURCE[p.id] : undefined;
          return (
          <div
            key={p.id}
            className="grid items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            style={{ gridTemplateColumns: COLS }}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className={sideChip(p.side)}>{p.side}</span>
              <span className="text-sm text-gray-900 truncate min-w-0">{p.market}</span>
              {prov && <PositionBadge source={prov.source} former={prov.former} />}
            </span>
            <span className="text-sm text-gray-900">{p.exposure}</span>
            <span className={`text-sm font-medium ${p.up ? "text-green-600" : "text-red-500"}`}>{p.pnl}</span>
            <span><span className={`text-xs border rounded-full px-2 py-0.5 ${statusClass(p.status)}`}>{p.status}</span></span>
          </div>
          );
        })}
      </div>
    </div>
  );
}
