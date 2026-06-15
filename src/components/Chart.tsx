interface ChartProps {
  a: number[];
  b: number[];
}

export function Chart({ a, b }: ChartProps) {
  const W = 600;
  const H = 170;
  const n = a.length;
  const x = (i: number) => (i / (n - 1)) * W;
  const y = (v: number) => H - (v / 100) * H * 0.8 - H * 0.1;
  const d = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" style={{ height: 170 }}>
      <path d={d(a)} fill="none" stroke="#111827" strokeWidth="2" strokeLinejoin="round" />
      <path d={d(b)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
