import { MarketsColumn } from "@/components/MarketsColumn";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { RightRail } from "@/components/RightRail";
import { useShellContext } from "@/lib/shell-context";

export function DashboardPage() {
  const { editing, slotWidget, setSlotWidget } = useShellContext();

  return (
    <div className="flex-1 flex min-w-0 min-h-0">
      <MarketsColumn editing={editing} />
      <FeaturedCarousel editing={editing} />
      <RightRail editing={editing} slotWidget={slotWidget} onRemoveWidget={() => setSlotWidget(null)} />
    </div>
  );
}
