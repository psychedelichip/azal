import { ScrollArea } from "@/components/ui/scroll-area";
import { TRANSLATE, TRANSLATE_GROUPS } from "@/lib/mock";

export function TranslatorTab() {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Translator</h3>
          <div className="flex gap-1.5">
            {TRANSLATE_GROUPS.map((c, i) => (
              <span key={c} className={`text-xs rounded-full px-2.5 py-1 border ${i === 0 ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-500"}`}>{c}</span>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-400 mb-4">Translate prediction positions into the narratives, assets, and horizons they map to.</div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-gray-50 text-xs uppercase tracking-wider text-gray-400">
            <div className="col-span-3">Position</div>
            <div className="col-span-3">Narrative</div>
            <div className="col-span-3">Maps to</div>
            <div className="col-span-2">Horizon</div>
            <div className="col-span-1 text-right">Exp.</div>
          </div>
          <div className="divide-y divide-gray-100">
            {TRANSLATE.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-medium rounded px-1.5 py-0.5 border shrink-0 ${r.side === "YES" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>{r.side}</span>
                  <span className="text-sm text-gray-900 truncate">{r.position}</span>
                </div>
                <div className="col-span-3 text-sm text-gray-700">{r.narrative}</div>
                <div className="col-span-3 text-sm text-gray-500">{r.assets}</div>
                <div className="col-span-2 text-sm text-gray-500">{r.horizon}</div>
                <div className="col-span-1 text-sm font-medium text-gray-900 text-right">{r.exposure}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
