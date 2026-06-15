import { Bell, Plus, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ALERTS, SIGNALS } from "@/lib/mock";
import type { SignalTag } from "@/lib/mock";

const SIGNAL_TAG_CLASS: Record<SignalTag, string> = {
  Opportunity: "text-green-700 bg-green-50 border-green-200",
  Risk: "text-red-700 bg-red-50 border-red-200",
  Info: "text-blue-700 bg-blue-50 border-blue-200",
};

export function CommandCenterTab() {
  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Command Center</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          <Button className="h-auto gap-1.5 text-sm font-normal text-white rounded-lg px-3 py-2 bg-[#0b1220] hover:bg-[#0b1220]">
            <Plus className="w-4 h-4" /> New order
          </Button>
          <Button variant="outline" className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50">
            <Shield className="w-4 h-4 text-gray-400" /> Hedge all
          </Button>
          <Button variant="outline" className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50">
            <X className="w-4 h-4 text-gray-400" /> Close all
          </Button>
          <Button variant="outline" className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50">
            <Bell className="w-4 h-4 text-gray-400" /> New alert
          </Button>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1.8fr 1fr" }}>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Live signals</div>
            <div className="space-y-2">
              {SIGNALS.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 border shrink-0 ${SIGNAL_TAG_CLASS[s.tag]}`}>{s.tag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{s.title}</div>
                    <div className="text-xs text-gray-400 truncate">{s.sub}</div>
                  </div>
                  <button className="text-xs font-medium rounded-md px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0">{s.action}</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Alerts</div>
            <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
              {ALERTS.map((a) => (
                <div key={a.id} className="px-3 py-2.5 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">{a.market}</div>
                    <div className="text-xs text-gray-400">{a.condition}</div>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${a.status === "Triggered" ? "text-amber-700 bg-amber-50" : "text-green-700 bg-green-50"}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
