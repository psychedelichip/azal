import { ArrowDown, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QUESTS } from "@/lib/mock";

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="shrink-0">
      <div className="text-[11px] text-gray-400 whitespace-nowrap">{label}</div>
      <div className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">{value}</div>
    </div>
  );
}

function Move({ n }: { n: number }) {
  if (n === 0) return <span className="text-[11px] text-gray-400">—</span>;
  const up = n > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-green-600" : "text-red-600"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(n)}
    </span>
  );
}

/* ---- local mock (referee breakdown + contiguous leaderboard window) ---- */
interface Referee {
  handle: string;
  anon?: boolean;
  joined: string;
  volume: string;
  feeShare: string;
}

const REFEREES: Referee[] = [
  { handle: "@coldbrew", joined: "May 28", volume: "$42.1k", feeShare: "$84.20" },
  { handle: "Anon", anon: true, joined: "May 12", volume: "$18.6k", feeShare: "$37.20" },
  { handle: "@sol_maxi", joined: "Apr 30", volume: "$22.4k", feeShare: "$44.80" },
  { handle: "@quietquant", joined: "Apr 9", volume: "$9.8k", feeShare: "$19.60" },
  { handle: "Anon", anon: true, joined: "Mar 22", volume: "$5.2k", feeShare: "$10.40" },
];

interface LbRow {
  rank: number;
  user: string;
  xp: number;
  move: number;
  you?: boolean;
}

// Window of ranks around the user — the chase targets, not a static top-3.
const LEADERBOARD: LbRow[] = [
  { rank: 1281, user: "@vol_harvester", xp: 12980, move: 2 },
  { rank: 1282, user: "@chainsaw", xp: 12790, move: -1 },
  { rank: 1283, user: "@nadia.eth", xp: 12610, move: 5 },
  { rank: 1284, user: "You", xp: 12450, move: 12, you: true },
  { rank: 1285, user: "@fade_king", xp: 12280, move: -3 },
  { rank: 1286, user: "@orderflow", xp: 12090, move: 1 },
  { rank: 1287, user: "@degen_dao", xp: 11870, move: -7 },
];

const REF_COLS = "1.3fr 0.9fr 1fr 1fr";

export function RewardsPage() {
  const youIndex = LEADERBOARD.findIndex((r) => r.you);
  const you = LEADERBOARD[youIndex];
  const nextAbove = LEADERBOARD[youIndex - 1];
  const xpToPass = nextAbove.xp - you.xp;
  const spotsToTop = you.rank - 1000;

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-4">
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-xl font-bold text-gray-900">Rewards</h2>
          <span className="text-sm text-gray-400">Season 3 · ends in 18 days</span>
        </div>

        {/* compact header strip: level + xp + claimable + stats, one tight band */}
        <div className="border border-gray-200 rounded-xl flex items-stretch divide-x divide-gray-200 mb-4">
          <div className="flex items-center gap-4 px-4 py-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-bold text-gray-900">Level 7</span>
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">Pro</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-gray-500">{you.xp.toLocaleString()} XP</span>
                <span className="text-gray-400">Level 8</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: "#e5e7eb" }}>
                <div className="h-full" style={{ width: "78%", background: "#2563eb" }} />
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                You're <span className="font-medium text-gray-700">2,550 XP</span> from lower fees
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 shrink-0">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Claimable</div>
              <div className="text-xl font-bold text-green-600 leading-tight">$128.40</div>
              <div className="text-[11px] text-gray-400">Next drop 2d · fees + quests</div>
            </div>
            <button className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#0b1220]">Claim</button>
          </div>

          <div className="hidden lg:flex items-center gap-5 px-4 py-3 shrink-0">
            <Stat label="Total claimed" value="$1,842" />
            <Stat label="Account age" value="94d" />
            <Stat label="Rewards rate" value="0.8%" />
          </div>
        </div>

        {/* two columns: quests | leaderboard */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
          {/* quests (largely as-is) */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400">Quests &amp; Challenges <NumBadge n="1" /></div>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Earn XP →</button>
            </div>
            <div className="divide-y divide-gray-100">
              {QUESTS.map((q) => (
                <div key={q.id} className="py-3 first:pt-0">
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

          {/* leaderboard — competitive + personal */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400">Leaderboard <NumBadge n="2" /></div>
              <span className="text-[11px] text-gray-400">Season 3</span>
            </div>

            {/* your rank hero */}
            <div className="rounded-lg bg-[#0b1220] text-white px-3 py-2.5 mb-3">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/50">Your rank</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-bold leading-none">#{you.rank.toLocaleString()}</span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-green-400">
                      <ArrowUp className="w-3 h-3" />{you.move} this week
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-white/50">Season XP</div>
                  <div className="text-lg font-semibold leading-tight">{you.xp.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-[11px] text-white/70 mt-1.5">top 3% · {spotsToTop} spots to the top 1,000</div>
            </div>

            {/* chase window */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {LEADERBOARD.map((r, i) => {
                const isTarget = r.rank === nextAbove.rank;
                return (
                  <div
                    key={r.rank}
                    className={`flex items-center gap-2 px-3 py-2 text-sm ${i > 0 ? "border-t border-gray-100" : ""} ${r.you ? "bg-blue-50/70" : "bg-white"}`}
                  >
                    <span className={`w-14 text-xs tabular-nums shrink-0 ${r.you ? "font-semibold text-gray-900" : "text-gray-400"}`}>#{r.rank.toLocaleString()}</span>
                    <span className={`flex-1 min-w-0 truncate ${r.you ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {r.you ? "You" : r.user}
                      {isTarget && <span className="ml-2 text-[11px] font-medium text-blue-600">+{xpToPass} XP to pass</span>}
                    </span>
                    <span className={`tabular-nums shrink-0 ${r.you ? "font-semibold text-gray-900" : "text-gray-600"}`}>{r.xp.toLocaleString()}</span>
                    <span className="w-10 text-right shrink-0"><Move n={r.move} /></span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-gray-500">
                Pass <span className="font-medium text-gray-700">{nextAbove.user}</span> to climb · <span className="font-medium text-gray-700">{spotsToTop} more</span> to break the top 1,000
              </span>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0">Full board →</button>
            </div>
          </div>
        </div>

        {/* referrals — summary + referee breakdown table */}
        <div className="border border-gray-200 rounded-xl p-4 mt-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400">Referrals <NumBadge n="3" /></div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="border border-dashed border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-600 truncate">azal.xyz/r/johndoe</div>
              <button className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50 shrink-0">Copy</button>
            </div>
          </div>

          {/* summary stats */}
          <div className="grid grid-cols-4 gap-3 pb-3 mb-3 border-b border-gray-100">
            <div><div className="text-lg font-semibold text-gray-900">14</div><div className="text-[11px] text-gray-400">Referred</div></div>
            <div><div className="text-lg font-semibold text-gray-900">$214</div><div className="text-[11px] text-gray-400">Lifetime earned</div></div>
            <div><div className="text-lg font-semibold text-green-600">$58</div><div className="text-[11px] text-gray-400">This month</div></div>
            <div><div className="text-lg font-semibold text-gray-900">30/3/2%</div><div className="text-[11px] text-gray-400">Tier 1/2/3 fee share</div></div>
          </div>

          {/* referee breakdown */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="grid items-center px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400"
              style={{ gridTemplateColumns: REF_COLS }}
            >
              <span>Referee</span>
              <span>Joined</span>
              <span className="text-right">Their volume</span>
              <span className="text-right">Your fee share</span>
            </div>
            {REFEREES.map((r, i) => (
              <div
                key={i}
                className={`grid items-center px-3 py-2 text-sm ${i > 0 ? "border-t border-gray-100" : ""}`}
                style={{ gridTemplateColumns: REF_COLS }}
              >
                <span className={`truncate ${r.anon ? "text-gray-400 italic" : "text-gray-900 font-medium"}`}>{r.handle}</span>
                <span className="text-xs text-gray-500">{r.joined}</span>
                <span className="text-right tabular-nums text-gray-600">{r.volume}</span>
                <span className="text-right tabular-nums font-medium text-green-600">{r.feeShare}</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">You earn a fee share every time a referee trades — tier rate scales with your level.</div>
        </div>
      </div>
    </ScrollArea>
  );
}
