import { Link } from "react-router-dom";
import { Avatar } from "@/components/social/Avatar";
import { profilePath } from "@/components/profile/profile-data";
import type { Trader } from "@/lib/mock";

interface TraderListTabProps {
  traders: Trader[];
  following: string[];
  copying: string[];
  onFollow: (id: string) => void;
  onCopy: (id: string) => void;
  emptyLabel: string;
}

export function TraderListTab({ traders, following, copying, onFollow, onCopy, emptyLabel }: TraderListTabProps) {
  if (traders.length === 0) {
    return <div className="text-center text-sm text-gray-400 py-10">{emptyLabel}</div>;
  }
  return (
    <div className="space-y-2.5">
      {traders.map((t) => (
        <div key={t.id} className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
          <Link to={profilePath(t.name)} className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80">
            <Avatar name={t.name} hue={t.hue} size={38} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{t.name}</div>
              <div className="text-xs text-gray-400">{t.win} win · risk {t.risk}/7 · <span className="text-green-600">{t.roi} ROI</span></div>
            </div>
          </Link>
          <button
            onClick={() => onFollow(t.id)}
            className={`text-xs font-medium rounded-md px-2.5 py-1.5 border shrink-0 ${following.includes(t.id) ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          >
            {following.includes(t.id) ? "Following" : "Follow"}
          </button>
          <button onClick={() => onCopy(t.id)} className="text-xs font-medium text-white rounded-md px-2.5 py-1.5 shrink-0" style={{ background: "#0b1220" }}>
            {copying.includes(t.id) ? "Copying" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
}
