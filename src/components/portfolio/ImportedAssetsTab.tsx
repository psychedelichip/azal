import { ArrowDownToLine, ChevronLeft, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BROKERAGE_ASSETS,
  CRYPTO_ASSETS,
  IMPORTED_BROKERAGE_VALUE,
  IMPORTED_CRYPTO_VALUE,
  IMPORTED_TOTAL_VALUE,
} from "@/lib/mock";

interface ImportedAssetsTabProps {
  onBack: () => void;
}

export function ImportedAssetsTab({ onBack }: ImportedAssetsTabProps) {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5 space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to overview
        </button>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400">Total imported value</div>
            <div className="text-2xl font-semibold text-gray-900 mt-1">{IMPORTED_TOTAL_VALUE}</div>
          </div>
          <div className="text-xs text-gray-400">Crypto {IMPORTED_CRYPTO_VALUE} · Brokerage {IMPORTED_BROKERAGE_VALUE}</div>
        </div>

        {/* Crypto wallets */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Crypto wallets</h3>
                <span className="text-sm font-semibold text-gray-900">{IMPORTED_CRYPTO_VALUE}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Imported from connected wallets</div>
            </div>
            <Button variant="outline" className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              <ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import from wallet
            </Button>
          </div>
          {CRYPTO_ASSETS.map((a, i) => (
            <div key={a.symbol} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: a.color }}>
                {a.symbol.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{a.name}</div>
                <div className="text-xs text-gray-400">{a.quantity}</div>
              </div>
              <div className="text-sm font-medium text-gray-900">{a.value}</div>
            </div>
          ))}
        </div>

        {/* Brokerage */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Brokerage</h3>
                <span className="text-sm font-semibold text-gray-900">{IMPORTED_BROKERAGE_VALUE}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Stocks and bonds from your broker</div>
            </div>
            <Button variant="outline" className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-50">
              <Link2 className="w-4 h-4 text-gray-400" /> Connect brokerage
            </Button>
          </div>
          {BROKERAGE_ASSETS.map((a, i) => (
            <div key={a.symbol} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""}`}>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                {a.symbol}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{a.name}</div>
                <div className="text-xs text-gray-400">{a.quantity}</div>
              </div>
              <Badge variant="outline" className="h-auto text-xs font-normal text-gray-500 border-gray-200 rounded-full px-2 py-0.5">{a.type}</Badge>
              <div className="text-sm font-medium text-gray-900" style={{ minWidth: 72, textAlign: "right" }}>{a.value}</div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
