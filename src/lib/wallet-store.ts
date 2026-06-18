import { useSyncExternalStore } from "react";
import { INITIAL_WALLETS } from "@/lib/mock";
import type { WalletAccount } from "@/lib/mock";

/**
 * Shared multi-wallet state. Lives at module scope so the active scope persists
 * across route changes and can be read by any screen (TopBar wallet button,
 * order ticket, balances) via useWalletBook / useActiveWallets. Mirrors the
 * copy-store pattern; a real backend can replace these mutations later.
 */

export interface StoredWallet extends WalletAccount {
  /** null = ungrouped. */
  groupId: string | null;
}

export interface WalletGroup {
  id: string;
  name: string;
}

/** The active scope is EITHER one wallet OR one group — never both. */
export type ActiveScope =
  | { kind: "wallet"; id: string }
  | { kind: "group"; id: string };

export interface WalletBook {
  wallets: StoredWallet[];
  groups: WalletGroup[];
  active: ActiveScope | null;
}

function isActiveWallet(b: WalletBook, w: StoredWallet): boolean {
  if (!b.active) return false;
  return b.active.kind === "wallet" ? b.active.id === w.id : w.groupId === b.active.id;
}

/** Keep each wallet's `active` flag derived from the scope so other screens that
 *  read wallet.active stay correct. Always returns a fresh book object. */
function normalize(next: WalletBook): WalletBook {
  return { ...next, wallets: next.wallets.map((w) => ({ ...w, active: isActiveWallet(next, w) })) };
}

const seedActive = INITIAL_WALLETS.find((w) => w.active);

let book: WalletBook = normalize({
  wallets: INITIAL_WALLETS.map((w) => ({ ...w, groupId: null })),
  groups: [],
  active: seedActive ? { kind: "wallet", id: seedActive.id } : null,
});

let walletSeq = INITIAL_WALLETS.length + 1;
let groupSeq = 1;

const listeners = new Set<() => void>();

function commit(next: WalletBook) {
  book = normalize(next);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return book;
}

/** Reactive read of the whole wallet book. */
export function useWalletBook() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Non-reactive read (use inside handlers). */
export function getWalletBook() {
  return book;
}

/* ---- derived reads (for other screens) ---- */

/** Wallets covered by the active scope: one wallet, a whole group, or none. */
export function activeWallets(b: WalletBook = book): StoredWallet[] {
  return b.wallets.filter((w) => isActiveWallet(b, w));
}

/** Reactive convenience: the active wallet set. */
export function useActiveWallets(): StoredWallet[] {
  return activeWallets(useWalletBook());
}

/* ---- scope mutations ---- */

export function setActiveWallet(id: string) {
  commit({ ...book, active: { kind: "wallet", id } });
}

export function setActiveGroup(id: string) {
  commit({ ...book, active: { kind: "group", id } });
}

/* ---- group mutations ---- */

export function createGroup(name: string): string {
  const id = `group-${groupSeq++}`;
  commit({ ...book, groups: [...book.groups, { id, name: name.trim() || `Group ${book.groups.length + 1}` }] });
  return id;
}

export function renameGroup(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  commit({ ...book, groups: book.groups.map((g) => (g.id === id ? { ...g, name: trimmed } : g)) });
}

/** Delete a group; its wallets fall back to ungrouped. Clears active if it pointed here. */
export function deleteGroup(id: string) {
  commit({
    ...book,
    groups: book.groups.filter((g) => g.id !== id),
    wallets: book.wallets.map((w) => (w.groupId === id ? { ...w, groupId: null } : w)),
    active: book.active?.kind === "group" && book.active.id === id ? null : book.active,
  });
}

/* ---- wallet mutations ---- */

export interface NewWallet {
  label: string;
  address: string;
  balance: string;
  groupId: string | null;
}

export function addWallets(items: NewWallet[]) {
  const created: StoredWallet[] = items.map((it) => ({
    id: `wallet-${walletSeq++}`,
    label: it.label,
    address: it.address,
    balance: it.balance,
    active: false,
    groupId: it.groupId,
  }));
  commit({ ...book, wallets: [...book.wallets, ...created] });
}

export function removeWallets(ids: string[]) {
  const set = new Set(ids);
  const active = book.active?.kind === "wallet" && set.has(book.active.id) ? null : book.active;
  commit({ ...book, wallets: book.wallets.filter((w) => !set.has(w.id)), active });
}

export function moveWallets(ids: string[], groupId: string | null) {
  const set = new Set(ids);
  commit({ ...book, wallets: book.wallets.map((w) => (set.has(w.id) ? { ...w, groupId } : w)) });
}

/** Bulk "Set active": wrap the checked wallets in a new group and activate it. */
export function groupAndActivate(ids: string[], name: string): string {
  const id = `group-${groupSeq++}`;
  const set = new Set(ids);
  commit({
    ...book,
    groups: [...book.groups, { id, name: name.trim() || `Group ${book.groups.length + 1}` }],
    wallets: book.wallets.map((w) => (set.has(w.id) ? { ...w, groupId: id } : w)),
    active: { kind: "group", id },
  });
  return id;
}
