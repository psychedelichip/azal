import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Flame, Gift, Globe, LayoutGrid, Settings, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useWalletBook } from "@/lib/wallet-store";
import type { WalletBook } from "@/lib/wallet-store";
import { LIVE_MARKETS, TRENDING_TOPICS } from "@/lib/mock";

// Compact active-scope label for the Portfolio item (wallet name or group name; "All" when unscoped).
function compactScope(book: WalletBook): string {
  const { active, wallets, groups } = book;
  if (!active) return "All";
  if (active.kind === "wallet") return wallets.find((w) => w.id === active.id)?.label ?? "";
  return groups.find((g) => g.id === active.id)?.name ?? "";
}

interface SubItemProps {
  label: string;
  live?: boolean;
  active: boolean;
  onSelect: () => void;
}

function SubItem({ label, live, active, onSelect }: SubItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left pl-4 pr-2 py-1.5 text-sm rounded-md ${
        active ? "text-blue-700 font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {active && (
        <span style={{ position: "absolute", left: -1, top: 7, bottom: 7, width: 2, background: "#2563eb", borderRadius: 2 }} />
      )}
      <span className="flex items-center gap-2">
        {live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />}
        {label}
      </span>
    </button>
  );
}

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  trailing?: ReactNode;
}

function MenuItem({ icon: Icon, label, active, onClick, trailing }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm ${
        active ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
      {trailing && <span className="ml-auto min-w-0 shrink-0">{trailing}</span>}
    </button>
  );
}

function RailIcon({ icon: Icon, accent, onClick }: { icon: LucideIcon; accent?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 ${accent ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function CategoryGroup({
  trigger,
  children,
}: {
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="group/section w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-900">
        {trigger}
        <ChevronDown className="w-4 h-4 ml-auto text-gray-400 transition-transform group-data-[state=closed]/section:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-5 border-l border-gray-200 mt-0.5 mb-2 pl-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const railMode = state === "collapsed" && !isMobile;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";
  const [activeItem, setActiveItem] = useState("China");
  const scopeLabel = compactScope(useWalletBook());

  const selectCategory = (label: string) => {
    setActiveItem(label);
    navigate("/dashboard");
  };

  return (
    <Sidebar collapsible="icon" className="border-gray-200">
      {railMode ? (
        <div className="flex h-full flex-col items-center py-3">
          <div className="w-7 h-7 rounded-md bg-blue-600 mb-4" />
          <div className="flex flex-col items-center gap-1">
            <RailIcon icon={Flame} accent onClick={() => navigate("/dashboard")} />
            <button onClick={() => navigate("/dashboard")} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            </button>
          </div>
          <div className="w-6 border-t border-gray-200 my-3" />
          <div className="flex flex-col items-center gap-1">
            <RailIcon icon={LayoutGrid} onClick={() => navigate("/portfolio")} />
            <RailIcon icon={Share2} onClick={() => navigate("/social")} />
            <RailIcon icon={Gift} onClick={() => navigate("/rewards")} />
            <button
              disabled
              title="Worldview · Coming soon"
              className="w-9 h-9 flex items-center justify-center rounded-md text-gray-300 cursor-not-allowed"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-auto">
            <RailIcon icon={Settings} />
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center gap-2 px-4 border-b border-gray-100" style={{ height: 56 }}>
            <div className="w-5 h-5 rounded bg-blue-600" />
            <span className="font-semibold text-gray-900">Azal</span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-3">
            <div className="px-2 mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Categories</div>

            <CategoryGroup
              trigger={
                <>
                  <Flame className="w-4 h-4 text-blue-600" /> Trending
                </>
              }
            >
              {TRENDING_TOPICS.map((label) => (
                <SubItem key={label} label={label} active={isDashboard && activeItem === label} onSelect={() => selectCategory(label)} />
              ))}
            </CategoryGroup>

            <CategoryGroup
              trigger={
                <>
                  <span className="w-4 h-4 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  </span>
                  Live <span className="text-xs text-gray-400 font-normal">{LIVE_MARKETS.length}</span>
                </>
              }
            >
              {LIVE_MARKETS.map((label) => (
                <SubItem key={label} label={label} live active={isDashboard && activeItem === label} onSelect={() => selectCategory(label)} />
              ))}
            </CategoryGroup>

            <div className="px-2 mt-4 mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">Menu</div>
            <MenuItem
              icon={LayoutGrid}
              label="Portfolio"
              active={pathname === "/portfolio"}
              onClick={() => navigate("/portfolio")}
              trailing={
                scopeLabel && (
                  <span className="text-[10px] text-gray-400 truncate max-w-[84px]" title={`Tracking ${scopeLabel}`}>
                    {scopeLabel}
                  </span>
                )
              }
            />
            <MenuItem icon={Share2} label="Social" active={pathname === "/social"} onClick={() => navigate("/social")} />
            <MenuItem icon={Gift} label="Rewards" active={pathname === "/rewards"} onClick={() => navigate("/rewards")} />
            <button
              disabled
              title="Worldview · Coming soon"
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-gray-400 cursor-not-allowed"
            >
              <Globe className="w-4 h-4" /> Worldview
              <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                Soon
              </span>
            </button>
          </div>
          <div className="shrink-0 border-t border-gray-100 px-3 py-2.5 flex items-center">
            <button className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
