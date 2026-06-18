import { useEffect, useState } from "react";
import { Check, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FeaturedMarket } from "@/lib/mock";

const QUICK_AMOUNTS = [25, 50, 100];
const ORDER_TYPES = ["Market", "Limit"] as const;
const SLIPPAGE_OPTIONS = [0.5, 1, 2];

export function OrderTicket({ market, embedded = false }: { market: FeaturedMarket; embedded?: boolean }) {
  const [buySide, setBuySide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState(50);
  const [orderType, setOrderType] = useState<(typeof ORDER_TYPES)[number]>("Market");
  const [slippage, setSlippage] = useState(1);
  const [placed, setPlaced] = useState<string | null>(null);

  const price = buySide === "yes" ? market.yes : market.no;
  const shares = price > 0 ? Math.round(amount / (price / 100)) : 0;
  const payout = shares;
  const maxProfit = payout - amount;

  useEffect(() => {
    if (!placed) return;
    const t = setTimeout(() => setPlaced(null), 2500);
    return () => clearTimeout(t);
  }, [placed]);

  const placeOrder = () => {
    if (amount <= 0) return;
    setPlaced(`Order placed · ≈ ${shares} sh ${buySide === "yes" ? "Yes" : "No"} @ ${price}¢`);
  };

  return (
    <div className={embedded ? "" : "mx-5 my-4 border border-gray-200 rounded-xl p-4"}>
      {!embedded && (
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 mb-3"><Star className="w-3.5 h-3.5" /> Order ticket</div>
      )}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setBuySide("yes")}
          className={`rounded-lg py-2.5 text-sm font-medium border ${
            buySide === "yes" ? "border-gray-900 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Buy Yes · {market.yes}¢
        </button>
        <button
          onClick={() => setBuySide("no")}
          className={`rounded-lg py-2.5 text-sm font-medium border ${
            buySide === "no" ? "border-gray-900 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Buy No · {market.no}¢
        </button>
      </div>
      <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 mb-2">
        <span className="text-gray-400 text-sm">$</span>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          className="flex-1 h-auto mx-2 p-0 border-0 rounded-none text-lg md:text-lg text-gray-900 focus-visible:ring-0"
        />
        <span className="text-xs text-gray-400">Amount</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        {QUICK_AMOUNTS.map((v) => (
          <button key={v} onClick={() => setAmount(v)} className="text-xs border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50">${v}</button>
        ))}
        <button onClick={() => setAmount(1000)} className="text-xs border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50">Max</button>
      </div>
      <div className="space-y-1.5 text-sm mb-3">
        <div className="flex items-center justify-between"><span className="text-gray-500">Shares</span><span className="text-gray-900 font-medium">≈ {shares}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Avg price</span><span className="text-gray-900 font-medium">{price}¢</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Potential payout</span><span className="text-gray-900 font-medium">${payout}</span></div>
        <div className="flex items-center justify-between"><span className="text-gray-500">Max profit</span><span className={`font-medium ${maxProfit >= 0 ? "text-green-600" : "text-red-500"}`}>{maxProfit >= 0 ? "+" : "−"}${Math.abs(maxProfit)}</span></div>
      </div>
      <Button
        onClick={placeOrder}
        disabled={amount <= 0}
        className="w-full h-auto rounded-lg py-3 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
      >
        Place order
      </Button>
      {placed && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          <Check className="w-3.5 h-3.5 shrink-0" /> {placed}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between text-xs">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-gray-600 hover:bg-gray-50">
              Order: {orderType} <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32 rounded-lg border border-gray-200 shadow-lg ring-0 p-0 py-1">
            {ORDER_TYPES.map((o) => (
              <DropdownMenuItem
                key={o}
                onSelect={() => setOrderType(o)}
                className="rounded-none px-3 py-1.5 text-sm text-gray-700 focus:bg-gray-50 focus:text-gray-700 flex items-center justify-between"
              >
                {o} {orderType === o && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Slippage</span>
          {SLIPPAGE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSlippage(s)}
              className={`rounded-md border px-1.5 py-0.5 ${
                slippage === s ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
