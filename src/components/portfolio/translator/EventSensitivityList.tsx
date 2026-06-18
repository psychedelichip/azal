import { ArrowRight, CalendarClock } from "lucide-react";

/**
 * Catalysts that move the whole combined book at once — one event, many positions.
 * Shared + prop-driven so Command Center can render the same list with its own framing.
 */

export type EventSeverity = "high" | "watch";

export interface BookEvent {
  id: string;
  catalyst: string;
  date: string;
  /** Shared driver the event flows through (ties back to the relationship graph). */
  driver: string;
  /** How many of your positions it hits. */
  positions: number;
  /** Short labels of the affected positions. */
  affected: string[];
  /** Rough combined-book swing if it surprises. */
  swing: string;
  severity: EventSeverity;
}

export const BOOK_EVENTS: BookEvent[] = [
  {
    id: "evt-cpi",
    catalyst: "October CPI print",
    date: "Oct 15",
    driver: "Inflation",
    positions: 4,
    affected: ["Fed July cut", "CPI > 3.5%", "US recession 2026", "TLT"],
    swing: "≈ $6.2k book swing",
    severity: "high",
  },
  {
    id: "evt-fed",
    catalyst: "Fed September decision",
    date: "Sep 17",
    driver: "Rate / Fed",
    positions: 3,
    affected: ["Fed July cut", "TLT", "ETH ETF inflows"],
    swing: "≈ $4.8k book swing",
    severity: "high",
  },
  {
    id: "evt-nvda",
    catalyst: "NVDA Q3 earnings",
    date: "Aug 27",
    driver: "AI capex",
    positions: 2,
    affected: ["AI capex beat", "NVDA"],
    swing: "≈ $3.1k book swing",
    severity: "watch",
  },
  {
    id: "evt-sec",
    catalyst: "SEC crypto ruling",
    date: "Sep 9",
    driver: "Crypto reg",
    positions: 2,
    affected: ["ETH ETF inflows", "ETH"],
    swing: "≈ $2.4k book swing",
    severity: "watch",
  },
];

const SEV_DOT: Record<EventSeverity, string> = {
  high: "bg-red-500",
  watch: "bg-amber-500",
};

interface Props {
  events?: BookEvent[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function EventSensitivityList({
  events = BOOK_EVENTS,
  title = "Event sensitivity",
  subtitle = "Catalysts that move your whole book at once.",
  className,
}: Props) {
  return (
    <section className={`border border-gray-200 rounded-xl p-5 bg-white ${className ?? ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">{subtitle}</p>

      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="border border-gray-200 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SEV_DOT[e.severity]}`} />
              <span className="text-sm text-gray-900">{e.catalyst}</span>
              <span className="text-xs text-gray-400">{e.date}</span>
              <div className="flex-1" />
              <span className="flex items-center gap-1.5 text-[11px] rounded-full px-2 py-0.5 border border-gray-200 bg-gray-50 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0d9488" }} />
                {e.driver}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              hits <span className="font-medium text-gray-900">{e.positions} of your positions</span>
              <span className="text-gray-300">·</span>
              <span>{e.swing}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {e.affected.map((a) => (
                <span key={a} className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5">
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
