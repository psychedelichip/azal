import { ScrollArea } from "@/components/ui/scroll-area";
import { LEADERS, QUESTS } from "@/lib/mock";

function NumBadge({ n }: { n: string }) {
  return (
    <span
      className="inline-flex items-center justify-center text-gray-400 border border-gray-200 rounded-full shrink-0"
      style={{ width: 16, height: 16, fontSize: 10 }}
    >
      {n}
    </span>
  );
}

export function RewardsPage() {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="flex items-baseline gap-2 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Rewards</h2>
          <span className="text-sm text-gray-400">Season 3 · ends in 18 days</span>
        </div>

        {/* hero */}
        <div className="border border-gray-200 rounded-xl p-5 mb-5 flex">
          <div className="flex-1 pr-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-bold text-gray-900">Level 7</span>
                <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">Pro</span>
              </div>
              <span className="text-sm text-gray-400">2,550 XP to Level 8</span>
            </div>
            <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: 8, background: "#e5e7eb" }}>
              <div className="h-full" style={{ width: "78%", background: "#2563eb" }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">12,450 XP · XP doubles as your $AZAL balance</span>
              <span className="text-gray-400">Next level unlocks lower fees</span>
            </div>
          </div>
          <div className="border-l border-gray-200" />
          <div className="pl-6 flex flex-col items-end justify-center text-right" style={{ width: 260 }}>
            <div className="text-xs uppercase tracking-wider text-gray-400">Claimable now</div>
            <div className="text-3xl font-bold text-green-600 mt-1">$128.40</div>
            <div className="text-xs text-gray-400 mt-1">Next drop in 2 days · from fees + quests</div>
            <button className="mt-3 rounded-lg px-6 py-2 text-sm font-medium text-white bg-[#0b1220]">Claim</button>
          </div>
        </div>

        {/* two columns */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
          {/* quests */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">Quests &amp; Challenges <NumBadge n="2" /></div>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Earn XP →</button>
            </div>
            <div className="divide-y divide-gray-100">
              {QUESTS.map((q) => (
                <div key={q.id} className="py-3.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{q.title}</span>
                    <span className="text-sm font-medium text-blue-600">{q.xp}</span>
                  </div>
                  <div className={`text-xs mt-1 ${q.state === "claim" ? "text-green-600" : "text-gray-400"}`}>{q.sub}</div>
                  {q.state === "progress" && (
                    <div className="w-full rounded-full overflow-hidden mt-2" style={{ height: 6, background: "#e5e7eb" }}>
                      <div className="h-full" style={{ width: `${q.pct}%`, background: "#0b1220" }} />
                    </div>
                  )}
                  {q.state === "claim" && (
                    <button className="mt-2.5 rounded-md px-3 py-1.5 text-xs font-medium text-white bg-[#0b1220]">{q.claimLabel}</button>
                  )}
                  {q.state === "action" && (
                    <button className="mt-2.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">{q.actionLabel} →</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* right rail */}
          <div className="space-y-5">
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-4">Your stats <NumBadge n="1" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><div className="text-xs text-gray-400">Total claimed</div><div className="text-lg font-semibold text-gray-900 mt-0.5">$1,842</div></div>
                <div><div className="text-xs text-gray-400">Account age</div><div className="text-lg font-semibold text-gray-900 mt-0.5">94 days</div></div>
                <div><div className="text-xs text-gray-400">Rewards rate</div><div className="text-lg font-semibold text-gray-900 mt-0.5">0.8%</div></div>
              </div>
              <div className="text-xs text-gray-400 mt-3">Rate scales with level · partners earn a higher rate.</div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 mb-4">Referrals <NumBadge n="3" /></div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 min-w-0 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">azal.xyz/r/johndoe</div>
                <button className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 shrink-0">Copy</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><div className="text-lg font-semibold text-gray-900">14</div><div className="text-xs text-gray-400">Referred</div></div>
                <div><div className="text-lg font-semibold text-gray-900">$214</div><div className="text-xs text-gray-400">Earned</div></div>
                <div><div className="text-lg font-semibold text-gray-900">30/3/2%</div><div className="text-xs text-gray-400">Tier 1/2/3</div></div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">Leaderboard <NumBadge n="4" /></div>
                <span className="text-xs text-gray-400">Season 3</span>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1"><span>Your rank</span><span>Season XP</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">#1,284 <span className="text-green-600 font-medium">top 3%</span></span>
                  <span className="text-sm font-semibold text-gray-900">12,450</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {LEADERS.map((l) => (
                  <div key={l.rank} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-3">{l.rank}</span>
                    <span className="text-sm text-gray-900 flex-1">{l.user}</span>
                    <span className="text-sm font-medium text-gray-900">{l.xp}</span>
                  </div>
                ))}
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-3">View full leaderboard →</button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
