import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FeaturedMarket } from "@/lib/mock";

const QUICK_AMOUNTS = [25, 50, 100];

export function OrderTicket({ market }: { market: FeaturedMarket }) {
  const [buySide, setBuySide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState(50);

  const price = buySide === "yes" ? market.yes : market.no;
  const shares = price > 0 ? Math.round(amount / (price / 100)) : 0;
  const payout = shares;
  const maxProfit = payout - amount;

  return (
    <div className="mx-5 my-4 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 mb-3"><Star className="w-3.5 h-3.5" /> Order ticket</div>
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
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
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
        <div className="flex items-center justify-between"><span className="text-gray-500">Max profit</span><span className="text-green-600 font-medium">+${maxProfit}</span></div>
      </div>
      <Button className="w-full h-auto rounded-lg py-3 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220]">Place order</Button>
      <div className="text-xs text-gray-400 mt-2">Order type: Market · Slippage: 1%</div>
    </div>
  );
}
