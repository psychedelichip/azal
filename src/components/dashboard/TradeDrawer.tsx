import { Star, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderTicket } from "@/components/OrderTicket";
import type { FeaturedMarket } from "@/lib/mock";

interface TradeDrawerProps {
  open: boolean;
  market: FeaturedMarket;
  onClose: () => void;
}

export function TradeDrawer({ open, market, onClose }: TradeDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l border-gray-200 rounded-r-xl shadow-[-10px_0_30px_rgba(0,0,0,0.08)]"
        style={{ top: 16, right: 16, bottom: 16, width: 416, maxWidth: 416, height: "auto" }}
      >
        <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
          <div className="flex items-center gap-2 min-w-0">
            <Star className="w-4 h-4 text-gray-500 shrink-0" />
            <div className="min-w-0">
              <SheetTitle className="text-sm font-semibold text-gray-900">Order ticket</SheetTitle>
              <SheetDescription className="text-xs text-gray-400 truncate">{market.title}</SheetDescription>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 shrink-0"><X className="w-4 h-4" /></button>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <OrderTicket market={market} embedded />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
