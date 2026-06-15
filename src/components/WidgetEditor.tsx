import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WidgetMini } from "@/components/WidgetMini";
import { WIDGETS } from "@/lib/mock";
import type { WidgetKey } from "@/lib/mock";

interface WidgetEditorProps {
  open: boolean;
  onClose: () => void;
  slotWidget: WidgetKey | null;
  onAddWidget: (key: WidgetKey) => void;
}

export function WidgetEditor({ open, onClose, slotWidget, onAddWidget }: WidgetEditorProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="gap-0 border-l border-gray-200 rounded-r-xl shadow-[-10px_0_30px_rgba(0,0,0,0.08)]"
        style={{ top: 16, right: 16, bottom: 16, width: 360, maxWidth: 360, height: "auto" }}
      >
        <SheetHeader className="flex-row items-center justify-between shrink-0 gap-0 border-b border-gray-200 px-4 py-0" style={{ height: 56 }}>
          <div>
            <SheetTitle className="text-sm font-semibold text-gray-900">Widget editor</SheetTitle>
            <SheetDescription className="text-xs text-gray-400">Add widgets to your dashboard</SheetDescription>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50"><X className="w-4 h-4" /></button>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Available widgets</div>
            {WIDGETS.map((w) => {
              const added = slotWidget === w.key;
              return (
                <div key={w.key} className="border border-gray-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{w.name}</span>
                    {added ? (
                      <Badge variant="outline" className="h-auto gap-1 text-xs font-medium text-green-700 bg-green-50 border-green-200 rounded-md px-2 py-1">Added</Badge>
                    ) : (
                      <Button
                        onClick={() => onAddWidget(w.key)}
                        className="h-auto gap-1 text-xs font-medium text-white rounded-md px-2 py-1 bg-[#0b1220] hover:bg-[#0b1220]"
                      >
                        <Plus className="size-3" /> Add
                      </Button>
                    )}
                  </div>
                  <div className="rounded-md bg-gray-50 border border-gray-100 p-2 overflow-hidden" style={{ minHeight: 46 }}>
                    <WidgetMini kind={w.key} />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-gray-200 px-4 py-3">
          <Button onClick={onClose} className="w-full h-auto rounded-lg py-2.5 text-sm font-medium text-white bg-[#0b1220] hover:bg-[#0b1220]">Done</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
