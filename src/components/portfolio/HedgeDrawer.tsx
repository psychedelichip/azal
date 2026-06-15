import { ArrowRight, Info, Shield, TrendingDown, X } from "lucide-react";
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
import type { HedgeCandidate, HedgePosition, HoldingSide } from "@/lib/mock";

interface HedgeDrawerProps {
  position: HedgePosition;
  candidate: HedgeCandidate;
  candidateIndex: number;
  amount: number;
  onAmountChange: (amount: number) => void;
  onPickCandidate: (index: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const parsePrice = (s: string) => parseFloat(s) / 100;
const corrBand = (c: number) => {
  const a = Math.abs(c);
  return a >= 0.66 ? "Strong" : a >= 0.4 ? "Moderate" : "Weak";
};
// positive correlation -> hedge by taking the opposite side; inverse -> same side
const hedgeSide = (side: HoldingSide, corr: number): HoldingSide => (corr >= 0 ? (side === "YES" ? "NO" : "YES") : side);
const pct = (n: number) => `${Math.round(n)}%`;

export function HedgeDrawer({
  position,
  candidate,
  candidateIndex,
  amount,
  onAmountChange,
  onPickCandidate,
  onConfirm,
  onClose,
}: HedgeDrawerProps) {
  const exp = position.exposureValue;
  const c = candidate.correlation;
  const eff = amount * Math.abs(c);
  const net = Math.max(0, exp - eff);
  const coverage = exp > 0 ? Math.min(1, eff / exp) : 0;
  const give = amount * parsePrice(candidate.price);
  const buy = hedgeSide(position.side, c);
  const markerPct = ((c + 1) / 2) * 100;
  const positive = c >= 0;

  return (
    <Sheet open onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l border-gray-200 rounded-r-xl shadow-[-10px_0_30px_rgba(0,0,0,0.08)]"
        style={{ top: 16, right: 16, bottom: 16, width: 416, maxWidth: 416, height: "auto" }}
      >
        {/* header */}
        <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <div>
              <SheetTitle className="text-sm font-semibold text-gray-900">Hedge position</SheetTitle>
              <SheetDescription className="text-xs text-gray-400">{position.name} · {position.side}</SheetDescription>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            {/* your position */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Your position</div>
              <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
                <span className={`text-xs font-medium rounded px-1.5 py-0.5 border ${position.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{position.side}</span>
                <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{position.name}</span>
                <span className="text-sm font-medium text-gray-900">{position.exposure}</span>
              </div>
            </div>

            {/* hedge market picker */}
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Hedge with</div>
              <div className="space-y-1.5">
                {position.candidates.map((r, j) => {
                  const sel = j === candidateIndex;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onPickCandidate(j)}
                      className={`w-full flex items-center gap-2.5 border rounded-lg px-3 py-2 text-left ${sel ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <span className={`text-xs rounded-full px-2 py-0.5 border shrink-0 ${r.relation === "Inverse" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>{r.relation}</span>
                      <span className="text-sm text-gray-900 flex-1 min-w-0 truncate">{r.market}</span>
                      <span className="text-sm font-medium text-gray-900">{r.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* correlation band (supporting context, no false precision) */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs uppercase tracking-wider text-gray-400">Correlation</span>
                <span className="text-xs font-medium text-gray-700">{corrBand(c)} · {positive ? "same direction" : "inverse"}</span>
              </div>
              <div className="relative" style={{ height: 8 }}>
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg,#16a34a 0%,#e5e7eb 50%,#d97706 100%)", opacity: 0.35 }} />
                <div className="absolute top-1/2 rounded-full border-2 border-white" style={{ left: `${markerPct}%`, width: 14, height: 14, transform: "translate(-50%,-50%)", background: positive ? "#d97706" : "#16a34a", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5"><span>Inverse</span><span>Independent</span><span>Same</span></div>
              <div className="flex items-start gap-1.5 mt-2.5 text-xs text-gray-500">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                <span>{positive ? "These move together, so a straight bet would add risk. Hedge by taking the opposite side." : "These move opposite, a natural hedge. Take the same side as your thesis."} Estimated, not a guarantee.</span>
              </div>
            </div>

            {/* derived action */}
            <div className="rounded-lg px-3 py-2.5 flex items-center gap-2.5 bg-[#0b1220]">
              <span className={`text-xs font-semibold rounded px-1.5 py-0.5 ${buy === "YES" ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"}`}>BUY {buy}</span>
              <span className="text-sm text-white flex-1 min-w-0 truncate">{candidate.market}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400">Amount to hedge</span>
                <button onClick={() => onAmountChange(exp)} className="text-xs font-medium text-blue-600 hover:text-blue-700">Max {position.exposure}</button>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 mb-2.5">
                <span className="text-sm text-gray-400 mr-1">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => onAmountChange(Math.max(0, Math.min(exp, Number(e.target.value) || 0)))}
                  className="flex-1 min-w-0 h-auto p-0 border-0 rounded-none text-sm md:text-sm text-gray-900 focus-visible:ring-0"
                />
              </div>
              <Slider
                value={[amount]}
                onValueChange={([v]) => onAmountChange(v)}
                min={0}
                max={exp}
                step={100}
                className="my-1"
              />
              <div className="flex gap-1.5 mt-2.5">
                {[0.25, 0.5, 1].map((f) => (
                  <button
                    key={f}
                    onClick={() => onAmountChange(Math.round(exp * f))}
                    className="flex-1 text-xs border border-gray-200 rounded-md py-1.5 text-gray-600 hover:bg-gray-50"
                  >
                    {pct(f * 100)}
                  </button>
                ))}
              </div>
            </div>

            {/* payoff hero: risk before vs after */}
            <div className="rounded-xl border border-gray-200 p-3.5 bg-[#f8fafc]">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-400 mb-3"><TrendingDown className="w-3.5 h-3.5" /> If it resolves against you</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1"><div className="text-xs text-gray-400">Risk now</div><div className="text-lg font-semibold text-gray-900">−{money(exp)}</div></div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex-1"><div className="text-xs text-gray-400">After hedge</div><div className="text-lg font-semibold text-green-600">−{money(net)}</div></div>
              </div>
              <div className="flex w-full rounded-full overflow-hidden mb-1.5" style={{ height: 8, background: "#e5e7eb" }}>
                <div style={{ width: `${coverage * 100}%`, background: "#16a34a" }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Covers {pct(coverage * 100)} of exposure</span>
                <span className="text-gray-400">Upside given up if you win ≈ {money(give)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* footer CTA */}
        <div className="shrink-0 border-t border-gray-200 px-4 py-3">
          <Button
            disabled={amount <= 0}
            onClick={onConfirm}
            className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
          >
            {amount <= 0 ? "Enter an amount" : `Hedge ${money(amount)} · covers ${pct(coverage * 100)}`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
