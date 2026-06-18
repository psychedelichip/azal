import { useState } from "react";
import { MarketsColumn } from "@/components/MarketsColumn";
import { MarketDetail } from "@/components/dashboard/MarketDetail";
import { TradeDrawer } from "@/components/dashboard/TradeDrawer";
import { RightRail } from "@/components/RightRail";
import { useShellContext } from "@/lib/shell-context";
import { FEATURED_MARKETS } from "@/lib/mock";

export function DashboardPage() {
  const { editing, slotWidget, setSlotWidget } = useShellContext();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tradeOpen, setTradeOpen] = useState(false);

  const total = FEATURED_MARKETS.length;
  const selected = FEATURED_MARKETS[selectedIndex];

  const selectByMarketId = (marketId: string) => {
    const i = FEATURED_MARKETS.findIndex((m) => m.marketId === marketId);
    if (i >= 0) setSelectedIndex(i);
  };

  return (
    <div className="flex-1 flex min-w-0 min-h-0">
      <MarketsColumn editing={editing} onSelectMarket={selectByMarketId} selectedMarketId={selected.marketId} />
      <MarketDetail
        editing={editing}
        market={selected}
        index={selectedIndex}
        total={total}
        onPrev={() => setSelectedIndex((selectedIndex - 1 + total) % total)}
        onNext={() => setSelectedIndex((selectedIndex + 1) % total)}
        onSelectIndex={setSelectedIndex}
        onTrade={() => setTradeOpen(true)}
      />
      <RightRail editing={editing} slotWidget={slotWidget} onRemoveWidget={() => setSlotWidget(null)} />
      <TradeDrawer open={tradeOpen} market={selected} onClose={() => setTradeOpen(false)} />
    </div>
  );
}
