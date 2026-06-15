import { useOutletContext } from "react-router-dom";
import type { HedgeSelection, PortfolioTab, TraderDrawerMode, WidgetKey } from "@/lib/mock";

/** State owned by the Shell layout and shared with routed pages via <Outlet context>. */
export interface ShellContext {
  editing: boolean;
  slotWidget: WidgetKey | null;
  setSlotWidget: (widget: WidgetKey | null) => void;
  portfolioTab: PortfolioTab;
  setPortfolioTab: (tab: PortfolioTab) => void;
  /** Hedge drawer state (Portfolio · Hedging). */
  hedge: HedgeSelection | null;
  hedged: string[];
  openHedge: (positionIndex: number, candidateIndex: number) => void;
  /** Social copy-trading state (Social · trader drawer). */
  following: string[];
  copying: string[];
  onFollow: (traderId: string) => void;
  onOpenTrader: (traderId: string, mode: TraderDrawerMode) => void;
}

export function useShellContext() {
  return useOutletContext<ShellContext>();
}
