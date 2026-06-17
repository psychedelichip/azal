import { useSyncExternalStore } from "react";
import type { CopyMode } from "@/lib/mock";

/**
 * Shared copy-trading state. Lives at module scope so it persists across route
 * changes (Social ⇄ Profile) and is read by both the trader/copy drawer and the
 * Profile "Copying" tab. A real backend can replace these mutations later.
 */
export type CopyStatus = "Active" | "Paused" | "Pending Close";

export interface CopyConfig {
  traderId: string;
  /** USD committed to this copy. */
  allocation: number;
  mode: CopyMode;
  /** Percent loss that auto-closes the copy; null = off. */
  stopLoss: number | null;
  status: CopyStatus;
  /** Mock running P&L for display. */
  pnl: string;
  up: boolean;
}

const SEED: CopyConfig[] = [
  { traderId: "apex", allocation: 12500, mode: "proportional", stopLoss: 25, status: "Active", pnl: "+$1,840", up: true },
  { traderId: "delta", allocation: 6000, mode: "fixed", stopLoss: null, status: "Active", pnl: "+$420", up: true },
  { traderId: "nova", allocation: 4000, mode: "proportional", stopLoss: 15, status: "Paused", pnl: "−$120", up: false },
];

let copies = new Map<string, CopyConfig>(SEED.map((c) => [c.traderId, c]));
const listeners = new Set<() => void>();
const closingTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  // New Map reference so useSyncExternalStore detects the change.
  copies = new Map(copies);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return copies;
}

/** Reactive read of the whole copy book. */
export function useCopyStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Non-reactive read for one trader (use inside effects / handlers). */
export function getCopy(id: string): CopyConfig | undefined {
  return copies.get(id);
}

function clearClosing(id: string) {
  const t = closingTimers.get(id);
  if (t) {
    clearTimeout(t);
    closingTimers.delete(id);
  }
}

/** Start (or restart) copying a trader. */
export function startCopy(config: Omit<CopyConfig, "status">) {
  clearClosing(config.traderId);
  copies.set(config.traderId, { ...config, status: "Active" });
  emit();
}

/** Update an existing copy's config (allocation / mode / stop loss). */
export function updateCopy(id: string, patch: Partial<Omit<CopyConfig, "traderId">>) {
  const current = copies.get(id);
  if (!current) return;
  copies.set(id, { ...current, ...patch });
  emit();
}

export function pauseCopy(id: string) {
  updateCopy(id, { status: "Paused" });
}

export function resumeCopy(id: string) {
  updateCopy(id, { status: "Active" });
}

/** Stop + close all: sell copied positions, funds return. Shows Pending Close while closing. */
export function stopAndCloseAll(id: string) {
  const current = copies.get(id);
  if (!current || current.status === "Pending Close") return;
  copies.set(id, { ...current, status: "Pending Close" });
  emit();
  const timer = setTimeout(() => {
    copies.delete(id);
    closingTimers.delete(id);
    emit();
  }, 1600);
  closingTimers.set(id, timer);
}

/** Stop + keep all: hand the copied positions to the user's own portfolio, self-managed. */
export function stopAndKeepAll(id: string) {
  if (!copies.has(id)) return;
  clearClosing(id);
  copies.delete(id);
  emit();
}
