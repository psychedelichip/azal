import { ROI_RANGES } from "@/components/profile/profile-data";
import type { ProfileData, RoiRange } from "@/components/profile/profile-data";

interface StatStripProps {
  profile: ProfileData;
  range: RoiRange;
  onRangeChange: (range: RoiRange) => void;
}

function RiskDots({ risk }: { risk: number }) {
  return (
    <span className="flex items-center gap-0.5 mt-1">
      {Array.from({ length: 7 }, (_, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{ width: 6, height: 6, background: i < risk ? (risk >= 5 ? "#dc2626" : risk >= 3 ? "#d97706" : "#16a34a") : "#e5e7eb" }}
        />
      ))}
    </span>
  );
}

export function StatStrip({ profile, range, onRangeChange }: StatStripProps) {
  const roiUp = !profile.roi[range].startsWith("−");

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-100 mb-5">
      <div className="bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">ROI</span>
          <div role="group" aria-label="ROI time range" className="flex gap-0.5">
            {ROI_RANGES.map((rr) => (
              <button
                key={rr}
                onClick={() => onRangeChange(rr)}
                aria-pressed={range === rr}
                className={`rounded px-1.5 py-0.5 text-[11px] leading-none ${range === rr ? "text-gray-900 font-medium bg-gray-100" : "text-gray-400 hover:text-gray-700"}`}
              >
                {rr}
              </button>
            ))}
          </div>
        </div>
        <div className={`text-lg font-semibold mt-1 ${roiUp ? "text-green-600" : "text-red-500"}`}>{profile.roi[range]}</div>
      </div>

      <div className="bg-white px-4 py-3">
        <div className="text-xs text-gray-400">Win rate</div>
        <div className="text-lg font-semibold text-gray-900 mt-1">{profile.win}</div>
      </div>

      <div className="bg-white px-4 py-3">
        <div className="text-xs text-gray-400">Risk</div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-semibold text-gray-900">{profile.risk}<span className="text-sm text-gray-400">/7</span></span>
        </div>
        <RiskDots risk={profile.risk} />
      </div>

      <div className="bg-white px-4 py-3">
        <div className="text-xs text-gray-400">Max drawdown</div>
        <div className="text-lg font-semibold text-red-500 mt-1">{profile.drawdown}</div>
      </div>

      <div className="bg-white px-4 py-3">
        <div className="text-xs text-gray-400">Avg holding time</div>
        <div className="text-lg font-semibold text-gray-900 mt-1">{profile.avgHold}</div>
      </div>

      <div className="bg-white px-4 py-3">
        <div className="text-xs text-gray-400">Trades / week</div>
        <div className="text-lg font-semibold text-gray-900 mt-1">{profile.tradesPerWeek}</div>
      </div>
    </div>
  );
}
