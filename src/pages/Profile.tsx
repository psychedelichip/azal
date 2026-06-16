import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShellContext } from "@/lib/shell-context";
import { findTrader } from "@/lib/mock";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatStrip } from "@/components/profile/StatStrip";
import { EquityCurve } from "@/components/profile/EquityCurve";
import { CopiersChart } from "@/components/profile/CopiersChart";
import { PostsTab } from "@/components/profile/PostsTab";
import { TradesTab } from "@/components/profile/TradesTab";
import { PositionsTab } from "@/components/profile/PositionsTab";
import { PerformanceTab } from "@/components/profile/PerformanceTab";
import { TraderListTab } from "@/components/profile/TraderListTab";
import { CopyingTab } from "@/components/profile/CopyingTab";
import { getProfile } from "@/components/profile/profile-data";
import type { CopyRow, RoiRange } from "@/components/profile/profile-data";

type ProfileTab = "Posts" | "Trades" | "Positions" | "Performance" | "Following" | "Followers" | "Copying";

export function Profile() {
  const { handle } = useParams();
  const h = handle ?? "me";
  const profile = useMemo(() => getProfile(h), [h]);
  const { following, copying, onFollow, onOpenTrader } = useShellContext();
  const navigate = useNavigate();

  const [tab, setTab] = useState<ProfileTab>("Posts");
  const [range, setRange] = useState<RoiRange>("All");

  // Reset view state when the route handle changes (render-phase reset, the
  // pattern React endorses for "reset state on prop change" without an effect).
  const [prevHandle, setPrevHandle] = useState(h);
  if (h !== prevHandle) {
    setPrevHandle(h);
    setTab("Posts");
    setRange("All");
  }

  // Copy config lives in the Social trader drawer, which the shell only mounts on /social.
  // Route there first, then open the drawer once the route's render has committed
  // (two frames) so the shell's "close drawer when off /social" effect doesn't race it.
  const startCopy = (id: string) => {
    navigate("/social");
    requestAnimationFrame(() => requestAnimationFrame(() => onOpenTrader(id, "copy")));
  };

  const mergedCopying = useMemo<CopyRow[]>(() => {
    if (!profile?.isMe) return [];
    const extra = copying
      .filter((id) => !profile.copying.some((c) => c.traderId === id))
      .map((id) => {
        const t = findTrader(id);
        return {
          traderId: id,
          name: t ? t.name : id,
          hue: t ? t.hue : 210,
          allocation: "$12,500",
          mode: "proportional" as const,
          pnl: "+$0",
          up: true,
          status: "Active" as const,
        };
      });
    return [...profile.copying, ...extra];
  }, [profile, copying]);

  if (!profile) {
    return (
      <ScrollArea className="flex-1 min-h-0 bg-white">
        <div className="px-6 py-16 flex flex-col items-center text-center">
          <div className="text-lg font-semibold text-gray-900">Trader not found</div>
          <div className="text-sm text-gray-400 mt-1">No profile matches “{h}”.</div>
          <Link to="/social" className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-4">Back to Social →</Link>
        </div>
      </ScrollArea>
    );
  }

  const tabs: ProfileTab[] = profile.isMe
    ? ["Posts", "Trades", "Positions", "Performance", "Following", "Followers", "Copying"]
    : ["Posts", "Trades", "Positions", "Performance"];
  const activeTab = tabs.includes(tab) ? tab : "Posts";

  const isFollowing = profile.traderId ? following.includes(profile.traderId) : false;
  const isCopying = profile.traderId ? copying.includes(profile.traderId) : false;

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <ProfileHeader
          profile={profile}
          isFollowing={isFollowing}
          isCopying={isCopying}
          onFollow={() => profile.traderId && onFollow(profile.traderId)}
          onCopy={() => profile.traderId && startCopy(profile.traderId)}
          onShowFollowing={() => setTab("Following")}
          onShowFollowers={() => setTab("Followers")}
        />

        <StatStrip profile={profile} range={range} onRangeChange={setRange} />

        <div className="grid gap-5 mb-5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
          <EquityCurve series={profile.equity[range]} range={range} change={profile.roi[range]} />
          <CopiersChart monthly={profile.copiersMonthly} copiers={profile.copiers} started={profile.copiersStarted} stopped={profile.copiersStopped} />
        </div>

        <div className="flex items-center gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={activeTab === t}
              className={`text-sm whitespace-nowrap px-3 py-2.5 border-b-2 ${
                activeTab === t ? "border-gray-900 text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Posts" && <PostsTab profile={profile} />}
        {activeTab === "Trades" && <TradesTab profile={profile} />}
        {activeTab === "Positions" && <PositionsTab profile={profile} />}
        {activeTab === "Performance" && <PerformanceTab profile={profile} />}
        {activeTab === "Following" && (
          <TraderListTab traders={profile.followingList} following={following} copying={copying} onFollow={onFollow} onCopy={startCopy} emptyLabel="Not following anyone yet." />
        )}
        {activeTab === "Followers" && (
          <TraderListTab traders={profile.followersList} following={following} copying={copying} onFollow={onFollow} onCopy={startCopy} emptyLabel="No followers yet." />
        )}
        {activeTab === "Copying" && <CopyingTab rows={mergedCopying} onManage={startCopy} />}

        <div className="text-xs text-gray-400 mt-6">Past performance does not guarantee future results.</div>
      </div>
    </ScrollArea>
  );
}
