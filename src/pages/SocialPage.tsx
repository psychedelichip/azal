import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Flame, Gem, Heart, MessageSquare, Radio, Repeat, Search, Share2, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/social/Avatar";
import { profilePath } from "@/components/profile/profile-data";
import { useShellContext } from "@/lib/shell-context";
import { FEED, FEED_TABS, FRIENDS, LIVE_STREAMS, TRADERS, WHO_TO_COPY, findTrader } from "@/lib/mock";
import type { FeedPost, HoldingSide, Trader } from "@/lib/mock";

const sideChip = (side: HoldingSide) =>
  `text-xs font-medium rounded px-1.5 py-0.5 border ${side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`;

/** Smart money = vetted traders, ranked by win rate. The "good traders" you copy. */
const SMART_MONEY = [...TRADERS].sort((a, b) => parseInt(b.win) - parseInt(a.win)).slice(0, 4);

/** The trade/success cards share the like / comment / repost / share engagement bar. */
type EngagementPost = Extract<FeedPost, { likes: number }>;

export function SocialPage() {
  const { following, copying, onOpenTrader, onFollow } = useShellContext();
  const [tab, setTab] = useState<(typeof FEED_TABS)[number]>("For You");

  const followBtn = (id: string) => (
    <button
      onClick={() => onFollow(id)}
      className={`text-xs font-medium rounded-md px-2.5 py-1.5 border ${following.includes(id) ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
    >
      {following.includes(id) ? "Following" : "Follow"}
    </button>
  );

  const copyBtn = (id: string) => (
    <button onClick={() => onOpenTrader(id, "copy")} className="text-xs font-medium text-white rounded-md px-2.5 py-1.5" style={{ background: "#0b1220" }}>
      {copying.includes(id) ? "Copying" : "Copy"}
    </button>
  );

  const engagement = (p: EngagementPost) => (
    <div className="mt-3">
      {p.topComment && (
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-medium text-gray-700">{p.topComment.user}</span> {p.topComment.text}
        </div>
      )}
      <div className="flex items-center gap-5 text-xs text-gray-400">
        <button className="flex items-center gap-1 hover:text-red-500"><Heart className="w-3.5 h-3.5" /> {p.likes}</button>
        <button className="flex items-center gap-1 hover:text-gray-900"><MessageSquare className="w-3.5 h-3.5" /> {p.comments}</button>
        <button className="flex items-center gap-1 hover:text-green-600"><Repeat className="w-3.5 h-3.5" /> {p.reposts}</button>
        <button className="flex items-center gap-1 hover:text-gray-900 ml-auto"><Share2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );

  const traderHeader = (tr: Trader) => (
    <div className="flex items-center gap-3">
      <Link to={profilePath(tr.name)} className="flex items-center gap-2.5 min-w-0 hover:opacity-80">
        <Avatar name={tr.name} hue={tr.hue} size={38} />
        <div className="min-w-0 text-left">
          <div className="text-sm font-semibold text-gray-900 truncate">{tr.name}</div>
          <div className="text-xs text-gray-400">{tr.monthly} this month · {tr.win} win</div>
        </div>
      </Link>
      <div className="flex-1" />
      {followBtn(tr.id)}
      {copyBtn(tr.id)}
    </div>
  );

  const feedBody = (p: FeedPost) => {
    switch (p.type) {
      case "trade": {
        const tr = findTrader(p.traderId);
        if (!tr) return null;
        return (
          <>
            {traderHeader(tr)}
            <div className="text-sm text-gray-700 mt-3">{p.caption}</div>
            <div className="mt-3 border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 flex items-center gap-3">
              <span className={sideChip(p.side)}>{p.side}</span>
              <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{p.market}</span>
              <span className="text-xs text-gray-400 shrink-0">{p.odds} · {p.size}</span>
              <span className={`text-sm font-medium shrink-0 ${p.pnl.startsWith("-") ? "text-red-600" : "text-green-600"}`}>{p.pnl}</span>
            </div>
            {engagement(p)}
          </>
        );
      }
      case "success": {
        const tr = findTrader(p.traderId);
        if (!tr) return null;
        return (
          <>
            {traderHeader(tr)}
            <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-3" style={{ background: "#f8fafc" }}>
              <div className="text-2xl font-bold text-green-600 shrink-0">{p.stat}</div>
              <div className="text-sm text-gray-600">{p.text}</div>
            </div>
            {engagement(p)}
          </>
        );
      }
      case "live": {
        const tr = findTrader(p.traderId);
        if (!tr) return null;
        return (
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar name={tr.name} hue={tr.hue} size={40} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-red-500" /><span className="text-xs font-medium text-red-500 uppercase tracking-wider">Live</span></div>
              <div className="text-sm font-semibold text-gray-900 truncate mt-0.5">{p.title}</div>
              <div className="text-xs text-gray-400">{tr.name} · {p.viewers} watching</div>
            </div>
            <button className="text-xs font-medium text-white rounded-md px-3 py-1.5 shrink-0" style={{ background: "#0b1220" }}>Join</button>
          </div>
        );
      }
      case "suggest": {
        const tr = findTrader(p.traderId);
        if (!tr) return null;
        return (
          <div className="flex items-center gap-3">
            <Link to={profilePath(tr.name)} className="flex items-center gap-2.5 min-w-0 hover:opacity-80">
              <Avatar name={tr.name} hue={tr.hue} size={40} />
              <div className="min-w-0 text-left">
                <div className="text-sm font-semibold text-gray-900 truncate">{tr.name}</div>
                <div className="text-xs text-gray-400">{tr.win} win · risk {tr.risk}/7 · {tr.roi} ROI</div>
              </div>
            </Link>
            <div className="flex-1" />
            {followBtn(tr.id)}
            {copyBtn(tr.id)}
          </div>
        );
      }
      case "whale":
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0"><Flame className="w-4 h-4 text-amber-600" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-gray-900">{p.text}</div>
              <div className="flex items-center gap-2 mt-1"><span className={sideChip(p.side)}>{p.side}</span><span className="text-xs text-gray-500 truncate">{p.market}</span></div>
            </div>
            <button className="text-xs font-medium rounded-md px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">View market</button>
          </div>
        );
      case "move":
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-blue-600" /></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-gray-900">{p.text}</div>
              <div className="flex items-center gap-2 mt-1"><span className={sideChip(p.side)}>{p.side}</span><span className="text-xs text-gray-500 truncate">{p.market}</span></div>
            </div>
            <span className="text-sm font-medium text-green-600 shrink-0">{p.delta}</span>
          </div>
        );
    }
  };

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-xl font-bold text-gray-900">Social</h2>
          <span className="text-sm text-gray-400">Tuned to what you trade and follow</span>
        </div>

        <div className="flex items-center gap-2 mt-4 mb-5">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search traders, wallets, users..."
              className="w-full h-auto bg-gray-50 border-gray-200 rounded-lg text-sm text-gray-700 pl-9 pr-3 py-2 focus:bg-white focus-visible:ring-0 focus-visible:border-gray-300"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 shrink-0">
            <Copy className="w-4 h-4 text-gray-400" /> Paste a wallet to copy
          </button>
        </div>

        {/* ZONE: Live tray */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900"><Radio className="w-4 h-4 text-red-500" /> Live now <span className="text-xs font-normal text-gray-400">· Curated</span></div>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {LIVE_STREAMS.map((l) => {
              const tr = findTrader(l.traderId);
              if (!tr) return null;
              return (
                <button key={l.id} className="shrink-0 text-left border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300" style={{ width: 168 }}>
                  <div className="relative flex items-center justify-center" style={{ height: 82, background: `linear-gradient(135deg, hsl(${tr.hue} 45% 30%), hsl(${tr.hue} 50% 18%))` }}>
                    <Avatar name={tr.name} hue={tr.hue} size={32} />
                    <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-xs font-medium text-white rounded px-1.5 py-0.5" style={{ background: "rgba(220,38,38,0.9)" }}><span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE</span>
                    <span className="absolute bottom-1.5 right-1.5 text-xs text-white rounded px-1.5 py-0.5" style={{ background: "rgba(0,0,0,0.5)" }}>{l.viewers}</span>
                  </div>
                  <div className="p-2"><div className="text-xs font-medium text-gray-900 truncate">{l.title}</div><div className="text-xs text-gray-400 truncate">{tr.name}</div></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ZONE: Smart money — vetted high-win-rate traders to copy */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <Gem className="w-4 h-4 text-blue-600" /> Smart money <span className="text-xs font-normal text-gray-400">· Vetted · high win rate</span>
            </div>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View all</button>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {SMART_MONEY.map((t) => (
              <div key={t.id} className="border border-gray-200 rounded-xl p-3.5 hover:border-gray-300">
                <div className="flex items-center gap-2.5">
                  <Link to={profilePath(t.name)} className="shrink-0 hover:opacity-80"><Avatar name={t.name} hue={t.hue} size={36} /></Link>
                  <div className="min-w-0">
                    <Link to={profilePath(t.name)} className="block text-sm font-semibold text-gray-900 truncate hover:opacity-80">{t.name}</Link>
                    <div className="text-xs text-gray-400 truncate">{t.tags.join(" · ")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <div className="text-base font-bold text-gray-900">{t.win}</div>
                    <div className="text-[11px] text-gray-400">win rate</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-green-600">{t.roi}</div>
                    <div className="text-[11px] text-gray-400">ROI</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-base font-bold text-gray-900">{t.risk}/7</div>
                    <div className="text-[11px] text-gray-400">risk</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {followBtn(t.id)}
                  <button onClick={() => onOpenTrader(t.id, "copy")} className="flex-1 text-xs font-medium text-white rounded-md px-2.5 py-1.5" style={{ background: "#0b1220" }}>
                    {copying.includes(t.id) ? "Copying" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN SPLIT */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
          {/* CENTER: composer + feed */}
          <div>
            <div className="border border-gray-200 rounded-xl p-3.5 mb-4">
              <div className="flex items-center gap-3">
                <Link to="/profile/me" className="shrink-0 hover:opacity-80"><Avatar name="John Doe" hue={220} size={36} /></Link>
                <input placeholder="Share a trade or a take..." className="flex-1 min-w-0 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400" />
                <button className="text-xs font-medium text-white rounded-md px-3 py-1.5 shrink-0" style={{ background: "#0b1220" }}>Share trade</button>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-gray-900"><Radio className="w-3.5 h-3.5 text-red-500" /> Go live</button>
                <button className="flex items-center gap-1.5 hover:text-gray-900"><TrendingUp className="w-3.5 h-3.5" /> Attach a position</button>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {FEED_TABS.map((x) => (
                <button key={x} onClick={() => setTab(x)} className={`text-sm rounded-md px-3 py-1.5 ${tab === x ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}>{x}</button>
              ))}
            </div>

            <div className="space-y-3">
              {FEED.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2.5"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> {p.reason}</div>
                  {feedBody(p)}
                </div>
              ))}
              <div className="text-center text-xs text-gray-400 py-3">You are all caught up</div>
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div className="space-y-5">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">Who to copy</div>
              <div className="space-y-3">
                {WHO_TO_COPY.map(({ id, reason }) => {
                  const t = findTrader(id);
                  if (!t) return null;
                  return (
                    <div key={id}>
                      <div className="flex items-center gap-2.5">
                        <Link to={profilePath(t.name)} className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80">
                          <Avatar name={t.name} hue={t.hue} size={30} />
                          <div className="min-w-0 text-left"><div className="text-sm text-gray-900 truncate">{t.name}</div><div className="text-xs text-green-600">{t.roi} ROI</div></div>
                        </Link>
                        {copyBtn(id)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1" style={{ marginLeft: 40 }}>{reason}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wider text-gray-400">Top traders</div>
                <div className="flex gap-1"><span className="text-xs text-gray-900 font-medium bg-gray-100 rounded px-1.5 py-0.5">ROI</span><span className="text-xs text-gray-400 rounded px-1.5 py-0.5">Win</span></div>
              </div>
              <div className="space-y-2.5">
                {TRADERS.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2.5">
                    <span className="text-xs text-gray-400 w-3 shrink-0">{i + 1}</span>
                    <Link to={profilePath(t.name)} className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80">
                      <Avatar name={t.name} hue={t.hue} size={26} />
                      <div className="min-w-0 text-left"><div className="text-sm text-gray-900 truncate">{t.name}</div><div className="text-xs text-gray-400">{t.win} win · risk {t.risk}/7</div></div>
                    </Link>
                    <span className="text-sm font-medium text-green-600 shrink-0">{t.roi}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3"><div className="text-xs uppercase tracking-wider text-gray-400">Messages</div><button className="text-xs font-medium text-blue-600 hover:text-blue-700">Open chat →</button></div>
              <div className="space-y-2">
                {FRIENDS.map((f, i) => (
                  <div key={f.name} className="flex items-center gap-2.5">
                    <Link to={profilePath(f.name)} className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80">
                      <div className="relative shrink-0"><Avatar name={f.name} hue={(i * 67) % 360} size={28} />{f.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}</div>
                      <span className="text-sm text-gray-900 truncate">{f.name}</span>
                    </Link>
                    <span className="text-xs text-gray-400">{f.online ? "online" : "offline"}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-3">DMs and friends live in the chat overlay.</div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
