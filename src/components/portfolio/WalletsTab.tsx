import { useState } from "react";
import { ArrowDownToLine, Copy, Plus, Trash2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INITIAL_WALLETS } from "@/lib/mock";
import type { WalletAccount } from "@/lib/mock";

function randomAddress() {
  const seg = () => Math.random().toString(16).slice(2, 6);
  return `0x${seg()}...${seg()}`;
}

function copyAddress(address: string) {
  if (navigator.clipboard) void navigator.clipboard.writeText(address);
}

export function WalletsTab() {
  const [wallets, setWallets] = useState<WalletAccount[]>(INITIAL_WALLETS);
  const [nextId, setNextId] = useState(INITIAL_WALLETS.length + 1);

  const setActive = (id: string) => setWallets((ws) => ws.map((w) => ({ ...w, active: w.id === id })));
  const remove = (id: string) => setWallets((ws) => ws.filter((w) => w.id !== id));
  const add = (label: string) => {
    const id = `wallet-${nextId}`;
    setWallets((ws) => [...ws, { id, label, address: randomAddress(), balance: "$0", active: false }]);
    setNextId((n) => n + 1);
  };

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Connected wallets</h3>
            <div className="text-xs text-gray-400 mt-0.5">{wallets.length} wallets connected</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => add("Imported wallet")}
              className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              <ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import wallet
            </Button>
            <Button
              onClick={() => add("New wallet")}
              className="h-auto gap-1.5 text-sm font-medium rounded-lg px-3 py-2 text-white bg-[#0b1220] hover:bg-[#0b1220]"
            >
              <Plus className="w-4 h-4" /> Create wallet
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {wallets.map((w, i) => (
            <div key={w.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-gray-100" : ""} hover:bg-gray-50`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#ede9fe" }}>
                <Wallet className="w-4 h-4" style={{ color: "#7c3aed" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{w.label}</span>
                  {w.active && (
                    <Badge variant="outline" className="h-auto text-xs font-normal text-green-700 bg-green-50 border-green-200 rounded-full px-2 py-0.5">Active</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  {w.address}
                  <button onClick={() => copyAddress(w.address)} title="Copy address" className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">{w.balance}</div>
              {!w.active && (
                <Button
                  variant="outline"
                  onClick={() => setActive(w.id)}
                  className="h-auto text-xs font-normal border-gray-200 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-50"
                >
                  Set active
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(w.id)}
                title="Remove wallet"
                className="w-8 h-8 rounded-md text-gray-400 hover:bg-gray-50 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {wallets.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No wallets yet. Create or import one.</div>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-3">
          Created wallets are generated in app; imported wallets use your existing keys. Fund a wallet by copying its address.
        </div>
      </div>
    </ScrollArea>
  );
}
