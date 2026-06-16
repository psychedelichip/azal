import { useId } from "react";
import type { RoiRange } from "@/components/profile/profile-data";

interface EquityCurveProps {
  series: number[];
  range: RoiRange;
  change: string;
}

export function EquityCurve({ series, range, change }: EquityCurveProps) {
  const gradId = useId();
  const W = 600;
  const H = 150;
  const pad = 6;
  const n = series.length;
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  // Anchor the domain to a minimum band (≈8% of the entry value) so a near-flat
  // short range reads as a small move instead of stretching edge-to-edge like the
  // all-time curve. Wide ranges (where the real swing exceeds the band) use it as-is.
  const mid = (lo + hi) / 2;
  const half = Math.max((hi - lo) / 2, (series[0] * 0.08) / 2);
  const min = mid - half;
  const max = mid + half;
  const span = max - min || 1;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - pad - ((v - min) / span) * (H - pad * 2);
  const line = series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const up = !change.startsWith("−");
  const stroke = up ? "#16a34a" : "#dc2626";

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs uppercase tracking-wider text-gray-400">Equity curve</div>
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${up ? "text-green-600" : "text-red-500"}`}>{change}</span>
          <span className="text-xs text-gray-400">{range}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" style={{ height: H }} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.16" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} stroke="none" />
        <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
