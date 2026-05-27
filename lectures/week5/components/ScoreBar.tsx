interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  inverse?: boolean; // trueの場合、低い方が良い指標
  unit?: string;
}

export default function ScoreBar({ label, value, max = 5, unit }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col gap-1 py-1.5 border-b border-stone-100 last:border-0">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-stone-600 font-medium">{label}</span>
        <span className="text-xs font-mono text-stone-900">
          {value.toFixed(1)}{unit ?? `/${max}`}
        </span>
      </div>
      <div className="h-1 w-full rounded bg-stone-100">
        <div
          className="h-1 rounded bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
