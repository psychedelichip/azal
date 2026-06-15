import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { StatusBar } from "@/components/StatusBar";
import { WidgetEditor } from "@/components/WidgetEditor";
import { HedgeDrawer } from "@/components/portfolio/HedgeDrawer";
import { TraderDrawer } from "@/components/social/TraderDrawer";
import type { ShellContext } from "@/lib/shell-context";
import { HEDGE_POSITIONS, findTrader } from "@/lib/mock";
import type { CopyMode, HedgeSelection, PortfolioTab, TraderDrawerMode, TraderSelection, WidgetKey } from "@/lib/mock";

/**
 * The single app shell: one Sidebar + one TopBar + StatusBar around a routed page (<Outlet>).
 * Edit mode and the widget editor are Dashboard-only; leaving the Dashboard exits edit mode.
 */
export function Shell() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";
  const isPortfolio = pathname === "/portfolio";
  const isSocial = pathname === "/social";

  const [editing, setEditing] = useState(false);
  const [slotWidget, setSlotWidget] = useState<WidgetKey | null>(null);
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("Overview");

  const [hedge, setHedge] = useState<HedgeSelection | null>(null);
  const [hedgeAmount, setHedgeAmount] = useState(0);
  const [hedged, setHedged] = useState<string[]>([]);

  const [trader, setTrader] = useState<TraderSelection | null>(null);
  const [copyAmount, setCopyAmount] = useState(0);
  const [copyMode, setCopyMode] = useState<CopyMode>("proportional");
  const [following, setFollowing] = useState<string[]>([]);
  const [copying, setCopying] = useState<string[]>([]);

  const openHedge = (pi: number, ri: number) => {
    setHedge({ pi, ri });
    setHedgeAmount(Math.round(HEDGE_POSITIONS[pi].exposureValue * 0.5));
  };
  const confirmHedge = () => {
    if (hedge) {
      const key = `${hedge.pi}-${hedge.ri}`;
      setHedged((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }
    setHedge(null);
  };

  const openTrader = (id: string, mode: TraderDrawerMode) => {
    setTrader({ id, mode });
    if (mode === "copy" && copyAmount === 0) setCopyAmount(12500);
  };
  const setTraderMode = (mode: TraderDrawerMode) => {
    setTrader((prev) => (prev ? { ...prev, mode } : prev));
    if (mode === "copy" && copyAmount === 0) setCopyAmount(12500);
  };
  const toggleFollow = (id: string) =>
    setFollowing((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const confirmCopy = () => {
    if (trader) setCopying((prev) => (prev.includes(trader.id) ? prev : [...prev, trader.id]));
    setTrader(null);
  };

  useEffect(() => {
    if (!isDashboard && editing) setEditing(false);
  }, [isDashboard, editing]);

  useEffect(() => {
    if (!isPortfolio && hedge) setHedge(null);
  }, [isPortfolio, hedge]);

  useEffect(() => {
    if (!isSocial && trader) setTrader(null);
  }, [isSocial, trader]);

  const editActive = editing && isDashboard;
  const activeTrader = trader ? findTrader(trader.id) : undefined;
  const context: ShellContext = {
    editing: editActive,
    slotWidget,
    setSlotWidget,
    portfolioTab,
    setPortfolioTab,
    hedge,
    hedged,
    openHedge,
    following,
    copying,
    onFollow: toggleFollow,
    onOpenTrader: openTrader,
  };

  return (
    <div className="h-dvh w-full bg-gray-100 p-4">
      <div className="relative flex h-full w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SidebarProvider
          className="relative h-full min-h-0 w-full"
          style={{ "--sidebar-width": "15rem", "--sidebar-width-icon": "4rem" } as CSSProperties}
        >
          <AppSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <TopBar
              editing={editActive}
              onToggleEdit={() => setEditing((prev) => !prev)}
              portfolioTab={portfolioTab}
              onResetPortfolioTab={() => setPortfolioTab("Overview")}
            />

            <Outlet context={context} />

            <StatusBar />
          </div>

          <WidgetEditor
            open={editActive}
            onClose={() => setEditing(false)}
            slotWidget={slotWidget}
            onAddWidget={setSlotWidget}
          />

          {hedge && (
            <HedgeDrawer
              position={HEDGE_POSITIONS[hedge.pi]}
              candidate={HEDGE_POSITIONS[hedge.pi].candidates[hedge.ri]}
              candidateIndex={hedge.ri}
              amount={hedgeAmount}
              onAmountChange={setHedgeAmount}
              onPickCandidate={(j) => setHedge({ pi: hedge.pi, ri: j })}
              onConfirm={confirmHedge}
              onClose={() => setHedge(null)}
            />
          )}

          {trader && activeTrader && (
            <TraderDrawer
              trader={activeTrader}
              mode={trader.mode}
              onModeChange={setTraderMode}
              amount={copyAmount}
              onAmountChange={setCopyAmount}
              copyMode={copyMode}
              onCopyModeChange={setCopyMode}
              isFollowing={following.includes(trader.id)}
              isCopying={copying.includes(trader.id)}
              onFollow={toggleFollow}
              onConfirmCopy={confirmCopy}
              onClose={() => setTrader(null)}
            />
          )}
        </SidebarProvider>
      </div>
    </div>
  );
}
