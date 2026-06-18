import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketsColumn } from "@/components/MarketsColumn";
import { MarketDetail } from "@/components/dashboard/MarketDetail";
import { TradeDrawer } from "@/components/dashboard/TradeDrawer";
import { IntelDrawer } from "@/components/dashboard/IntelDrawer";
import { RightRail } from "@/components/RightRail";
import { PositionsDock } from "@/components/PositionsDock";
import { useShellContext } from "@/lib/shell-context";
import { FEATURED_MARKETS } from "@/lib/mock";

export function DashboardPage() {
  const { editing, slotWidget, setSlotWidget } = useShellContext();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [intelId, setIntelId] = useState<string | null>(null);

  const total = FEATURED_MARKETS.length;
  const selected = FEATURED_MARKETS[selectedIndex];

  const selectByMarketId = (marketId: string) => {
    const i = FEATURED_MARKETS.findIndex((m) => m.marketId === marketId);
    if (i >= 0) setSelectedIndex(i);
  };

  const openIntel = (id?: string) => {
    setIntelId(id ?? null);
    setIntelOpen(true);
  };

  return (
    <div className="relative flex-1 flex min-w-0 min-h-0">
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
      <RightRail editing={editing} slotWidget={slotWidget} onRemoveWidget={() => setSlotWidget(null)} onOpenIntel={openIntel} />
      <PositionsDock />
      <TradeDrawer open={tradeOpen} market={selected} onClose={() => setTradeOpen(false)} />
      <IntelDrawer
        open={intelOpen}
        initialId={intelId}
        onClose={() => setIntelOpen(false)}
        onSelectMarket={(mid) => { selectByMarketId(mid); setIntelOpen(false); }}
        onTrade={(mid) => { selectByMarketId(mid); setIntelOpen(false); setTradeOpen(true); }}
        onHedge={() => { setIntelOpen(false); navigate("/portfolio"); }}
      />
    </div>
  );
}
