import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDownToLine,
  Check,
  ChevronRight,
  Copy,
  Folder,
  FolderPlus,
  Minus,
  Pencil,
  Plus,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addWallets,
  createGroup,
  deleteGroup,
  getWalletBook,
  groupAndActivate,
  moveWallets,
  removeWallets,
  renameGroup,
  setActiveGroup,
  setActiveWallet,
  useWalletBook,
} from "@/lib/wallet-store";
import type { NewWallet, StoredWallet, WalletGroup } from "@/lib/wallet-store";

function randomAddress() {
  const seg = () => Math.random().toString(16).slice(2, 6);
  return `0x${seg()}...${seg()}`;
}

function shortenAddress(raw: string) {
  const v = raw.trim();
  return v.length > 16 ? `${v.slice(0, 6)}...${v.slice(-4)}` : v;
}

function copyAddress(address: string) {
  if (navigator.clipboard) void navigator.clipboard.writeText(address);
}

function parseUsd(s: string) {
  const n = Number(s.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatUsd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Resolve a GroupSelect choice into a concrete groupId, creating a group if needed. */
function resolveGroup(choice: string, newName: string): string | null {
  if (choice === "__new__") {
    const name = newName.trim();
    return name ? createGroup(name) : null;
  }
  return choice === "" ? null : choice;
}

/* ---------- small controls ---------- */

function SelectBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      title="Select for bulk edit"
      className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
        checked ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      {checked && <Check className="w-3 h-3" />}
    </button>
  );
}

/** Active-scope radio. "on" = the active anchor, "via" = active because its group is, "off" = inactive. */
function ScopeRadio({ state, onChange, title }: { state: "on" | "via" | "off"; onChange: () => void; title: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state !== "off"}
      onClick={onChange}
      title={title}
      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
        state === "on" ? "border-[#0b1220] bg-[#0b1220]" : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      {state === "on" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      {state === "via" && <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
    </button>
  );
}

function ActiveBadge() {
  return (
    <Badge
      variant="outline"
      className="h-auto text-xs font-normal text-green-700 bg-green-50 border-green-200 rounded-full px-2 py-0.5"
    >
      Active
    </Badge>
  );
}

/* ---------- modal shell ---------- */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600 mb-1.5">{children}</label>;
}

/** Group picker shared by the create / import dialogs. */
function GroupSelect({
  groups,
  choice,
  onChoice,
  newName,
  onNewName,
}: {
  groups: WalletGroup[];
  choice: string;
  onChoice: (v: string) => void;
  newName: string;
  onNewName: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel>
        Group <span className="font-normal text-gray-400">(optional)</span>
      </FieldLabel>
      <select
        value={choice}
        onChange={(e) => onChoice(e.target.value)}
        className="w-full h-9 px-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
      >
        <option value="">No group (Ungrouped)</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
        <option value="__new__">+ New group…</option>
      </select>
      {choice === "__new__" && (
        <Input
          autoFocus
          value={newName}
          onChange={(e) => onNewName(e.target.value)}
          placeholder="New group name"
          className="mt-2 h-9 text-sm border-gray-200 rounded-lg"
        />
      )}
    </div>
  );
}

function DialogFooter({
  onClose,
  onConfirm,
  confirmText,
  disabled,
}: {
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 mt-5">
      <Button
        variant="outline"
        onClick={onClose}
        className="h-auto text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={disabled}
        className="h-auto text-sm font-medium rounded-lg px-3 py-2 text-white bg-[#0b1220] hover:bg-[#0b1220] disabled:opacity-40"
      >
        {confirmText}
      </Button>
    </div>
  );
}

/* ---------- dialogs ---------- */

function CreateWalletsDialog({ groups, onClose }: { groups: WalletGroup[]; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [prefix, setPrefix] = useState("");
  const [choice, setChoice] = useState("");
  const [newName, setNewName] = useState("");
  const clamp = (n: number) => Math.max(1, Math.min(20, n));

  const submit = () => {
    const groupId = resolveGroup(choice, newName);
    const base = getWalletBook().wallets.length + 1;
    const items: NewWallet[] = Array.from({ length: qty }, (_, i) => ({
      label: `${prefix.trim() || "Wallet"} ${base + i}`,
      address: randomAddress(),
      balance: "$0",
      groupId,
    }));
    addWallets(items);
    onClose();
  };

  return (
    <Modal title="Create wallets" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FieldLabel>Quantity</FieldLabel>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={qty <= 1}
              onClick={() => setQty((q) => clamp(q - 1))}
              className="w-8 h-8 rounded-lg border-gray-200 text-gray-600 disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={20}
              value={qty}
              onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
              className="w-16 h-8 text-center text-sm border-gray-200 rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={qty >= 20}
              onClick={() => setQty((q) => clamp(q + 1))}
              className="w-8 h-8 rounded-lg border-gray-200 text-gray-600 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-400 ml-1">max 20</span>
          </div>
        </div>
        <div>
          <FieldLabel>
            Name prefix <span className="font-normal text-gray-400">(optional)</span>
          </FieldLabel>
          <Input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Wallet"
            className="h-9 text-sm border-gray-200 rounded-lg"
          />
        </div>
        <GroupSelect groups={groups} choice={choice} onChoice={setChoice} newName={newName} onNewName={setNewName} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={submit} confirmText={`Create ${qty} wallet${qty > 1 ? "s" : ""}`} />
    </Modal>
  );
}

function ImportWalletsDialog({ groups, onClose }: { groups: WalletGroup[]; onClose: () => void }) {
  const [text, setText] = useState("");
  const [choice, setChoice] = useState("");
  const [newName, setNewName] = useState("");
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20);

  const submit = () => {
    if (lines.length === 0) return;
    const groupId = resolveGroup(choice, newName);
    const base = getWalletBook().wallets.length + 1;
    const items: NewWallet[] = lines.map((line, i) => ({
      label: `Imported ${base + i}`,
      address: shortenAddress(line),
      balance: "$0",
      groupId,
    }));
    addWallets(items);
    onClose();
  };

  return (
    <Modal title="Import wallets" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FieldLabel>Addresses or keys — one per line</FieldLabel>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={"0x4a9c…c21F\n0x77b3…9e02\nbc1q8h…8h7k"}
            className="w-full px-2.5 py-2 text-sm font-mono border border-gray-200 rounded-lg bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          />
          <div className="text-xs text-gray-400 mt-1">{lines.length} / 20 detected</div>
        </div>
        <GroupSelect groups={groups} choice={choice} onChoice={setChoice} newName={newName} onNewName={setNewName} />
      </div>
      <DialogFooter
        onClose={onClose}
        onConfirm={submit}
        confirmText={`Import ${lines.length || ""} wallet${lines.length === 1 ? "" : "s"}`.replace("  ", " ")}
        disabled={lines.length === 0}
      />
    </Modal>
  );
}

function NamePromptDialog({
  title,
  label,
  initial,
  confirmText,
  onConfirm,
  onClose,
}: {
  title: string;
  label: string;
  initial?: string;
  confirmText: string;
  onConfirm: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial ?? "");
  const submit = () => {
    const t = name.trim();
    if (!t) return;
    onConfirm(t);
    onClose();
  };
  return (
    <Modal title={title} onClose={onClose}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="h-9 text-sm border-gray-200 rounded-lg"
      />
      <DialogFooter onClose={onClose} onConfirm={submit} confirmText={confirmText} disabled={!name.trim()} />
    </Modal>
  );
}

/* ---------- wallet row ---------- */

function WalletRow({
  w,
  selected,
  onToggleSelect,
  activeBadge,
  radioState,
  onSetActive,
  onRemove,
  topBorder,
}: {
  w: StoredWallet;
  selected: boolean;
  onToggleSelect: () => void;
  activeBadge: boolean;
  radioState: "on" | "via" | "off";
  onSetActive: () => void;
  onRemove: () => void;
  topBorder: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-3 ${topBorder ? "border-t border-gray-100" : ""} ${
        selected ? "bg-blue-50/60" : "hover:bg-gray-50"
      }`}
    >
      <SelectBox checked={selected} onChange={onToggleSelect} />
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#ede9fe" }}>
        <Wallet className="w-4 h-4" style={{ color: "#7c3aed" }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">{w.label}</span>
          {activeBadge && <ActiveBadge />}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
          <span className="truncate">{w.address}</span>
          <button onClick={() => copyAddress(w.address)} title="Copy address" className="text-gray-400 hover:text-gray-600 shrink-0">
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-900 shrink-0">{w.balance}</div>
      <ScopeRadio
        state={radioState}
        onChange={onSetActive}
        title={radioState === "via" ? "Active via group — click to use only this wallet" : "Set this wallet active"}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        title="Remove wallet"
        className="w-8 h-8 rounded-md text-gray-400 hover:bg-gray-50 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

/* ---------- tab ---------- */

type Dialog =
  | { type: "create" }
  | { type: "import" }
  | { type: "newGroup" }
  | { type: "rename"; id: string; current: string }
  | { type: "activate" }
  | { type: "moveNew" }
  | null;

export function WalletsTab() {
  const book = useWalletBook();
  const { wallets, groups, active } = book;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<Dialog>(null);

  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleCollapse = (id: string) =>
    setCollapsed((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const clearSelection = () => setSelected(new Set());

  // Selection limited to wallets that still exist (after deletes / moves).
  const selectedIds = wallets.filter((w) => selected.has(w.id)).map((w) => w.id);

  const radioFor = (w: StoredWallet): "on" | "via" | "off" => {
    if (!active) return "off";
    if (active.kind === "wallet") return active.id === w.id ? "on" : "off";
    return w.groupId === active.id ? "via" : "off";
  };
  const isWalletActive = (w: StoredWallet) =>
    active != null && (active.kind === "wallet" ? active.id === w.id : w.groupId === active.id);
  const isGroupActive = (g: WalletGroup) => active?.kind === "group" && active.id === g.id;

  const doMove = (groupId: string | null) => {
    moveWallets(selectedIds, groupId);
    clearSelection();
  };

  const ungrouped = wallets.filter((w) => w.groupId === null);
  const groupTotal = (g: WalletGroup) =>
    formatUsd(wallets.filter((w) => w.groupId === g.id).reduce((sum, w) => sum + parseUsd(w.balance), 0));

  const activeLabel = !active
    ? "none"
    : active.kind === "wallet"
    ? wallets.find((w) => w.id === active.id)?.label ?? "—"
    : groups.find((g) => g.id === active.id)?.name ?? "—";

  const renderRows = (list: StoredWallet[]) =>
    list.map((w, i) => (
      <WalletRow
        key={w.id}
        w={w}
        selected={selected.has(w.id)}
        onToggleSelect={() => toggleSelect(w.id)}
        activeBadge={isWalletActive(w)}
        radioState={radioFor(w)}
        onSetActive={() => setActiveWallet(w.id)}
        onRemove={() => removeWallets([w.id])}
        topBorder={i > 0}
      />
    ));

  return (
    <ScrollArea className="flex-1 min-h-0 bg-white">
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Connected wallets</h3>
            <div className="text-xs text-gray-400 mt-0.5">
              {wallets.length} wallet{wallets.length === 1 ? "" : "s"} · {groups.length} group
              {groups.length === 1 ? "" : "s"} · Active: <span className="text-gray-600">{activeLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setDialog({ type: "newGroup" })}
              className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              <FolderPlus className="w-4 h-4 text-gray-400" /> New group
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialog({ type: "import" })}
              className="h-auto gap-1.5 text-sm font-normal border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              <ArrowDownToLine className="w-4 h-4 text-gray-400" /> Import wallet
            </Button>
            <Button
              onClick={() => setDialog({ type: "create" })}
              className="h-auto gap-1.5 text-sm font-medium rounded-lg px-3 py-2 text-white bg-[#0b1220] hover:bg-[#0b1220]"
            >
              <Plus className="w-4 h-4" /> Create wallet
            </Button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/70 flex-wrap">
            <span className="text-sm font-medium text-gray-900">{selectedIds.length} selected</span>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto gap-1.5 text-xs font-normal border-gray-200 bg-white rounded-md px-2.5 py-1.5 text-gray-700 hover:bg-gray-50"
                  >
                    <Folder className="w-3.5 h-3.5 text-gray-400" /> Move to group
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onSelect={() => doMove(null)}>Ungrouped</DropdownMenuItem>
                  {groups.length > 0 && <DropdownMenuSeparator />}
                  {groups.map((g) => (
                    <DropdownMenuItem key={g.id} onSelect={() => doMove(g.id)}>
                      {g.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setDialog({ type: "moveNew" })}>+ New group…</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => setDialog({ type: "activate" })}
                className="h-auto text-xs font-normal border-gray-200 bg-white rounded-md px-2.5 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                Set active
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  removeWallets(selectedIds);
                  clearSelection();
                }}
                className="h-auto gap-1.5 text-xs font-normal border-gray-200 bg-white rounded-md px-2.5 py-1.5 text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
              <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-gray-600 px-1">
                Clear
              </button>
            </div>
          </div>
        )}

        {wallets.length === 0 ? (
          <div className="border border-gray-200 rounded-xl px-4 py-8 text-center text-sm text-gray-400">
            No wallets yet. Create or import one.
          </div>
        ) : groups.length === 0 ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden">{renderRows(ungrouped)}</div>
        ) : (
          <div className="space-y-3">
            {groups.map((g) => {
              const members = wallets.filter((w) => w.groupId === g.id);
              const open = !collapsed.has(g.id);
              const groupActive = isGroupActive(g);
              return (
                <Collapsible
                  key={g.id}
                  open={open}
                  onOpenChange={() => toggleCollapse(g.id)}
                  className={`border rounded-xl overflow-hidden ${groupActive ? "border-green-300" : "border-gray-200"}`}
                >
                  <div className={`flex items-center gap-2 px-3.5 py-2.5 ${groupActive ? "bg-green-50/40" : "bg-gray-50/60"}`}>
                    <button
                      onClick={() => toggleCollapse(g.id)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                      title={open ? "Collapse" : "Expand"}
                    >
                      <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
                      <Folder className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm font-semibold text-gray-900 truncate">{g.name}</span>
                      {groupActive && <ActiveBadge />}
                      <span className="text-xs text-gray-400 shrink-0">
                        {members.length} · {groupTotal(g)}
                      </span>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <ScopeRadio
                        state={groupActive ? "on" : "off"}
                        onChange={() => setActiveGroup(g.id)}
                        title="Set group active"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDialog({ type: "rename", id: g.id, current: g.name })}
                        title="Rename group"
                        className="w-7 h-7 rounded-md text-gray-400 hover:bg-white hover:text-gray-700"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteGroup(g.id)}
                        title="Delete group (wallets become ungrouped)"
                        className="w-7 h-7 rounded-md text-gray-400 hover:bg-white hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CollapsibleContent>
                    {members.length === 0 ? (
                      <div className="px-4 py-5 text-center text-xs text-gray-400 border-t border-gray-100">
                        Empty group — move wallets here.
                      </div>
                    ) : (
                      renderRows(members)
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            {ungrouped.length > 0 && (
              <Collapsible
                open={!collapsed.has("__ungrouped")}
                onOpenChange={() => toggleCollapse("__ungrouped")}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCollapse("__ungrouped")}
                  className="flex items-center gap-2 w-full px-3.5 py-2.5 bg-gray-50/60 text-left"
                  title={!collapsed.has("__ungrouped") ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${!collapsed.has("__ungrouped") ? "rotate-90" : ""}`}
                  />
                  <span className="text-sm font-semibold text-gray-500 truncate">Ungrouped</span>
                  <span className="text-xs text-gray-400">
                    {ungrouped.length} ·{" "}
                    {formatUsd(ungrouped.reduce((sum, w) => sum + parseUsd(w.balance), 0))}
                  </span>
                </button>
                <CollapsibleContent>{renderRows(ungrouped)}</CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-3">
          Created wallets are generated in app; imported wallets use your existing keys. Fund a wallet by copying its
          address. The active wallet or group is used across the app for orders and balances.
        </div>
      </div>

      {dialog?.type === "create" && <CreateWalletsDialog groups={groups} onClose={() => setDialog(null)} />}
      {dialog?.type === "import" && <ImportWalletsDialog groups={groups} onClose={() => setDialog(null)} />}
      {dialog?.type === "newGroup" && (
        <NamePromptDialog
          title="New group"
          label="Group name"
          initial={`Group ${groups.length + 1}`}
          confirmText="Create group"
          onConfirm={(n) => createGroup(n)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "rename" && (
        <NamePromptDialog
          title="Rename group"
          label="Group name"
          initial={dialog.current}
          confirmText="Save"
          onConfirm={(n) => renameGroup(dialog.id, n)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "activate" && (
        <NamePromptDialog
          title="Set selected active"
          label="Name this group"
          initial="Active set"
          confirmText={`Activate ${selectedIds.length} wallet${selectedIds.length === 1 ? "" : "s"}`}
          onConfirm={(n) => {
            groupAndActivate(selectedIds, n);
            clearSelection();
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === "moveNew" && (
        <NamePromptDialog
          title="Move to new group"
          label="Group name"
          initial={`Group ${groups.length + 1}`}
          confirmText="Move"
          onConfirm={(n) => {
            const id = createGroup(n);
            moveWallets(selectedIds, id);
            clearSelection();
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </ScrollArea>
  );
}
