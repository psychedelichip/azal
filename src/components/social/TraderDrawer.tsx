import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, CircleStop, Info, LoaderCircle, Pause, Play, Wallet, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Avatar } from "@/components/social/Avatar";
import { profilePath } from "@/components/profile/profile-data";
import { COPY_BALANCE } from "@/lib/mock";
import type { CopyMode, Trader, TraderDrawerMode } from "@/lib/mock";
import {
  getCopy,
  pauseCopy,
  resumeCopy,
  startCopy,
  stopAndCloseAll,
  stopAndKeepAll,
  updateCopy,
  useCopyStore,
} from "@/lib/copy-store";
import type { CopyStatus } from "@/lib/copy-store";

interface TraderDrawerProps {
  trader: Trader;
  mode: TraderDrawerMode;
  onModeChange: (mode: TraderDrawerMode) => void;
  amount: number;
  onAmountChange: (amount: number) => void;
  copyMode: CopyMode;
  onCopyModeChange: (mode: CopyMode) => void;
  isFollowing: boolean;
  isCopying: boolean;
  onFollow: (id: string) => void;
  onConfirmCopy: () => void;
  onClose: () => void;
}

type Phase = "idle" | "confirming" | "copied" | "saved";

const STATS: Array<[label: string, key: "roi" | "win" | "drawdown" | "monthly", color: string]> = [
  ["ROI", "roi", "text-green-600"],
  ["Win", "win", ""],
  ["Drawdown", "drawdown", "text-red-500"],
  ["Monthly", "monthly", ""],
];

const MARKET_FILTERS = ["All", "Politics", "Crypto", "Econ", "Sports"];
const STOP_LOSS_PRESETS = [10, 15, 20, 25];
const ALLOC_STEPS = [-1000, -500, 500, 1000];

const clampAmount = (n: number) => Math.max(0, Math.min(COPY_BALANCE, Math.round(n)));

function statusPill(status: CopyStatus) {
  const base = "text-xs border rounded-full px-2 py-0.5";
  if (status === "Paused") return `${base} text-gray-500 border-gray-200 bg-gray-50`;
  if (status === "Pending Close") return `${base} text-amber-700 border-amber-200 bg-amber-50`;
  return `${base} text-green-700 border-green-200 bg-green-50`;
}

const chipCls = (active: boolean) =>
  `flex-1 text-xs rounded-md py-1.5 border ${active ? "border-gray-900 ring-1 ring-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`;

export function TraderDrawer({
  trader,
  mode,
  onModeChange,
  amount,
  onAmountChange,
  copyMode,
  onCopyModeChange,
  isFollowing,
  isCopying,
  onFollow,
  onConfirmCopy,
  onClose,
}: TraderDrawerProps) {
  const copyMap = useCopyStore();
  const config = copyMap.get(trader.id);
  const managing = isCopying || !!config;
  const status = config?.status;
  const paused = status === "Paused";
  const pendingClose = status === "Pending Close";

  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stopOpen, setStopOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Seed the editor from the stored config whenever the drawer (re)targets a trader.
  useEffect(() => {
    clearTimers();
    setPhase("idle");
    setStopOpen(false);
    const c = getCopy(trader.id);
    if (c) {
      onAmountChange(c.allocation);
      onCopyModeChange(c.mode);
      setStopLoss(c.stopLoss);
    } else {
      setStopLoss(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trader.id]);

  useEffect(() => () => clearTimers(), []);

  const inConfirmFlow = phase === "confirming" || phase === "copied";
  const showManage = managing && !inConfirmFlow;
  const delta = config ? amount - config.allocation : 0;
  const dirty =
    !!config && (amount !== config.allocation || copyMode !== config.mode || stopLoss !== config.stopLoss);

  const confirm = () => {
    if (amount <= 0 || phase !== "idle") return;
    setPhase("confirming");
    const t1 = setTimeout(() => {
      startCopy({ traderId: trader.id, allocation: amount, mode: copyMode, stopLoss, pnl: "+$0", up: true });
      setPhase("copied");
      const t2 = setTimeout(() => onConfirmCopy(), 750);
      timers.current.push(t2);
    }, 850);
    timers.current.push(t1);
  };

  const saveManage = () => {
    if (!dirty) return;
    updateCopy(trader.id, { allocation: amount, mode: copyMode, stopLoss });
    setPhase("saved");
    const t = setTimeout(() => setPhase("idle"), 1300);
    timers.current.push(t);
  };

  const chooseStop = (kind: "close" | "keep") => {
    if (kind === "close") stopAndCloseAll(trader.id);
    else stopAndKeepAll(trader.id);
    setStopOpen(false);
    onClose();
  };

  return (
    <Sheet open onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l border-gray-200 rounded-r-xl shadow-[-10px_0_30px_rgba(0,0,0,0.08)]"
        style={{ top: 16, right: 16, bottom: 16, width: 416, maxWidth: 416, height: "auto" }}
      >
        <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={trader.name} hue={trader.hue} size={34} />
            <div className="min-w-0">
              <SheetTitle className="text-sm font-semibold text-gray-900 truncate">{trader.name}</SheetTitle>
              <SheetDescription className="text-xs text-gray-400">{trader.copiers} copiers · risk {trader.risk}/7</SheetDescription>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button>
        </SheetHeader>

        <div className="grid grid-cols-4 border-b border-gray-200 shrink-0">
          {STATS.map(([label, key, color]) => (
            <div key={label} className="px-3 py-2.5 border-r border-gray-100 last:border-r-0">
              <div className="text-xs text-gray-400">{label}</div>
              <div className={`text-sm font-semibold ${color || "text-gray-900"}`}>{trader[key]}</div>
            </div>
          ))}
        </div>

        <Link
          to={profilePath(trader.name)}
          onClick={onClose}
          className="flex items-center justify-center gap-1 border-b border-gray-200 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
        >
          View full profile <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex gap-1 p-3 shrink-0">
          {(["overview", "copy"] as TraderDrawerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex-1 text-sm rounded-md py-1.5 capitalize ${mode === m ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}
            >
              {m === "copy" && managing ? "Manage" : m}
            </button>
          ))}
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 pb-4">
            {mode === "overview" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onFollow(trader.id)}
                    className={`flex-1 text-sm font-medium rounded-lg py-2 border ${isFollowing ? "text-gray-500 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <div className="flex gap-1">
                    {trader.tags.map((t) => <span key={t} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">{t}</span>)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Recent trades</div>
                  <div className="space-y-1.5">
                    {trader.recent.map((r, i) => (
                      <div key={i} className="flex items-center gap-2.5 border border-gray-100 rounded-lg px-3 py-2">
                        <span className={`text-xs font-medium rounded px-1.5 py-0.5 border ${r.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{r.side}</span>
                        <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{r.market}</span>
                        <span className={`text-sm font-medium ${r.pnl.startsWith("-") ? "text-red-600" : "text-green-600"}`}>{r.pnl}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-gray-500">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /> Stats include wins and losses. Past performance does not guarantee future results.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {showManage && status && (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                    <span className="text-xs text-gray-400">Status</span>
                    <span className={statusPill(status)}>{status}</span>
                  </div>
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Copy mode</div>
                  <div className="flex gap-1">
                    {(["proportional", "fixed"] as CopyMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => onCopyModeChange(m)}
                        className={`flex-1 text-sm rounded-md py-1.5 border capitalize ${copyMode === m ? "border-gray-900 ring-1 ring-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5">
                    {copyMode === "proportional" ? "Mirror their position sizes, scaled to your allocation." : "Same fixed amount on every trade they make."}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-gray-400">Allocation</span>
                    <button onClick={() => onAmountChange(COPY_BALANCE)} className="text-xs font-medium text-blue-600">Max ${COPY_BALANCE.toLocaleString()}</button>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 mb-2.5">
                    <span className="text-sm text-gray-400 mr-1">$</span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => onAmountChange(clampAmount(Number(e.target.value) || 0))}
                      className="flex-1 min-w-0 h-auto p-0 border-0 rounded-none text-sm md:text-sm text-gray-900 focus-visible:ring-0"
                    />
                  </div>
                  <Slider value={[amount]} onValueChange={([v]) => onAmountChange(v)} min={0} max={COPY_BALANCE} step={500} className="my-1" />
                  {showManage ? (
                    <>
                      <div className="flex gap-1.5 mt-2.5">
                        {ALLOC_STEPS.map((n) => (
                          <button key={n} onClick={() => onAmountChange(clampAmount(amount + n))} className="flex-1 text-xs border border-gray-200 rounded-md py-1.5 text-gray-600 hover:bg-gray-50">
                            {n > 0 ? `+$${n.toLocaleString()}` : `−$${Math.abs(n).toLocaleString()}`}
                          </button>
                        ))}
                      </div>
                      {delta !== 0 && (
                        <div className={`text-xs mt-2 ${delta > 0 ? "text-green-600" : "text-amber-600"}`}>
                          {delta > 0
                            ? `Adding $${delta.toLocaleString()} to this copy`
                            : `Withdrawing $${Math.abs(delta).toLocaleString()} from this copy`}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-1.5 mt-2.5">
                      {[0.25, 0.5, 1].map((f) => (
                        <button key={f} onClick={() => onAmountChange(Math.round(COPY_BALANCE * f))} className="flex-1 text-xs border border-gray-200 rounded-md py-1.5 text-gray-600 hover:bg-gray-50">{Math.round(f * 100)}%</button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-gray-400">Copy stop loss</span>
                    <span className="text-xs text-gray-400">{stopLoss === null ? "Off" : `−${stopLoss}%`}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setStopLoss(null)} className={chipCls(stopLoss === null)}>Off</button>
                    {STOP_LOSS_PRESETS.map((p) => (
                      <button key={p} onClick={() => setStopLoss(p)} className={chipCls(stopLoss === p)}>{p}%</button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5">
                    {stopLoss === null
                      ? "Off — this copy stays open through drawdowns."
                      : `Auto-closes this copy if it falls ${stopLoss}% from your allocation.`}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-xs text-gray-400 mb-1">Slippage guard</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">2%</div></div>
                  <div><div className="text-xs text-gray-400 mb-1">Max open positions</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900">10</div></div>
                  <div><div className="text-xs text-gray-400 mb-1">Take profit</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">Off</div></div>
                  <div><div className="text-xs text-gray-400 mb-1">Daily loss cap</div><div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">Off</div></div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Markets</div>
                  <div className="flex flex-wrap gap-1.5">
                    {MARKET_FILTERS.map((c, i) => (
                      <span key={c} className={`text-xs rounded-full px-2 py-1 border ${i === 0 ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-500"}`}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-gray-200 px-4 py-3">
          {mode === "overview" ? (
            <Button onClick={() => onModeChange("copy")} className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220]">
              {managing ? "Manage copy" : "Copy this trader"}
            </Button>
          ) : pendingClose ? (
            <Button disabled className="w-full h-auto rounded-lg py-2.5 text-sm font-medium bg-gray-100 text-gray-500 disabled:opacity-100">
              <LoaderCircle className="w-4 h-4 animate-spin" /> Closing this copy…
            </Button>
          ) : showManage ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => (paused ? resumeCopy(trader.id) : pauseCopy(trader.id))}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {paused ? <><Play className="w-4 h-4" /> Resume</> : <><Pause className="w-4 h-4" /> Pause</>}
                </button>
                <button
                  onClick={() => setStopOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg py-2 border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <CircleStop className="w-4 h-4" /> Stop
                </button>
              </div>
              <Button
                onClick={saveManage}
                disabled={phase !== "saved" && !dirty}
                className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
              >
                {phase === "saved" ? <><Check className="w-4 h-4" /> Saved</> : dirty ? "Update copy" : "No changes"}
              </Button>
            </div>
          ) : (
            <Button
              disabled={amount <= 0 || inConfirmFlow}
              onClick={confirm}
              className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
            >
              {phase === "confirming" ? (
                <><LoaderCircle className="w-4 h-4 animate-spin" /> Confirming…</>
              ) : phase === "copied" ? (
                <><Check className="w-4 h-4" /> Copying {trader.name}</>
              ) : amount <= 0 ? (
                "Set an allocation"
              ) : (
                `Copy ${trader.name} · $${amount.toLocaleString()}`
              )}
            </Button>
          )}
        </div>

        {stopOpen && (
          <div className="absolute inset-0 z-20 rounded-r-xl overflow-hidden">
            <button aria-label="Cancel" onClick={() => setStopOpen(false)} className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="text-sm font-semibold text-gray-900">Stop copying {trader.name}?</div>
              <div className="text-xs text-gray-400 mt-0.5 mb-3">Choose what happens to the positions this copy opened.</div>
              <button onClick={() => chooseStop("close")} className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 mb-2">
                <div className="flex items-center gap-2">
                  <CircleStop className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Stop &amp; close all</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Sell every copied position now. Funds return to your balance.</div>
              </button>
              <button onClick={() => chooseStop("keep")} className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">Stop &amp; keep all</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Move the copied positions to your portfolio and manage them yourself.</div>
              </button>
              <button onClick={() => setStopOpen(false)} className="w-full text-sm text-gray-500 hover:text-gray-900 py-2 mt-1">Cancel</button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
