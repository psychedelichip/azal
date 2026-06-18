interface ChartProps {
  a: number[];
  b: number[];
  xLabels?: string[];
}

export function Chart({ a, b, xLabels }: ChartProps) {
  const W = 600;
  const padL = 26;
  const padR = 10;
  const padT = 10;
  const padB = xLabels ? 22 : 10;
  const H = xLabels ? 190 : 178;
  const px0 = padL;
  const px1 = W - padR;
  const py1 = H - padB;
  const plotW = px1 - px0;
  const plotH = py1 - padT;
  const n = a.length;

  const x = (i: number) => px0 + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
  const y = (v: number) => py1 - (v / 100) * plotH;
  const line = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = (arr: number[]) =>
    `${line(arr)} L${x(n - 1).toFixed(1)},${py1.toFixed(1)} L${x(0).toFixed(1)},${py1.toFixed(1)} Z`;

  const ticks = [0, 25, 50, 75, 100];
  const L = xLabels?.length ?? 0;
  const lx = (i: number) => px0 + (L > 1 ? (i / (L - 1)) * plotW : plotW / 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" style={{ height: H }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={px0} y1={y(t)} x2={px1} y2={y(t)} stroke={t === 0 ? "#e5e7eb" : "#f3f4f6"} strokeWidth="1" />
          <text x={px0 - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">{t}</text>
        </g>
      ))}
      <path d={area(a)} fill="#111827" fillOpacity="0.05" stroke="none" />
      <path d={line(b)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={line(a)} fill="none" stroke="#111827" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {xLabels?.map((lbl, i) => (
        <text
          key={lbl + i}
          x={lx(i)}
          y={H - 6}
          textAnchor={i === 0 ? "start" : i === L - 1 ? "end" : "middle"}
          fontSize="10"
          fill="#9ca3af"
        >
          {lbl}
        </text>
      ))}
    </svg>
  );
}
