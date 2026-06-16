import { Heart, MessageSquare, Repeat, Share2 } from "lucide-react";
import { Avatar } from "@/components/social/Avatar";
import type { ProfileData } from "@/components/profile/profile-data";
import type { HoldingSide } from "@/lib/mock";

const sideChip = (side: HoldingSide) =>
  `text-xs font-medium rounded px-1.5 py-0.5 border ${side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`;

export function PostsTab({ profile }: { profile: ProfileData }) {
  if (profile.posts.length === 0) {
    return <div className="text-center text-sm text-gray-400 py-10">No posts yet.</div>;
  }
  return (
    <div className="space-y-3">
      {profile.posts.map((p) => (
        <div key={p.id} className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={profile.name} hue={profile.hue} size={36} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{profile.name}</div>
              <div className="text-xs text-gray-400">{profile.at} · {p.time}</div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-3">{p.text}</div>
          {p.attach && (
            <div className="mt-3 border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-3">
              <span className={sideChip(p.attach.side)}>{p.attach.side}</span>
              <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{p.attach.market}</span>
              <span className={`text-sm font-medium shrink-0 ${p.attach.pnl.startsWith("−") ? "text-red-600" : "text-green-600"}`}>{p.attach.pnl}</span>
            </div>
          )}
          <div className="flex items-center gap-5 text-xs text-gray-400 mt-3">
            <button className="flex items-center gap-1 hover:text-red-500"><Heart className="w-3.5 h-3.5" /> {p.likes}</button>
            <button className="flex items-center gap-1 hover:text-gray-900"><MessageSquare className="w-3.5 h-3.5" /> {p.comments}</button>
            <button className="flex items-center gap-1 hover:text-green-600"><Repeat className="w-3.5 h-3.5" /> {p.reposts}</button>
            <button aria-label="Share post" className="flex items-center gap-1 hover:text-gray-900 ml-auto"><Share2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
