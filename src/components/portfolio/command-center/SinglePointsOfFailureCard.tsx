import { AlertTriangle, ArrowRight } from "lucide-react";

// Catalysts that hit multiple positions at once. Mock severity.
type Severity = "danger" | "warning";

interface Spof {
  id: string;
  catalyst: string;
  date: string;
  positions: number;
  severity: Severity;
}

const SPOFS: Spof[] = [
  { id: "spof-fed", catalyst: "Fed decision", date: "Jul 30", positions: 5, severity: "danger" },
  { id: "spof-cpi", catalyst: "CPI print", date: "Jul 11", positions: 3, severity: "warning" },
  { id: "spof-opec", catalyst: "OPEC meeting", date: "Aug 4", positions: 2, severity: "warning" },
];

const SEV: Record<Severity, { dot: string; chip: string; label: string }> = {
  danger: { dot: "bg-red-500", chip: "text-red-700 bg-red-50 border-red-200", label: "High" },
  warning: { dot: "bg-amber-500", chip: "text-amber-700 bg-amber-50 border-amber-200", label: "Watch" },
};

export function SinglePointsOfFailureCard() {
  return (
    <section className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-900">Single points of failure</h4>
      </div>
      <p className="text-xs text-gray-400 mb-4">One catalyst, many positions.</p>

      <div className="space-y-2">
        {SPOFS.map((s) => {
          const sev = SEV[s.severity];
          return (
            <div key={s.id} className="border border-gray-200 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev.dot}`} />
                <span className="text-sm text-gray-900">{s.catalyst}</span>
                <span className="text-xs text-gray-400">{s.date}</span>
                <div className="flex-1" />
                <span className={`text-[11px] rounded-full px-2 py-0.5 border ${sev.chip}`}>{sev.label}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                hits <span className="font-medium text-gray-900">{s.positions} positions</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
