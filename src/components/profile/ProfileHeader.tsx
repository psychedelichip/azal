import { Pencil, Share2 } from "lucide-react";
import { Avatar } from "@/components/social/Avatar";
import type { ProfileData } from "@/components/profile/profile-data";

interface ProfileHeaderProps {
  profile: ProfileData;
  isFollowing: boolean;
  isCopying: boolean;
  onFollow: () => void;
  onCopy: () => void;
  onShowFollowing: () => void;
  onShowFollowers: () => void;
}

export function ProfileHeader({
  profile,
  isFollowing,
  isCopying,
  onFollow,
  onCopy,
  onShowFollowing,
  onShowFollowers,
}: ProfileHeaderProps) {
  const counts: Array<{ label: string; value: string; onClick?: () => void }> = [
    { label: "Followers", value: profile.followers, onClick: profile.isMe ? onShowFollowers : undefined },
    { label: "Following", value: profile.following, onClick: profile.isMe ? onShowFollowing : undefined },
    { label: "Copiers", value: profile.copiers },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-5">
      <div className="flex items-start gap-4">
        <Avatar name={profile.name} hue={profile.hue} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h2>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">{profile.tier}</span>
          </div>
          <div className="text-sm text-gray-400">{profile.at}</div>
          <p className="text-sm text-gray-600 mt-2 max-w-xl">{profile.bio}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {profile.isMe ? (
            <>
              <button className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Pencil className="w-4 h-4 text-gray-400" /> Edit profile
              </button>
              <button className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50">
                <Share2 className="w-4 h-4 text-gray-400" /> Share
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onFollow}
                className={`text-sm font-medium rounded-lg px-4 py-2 border ${isFollowing ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button onClick={onCopy} className="text-sm font-medium text-white rounded-lg px-4 py-2" style={{ background: "#0b1220" }}>
                {isCopying ? "Copying" : "Copy"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
        {counts.map((c) => {
          const inner = (
            <>
              <span className="text-sm font-semibold text-gray-900">{c.value}</span>{" "}
              <span className="text-sm text-gray-400">{c.label}</span>
            </>
          );
          return c.onClick ? (
            <button key={c.label} onClick={c.onClick} className="hover:opacity-70">{inner}</button>
          ) : (
            <span key={c.label}>{inner}</span>
          );
        })}
      </div>
    </div>
  );
}
