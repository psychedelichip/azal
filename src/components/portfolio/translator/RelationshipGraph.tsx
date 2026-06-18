import { useState } from "react";

/**
 * Three-column relationship graph: holdings → shared drivers → prediction markets.
 * Each link is signed (aligned = solid teal, inverse = dashed coral) and weighted
 * (line thickness = correlation strength). Hover/tap a node to trace its links.
 *
 * Standalone + mock so Command Center can pull the same translation map.
 */

type Sign = "aligned" | "inverse";
type Col = 0 | 1 | 2;

interface GNode {
  id: string;
  label: string;
  sub?: string;
  col: Col;
}

interface GLink {
  from: string;
  to: string;
  sign: Sign;
  /** 0..1, drives line thickness. */
  strength: number;
}

const NODES: GNode[] = [
  // holdings
  { id: "nvda", label: "NVDA", sub: "120 sh · $38.4k", col: 0 },
  { id: "tlt", label: "TLT", sub: "Long bonds", col: 0 },
  { id: "eth", label: "ETH", sub: "$41.0k", col: 0 },
  // shared drivers
  { id: "ai", label: "AI capex", col: 1 },
  { id: "rate", label: "Rate / Fed", col: 1 },
  { id: "infl", label: "Inflation", col: 1 },
  { id: "creg", label: "Crypto reg", col: 1 },
  // prediction markets
  { id: "m-ai", label: "AI capex beat", col: 2 },
  { id: "m-fed", label: "Fed July cut", col: 2 },
  { id: "m-cpi", label: "CPI > 3.5%", col: 2 },
  { id: "m-eth", label: "ETH ETF inflows", col: 2 },
];

const LINKS: GLink[] = [
  // holdings → drivers
  { from: "nvda", to: "ai", sign: "aligned", strength: 0.92 },
  { from: "nvda", to: "rate", sign: "inverse", strength: 0.45 },
  { from: "tlt", to: "rate", sign: "inverse", strength: 0.86 },
  { from: "tlt", to: "infl", sign: "inverse", strength: 0.6 },
  { from: "eth", to: "creg", sign: "aligned", strength: 0.8 },
  { from: "eth", to: "rate", sign: "inverse", strength: 0.5 },
  { from: "eth", to: "infl", sign: "aligned", strength: 0.32 },
  // drivers → markets
  { from: "ai", to: "m-ai", sign: "aligned", strength: 0.88 },
  { from: "rate", to: "m-fed", sign: "aligned", strength: 0.72 },
  { from: "infl", to: "m-cpi", sign: "aligned", strength: 0.9 },
  { from: "infl", to: "m-fed", sign: "inverse", strength: 0.62 },
  { from: "creg", to: "m-eth", sign: "aligned", strength: 0.8 },
  { from: "rate", to: "m-eth", sign: "inverse", strength: 0.4 },
];

const VB_W = 780;
const VB_H = 380;
const PAD_Y = 18;
const NODE_W = 132;
const NODE_H = 44;
const COL_LEFT = [16, 324, 632];
const COL_HEADERS = ["Holdings", "Shared drivers", "Prediction markets"];

const TEAL = "#0d9488";
const CORAL = "#fb7185";

interface NodePos {
  cx: number;
  cy: number;
  left: number;
  right: number;
}

// Evenly distribute each column's nodes down the canvas.
const POS: Record<string, NodePos> = (() => {
  const acc: Record<string, NodePos> = {};
  ([0, 1, 2] as Col[]).forEach((c) => {
    const inCol = NODES.filter((n) => n.col === c);
    inCol.forEach((node, i) => {
      const cy = PAD_Y + ((i + 0.5) * (VB_H - 2 * PAD_Y)) / inCol.length;
      const left = COL_LEFT[c];
      acc[node.id] = { cx: left + NODE_W / 2, cy, left, right: left + NODE_W };
    });
  });
  return acc;
})();

function linkPath(l: GLink): string {
  const a = POS[l.from];
  const b = POS[l.to];
  const sx = a.right;
  const sy = a.cy;
  const tx = b.left;
  const ty = b.cy;
  const dx = (tx - sx) * 0.45;
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
}

export function RelationshipGraph() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;

  // nodes one hop from the active node (incl. itself)
  const related = new Set<string>();
  if (active) {
    related.add(active);
    LINKS.forEach((l) => {
      if (l.from === active) related.add(l.to);
      if (l.to === active) related.add(l.from);
    });
  }
  const linkOn = (l: GLink) => !active || l.from === active || l.to === active;
  const nodeOn = (id: string) => !active || related.has(id);

  return (
    <div>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label="Relationship graph: holdings, shared drivers, and prediction markets"
      >
        {/* background — click to clear pin */}
        <rect x={0} y={0} width={VB_W} height={VB_H} fill="transparent" onClick={() => setPinned(null)} />

        {/* column headers */}
        {COL_HEADERS.map((h, c) => (
          <text
            key={h}
            x={COL_LEFT[c] + NODE_W / 2}
            y={12}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight={600}
            letterSpacing="0.06em"
            fill="#9ca3af"
            style={{ textTransform: "uppercase" }}
          >
            {h}
          </text>
        ))}

        {/* links */}
        {LINKS.map((l) => {
          const on = linkOn(l);
          return (
            <path
              key={`${l.from}-${l.to}`}
              d={linkPath(l)}
              fill="none"
              stroke={l.sign === "aligned" ? TEAL : CORAL}
              strokeWidth={1.3 + l.strength * 2.6}
              strokeLinecap="round"
              strokeDasharray={l.sign === "inverse" ? "5 4" : undefined}
              opacity={on ? (active ? 0.95 : 0.8) : 0.1}
              style={{ transition: "opacity 120ms ease" }}
            />
          );
        })}

        {/* nodes */}
        {NODES.map((n) => {
          const p = POS[n.id];
          const on = nodeOn(n.id);
          const isActive = active === n.id;
          return (
            <g
              key={n.id}
              opacity={on ? 1 : 0.32}
              style={{ cursor: "pointer", transition: "opacity 120ms ease" }}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned((prev) => (prev === n.id ? null : n.id))}
            >
              <rect
                x={p.left}
                y={p.cy - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={9}
                fill="#ffffff"
                stroke={isActive ? "#0b1220" : on && active ? "#9ca3af" : "#e5e7eb"}
                strokeWidth={isActive ? 1.75 : 1.25}
              />
              <text
                x={p.left + 12}
                y={n.sub ? p.cy - 2 : p.cy + 4}
                fontSize={12.5}
                fontWeight={600}
                fill="#111827"
              >
                {n.label}
              </text>
              {n.sub && (
                <text x={p.left + 12} y={p.cy + 12} fontSize={9.5} fill="#9ca3af">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg width={22} height={8} aria-hidden>
            <line x1={1} y1={4} x2={21} y2={4} stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" />
          </svg>
          Aligned
        </span>
        <span className="flex items-center gap-1.5">
          <svg width={22} height={8} aria-hidden>
            <line x1={1} y1={4} x2={21} y2={4} stroke={CORAL} strokeWidth={2.5} strokeDasharray="4 3" strokeLinecap="round" />
          </svg>
          Inverse
        </span>
        <span className="text-gray-400">Line thickness = correlation strength</span>
      </div>
    </div>
  );
}
