import { Link } from "react-router-dom";
import { Avatar } from "@/components/social/Avatar";
import { profilePath } from "@/components/profile/profile-data";
import type { CopyRow, CopyStatus } from "@/components/profile/profile-data";

function statusClass(status: CopyStatus) {
  if (status === "Active") return "text-green-700 border-green-200 bg-green-50";
  if (status === "Paused") return "text-gray-500 border-gray-200 bg-gray-50";
  return "text-amber-700 border-amber-200 bg-amber-50";
}

const COLS = "minmax(0,1.8fr) 1fr 1fr 1fr 1.1fr 0.8fr";

interface CopyingTabProps {
  rows: CopyRow[];
  onManage: (id: string) => void;
}

export function CopyingTab({ rows, onManage }: CopyingTabProps) {
  if (rows.length === 0) {
    return <div className="text-center text-sm text-gray-400 py-10">You are not copying anyone yet.</div>;
  }
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="grid items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400"
        style={{ gridTemplateColumns: COLS }}
      >
        <span>Trader</span>
        <span>Allocation</span>
        <span>Mode</span>
        <span>Copy P&amp;L</span>
        <span>Status</span>
        <span className="text-right">Manage</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.traderId}
          className="grid items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          style={{ gridTemplateColumns: COLS }}
        >
          <Link to={profilePath(row.name)} className="flex items-center gap-2.5 min-w-0 hover:opacity-80">
            <Avatar name={row.name} hue={row.hue} size={30} />
            <span className="text-sm font-medium text-gray-900 truncate">{row.name}</span>
          </Link>
          <span className="text-sm text-gray-900">{row.allocation}</span>
          <span className="text-sm text-gray-500 capitalize">{row.mode}</span>
          <span className={`text-sm font-medium ${row.up ? "text-green-600" : "text-red-500"}`}>{row.pnl}</span>
          <span><span className={`text-xs border rounded-full px-2 py-0.5 ${statusClass(row.status)}`}>{row.status}</span></span>
          <span className="text-right">
            <button onClick={() => onManage(row.traderId)} className="text-xs font-medium rounded-md px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50">Manage</button>
          </span>
        </div>
      ))}
    </div>
  );
}
