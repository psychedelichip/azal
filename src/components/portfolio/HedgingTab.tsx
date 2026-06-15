import { useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HEDGE_POSITIONS } from "@/lib/mock";
import type { HedgeSelection } from "@/lib/mock";

interface HedgingTabProps {
  onHedge: (positionIndex: number, candidateIndex: number) => void;
  selected: HedgeSelection | null;
  hedged: string[];
}

export function HedgingTab({ onHedge, selected, hedged }: HedgingTabProps) {
  // Single-open accordion: first position expanded by default, -1 = all collapsed.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Hedging simulator</h3>
          <div className="text-xs text-gray-400 mt-0.5">Expand a position to see related markets you can hedge with</div>
        </div>
        <div className="space-y-2">
          {HEDGE_POSITIONS.map((p, i) => (
            <Collapsible
              key={p.id}
              open={openIndex === i}
              onOpenChange={(next) => setOpenIndex(next ? i : -1)}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <CollapsibleTrigger className="group/hedge w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <Badge
                  variant="outline"
                  className={`h-auto text-xs font-medium rounded px-1.5 py-0.5 shrink-0 ${
                    p.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"
                  }`}
                >
                  {p.side}
                </Badge>
                <span className="text-sm font-medium text-gray-900 flex-1 text-left">{p.name}</span>
                <span className="text-xs text-gray-400">Exposure</span>
                <span className="text-sm font-medium text-gray-900">{p.exposure}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=closed]/hedge:-rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Related markets to hedge</div>
                  <div className="space-y-2">
                    {p.candidates.map((c, j) => {
                      const isSelected = selected?.pi === i && selected?.ri === j;
                      const isHedged = hedged.includes(`${i}-${j}`);
                      return (
                        <div
                          key={c.id}
                          className={`flex items-center gap-3 bg-white border rounded-lg px-3 py-2 transition-shadow ${
                            isSelected ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
                          }`}
                        >
                          <Badge
                            variant="outline"
                            className={`h-auto text-xs font-normal rounded-full px-2 py-0.5 shrink-0 ${
                              c.relation === "Inverse" ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200"
                            }`}
                          >
                            {c.relation}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 truncate">{c.market}</div>
                            <div className="text-xs text-gray-400">{c.rationale}</div>
                          </div>
                          {isHedged && (
                            <Badge variant="outline" className="h-auto gap-1 text-xs font-medium text-green-700 bg-green-50 border-green-200 rounded-full px-2 py-0.5 shrink-0">
                              <Shield className="w-3 h-3" /> Hedged
                            </Badge>
                          )}
                          <span className="text-sm font-medium text-gray-900">{c.price}</span>
                          {isHedged ? (
                            <Button
                              variant="outline"
                              onClick={() => onHedge(i, j)}
                              className="h-auto text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              onClick={() => onHedge(i, j)}
                              className="h-auto text-xs font-medium rounded-md px-2.5 py-1.5 shrink-0 text-white bg-[#0b1220] hover:bg-[#0b1220]"
                            >
                              Hedge
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
