import { useLocation } from "react-router-dom";
import {
  ArrowDownToLine,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Flame,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  PieChart,
  Search,
  Star,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PortfolioTab } from "@/lib/mock";

interface TopBarProps {
  editing: boolean;
  onToggleEdit: () => void;
  portfolioTab: PortfolioTab;
  onResetPortfolioTab: () => void;
}

function IconBtn({ icon: Icon, dot }: { icon: LucideIcon; dot?: boolean }) {
  return (
    <Button variant="ghost" size="icon" className="relative w-8 h-8 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700">
      <Icon className="w-4 h-4" />
      {dot && <span className="absolute w-2 h-2 rounded-full bg-red-500" style={{ top: 6, right: 7 }} />}
    </Button>
  );
}

export function TopBar({ editing, onToggleEdit, portfolioTab, onResetPortfolioTab }: TopBarProps) {
  const { toggleSidebar } = useSidebar();
  const { pathname } = useLocation();
  const page = pathname.replace("/", "") || "dashboard";

  return (
    <header className="flex items-center gap-2 px-3 border-b border-gray-200 bg-white overflow-hidden shrink-0" style={{ height: 56 }}>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        title="Collapse sidebar"
        className="w-8 h-8 rounded-md border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 shrink-0"
      >
        <PanelLeft className="w-4 h-4" />
      </Button>
      <div className="shrink-0" style={{ width: 1, height: 20, background: "#e5e7eb" }} />
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {page === "portfolio" ? (
          <>
            <PieChart className="w-4 h-4 text-gray-400 shrink-0" />
            <button onClick={onResetPortfolioTab} className="text-gray-500 hover:text-gray-900 shrink-0">Portfolio</button>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <span className="text-gray-900 font-medium truncate">{portfolioTab}</span>
          </>
        ) : page === "dashboard" ? (
          <>
            <Flame className="w-4 h-4 text-gray-400 shrink-0" />
            <button className="text-gray-500 hover:text-gray-900 shrink-0">Trending</button>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <span className="text-gray-900 font-medium truncate">Will BTC hit $150k by Jun 30?</span>
          </>
        ) : (
          <span className="text-gray-900 font-medium capitalize">{page}</span>
        )}
      </nav>
      <div className="flex-1 min-w-0">
        <div className="relative" style={{ maxWidth: 260 }}>
          <Search className="w-4 h-4 text-gray-400 absolute" style={{ left: 12, top: 9 }} />
          <Input
            placeholder="Search markets..."
            className="w-full h-auto bg-gray-50 border-gray-200 rounded-lg text-sm text-gray-700 pl-9 pr-8 py-2 focus:bg-white focus-visible:ring-0 focus-visible:border-gray-300"
          />
          <span className="absolute text-xs text-gray-400 border border-gray-200 rounded bg-white" style={{ right: 8, top: 7, padding: "1px 6px" }}>/</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600"><Wallet className="w-4 h-4 text-gray-400" /> 0×4..9F</span>
          <button className="px-1 py-2 border-l border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronDown className="w-4 h-4" /></button>
        </div>
        <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900"><CircleDollarSign className="w-4 h-4 text-blue-600" /> 0.001</span>
        <div className="flex items-center rounded-lg overflow-hidden bg-[#0b1220]">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-white"><ArrowDownToLine className="w-4 h-4" /> Deposit</button>
          <button className="px-1 py-2 text-white border-l border-[rgba(255,255,255,0.15)]"><ChevronDown className="w-4 h-4" /></button>
        </div>
        <IconBtn icon={Star} />
        <IconBtn icon={Bell} dot />
        {page === "dashboard" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleEdit}
            title="Edit layout"
            className={cn(
              "w-8 h-8 rounded-md",
              editing ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            )}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        <div className="flex items-center gap-1.5 pl-0.5">
          <div className="text-right leading-tight">
            <div className="text-sm text-gray-900 font-medium">John Doe</div>
            <div className="text-xs text-gray-400">Tier 1</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600" />
        </div>
        <IconBtn icon={MoreHorizontal} />
      </div>
    </header>
  );
}
