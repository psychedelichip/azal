import { useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chart } from "@/components/Chart";
import { OrderTicket } from "@/components/OrderTicket";
import { FEATURED_MARKETS } from "@/lib/mock";

export function FeaturedCarousel({ editing }: { editing: boolean }) {
  const [slide, setSlide] = useState(0);
  const cur = FEATURED_MARKETS[slide];
  const prev = () => setSlide((slide - 1 + FEATURED_MARKETS.length) % FEATURED_MARKETS.length);
  const next = () => setSlide((slide + 1) % FEATURED_MARKETS.length);

  return (
    <section className="flex-1 flex flex-col bg-white min-w-0 min-h-0">
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">
            {editing && <GripVertical className="w-4 h-4 text-gray-300" />}
            Featured market {slide + 1} / {FEATURED_MARKETS.length}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {FEATURED_MARKETS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setSlide(i)}
                  className="rounded-full"
                  style={{ width: i === slide ? 16 : 6, height: 6, background: i === slide ? "#111827" : "#d1d5db" }}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={prev} className="size-7 rounded-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-500">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={next} className="size-7 rounded-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-500">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-5 pt-1">
          <h2 className="text-lg font-semibold text-gray-900">{cur.title}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span>{cur.venue}</span><span>·</span><span>{cur.volumeLabel}</span>
            <Badge variant="outline" className="h-auto gap-1 text-green-600 text-xs font-normal border-green-200 bg-green-50 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
            </Badge>
          </div>
        </div>

        <div className="px-5 mt-3">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-900" /> Yes {cur.yes}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> No {cur.no}%</span>
          </div>
          <Chart a={cur.yesSeries} b={cur.noSeries} />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Jun 1</span><span>Jun 4</span><span>Jun 7</span><span>Jun 10</span></div>
        </div>

        <div className="px-5 mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5"><span className="text-sm text-gray-700">Yes</span><span className="text-sm font-semibold text-gray-900">{cur.yes}¢</span></div>
          <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5"><span className="text-sm text-gray-700">No</span><span className="text-sm font-semibold text-gray-900">{cur.no}¢</span></div>
        </div>

        <OrderTicket market={cur} />
      </ScrollArea>
    </section>
  );
}
