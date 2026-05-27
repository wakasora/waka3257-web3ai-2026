interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  inverse?: boolean; // trueの場合、低い方が良い指標
  unit?: string;
}

const COLORS: Record<string, string> = {
  good: 'bg-emerald-500/70',
  mid: 'bg-amber-500/70',
  bad: 'bg-rose-500/60',
};

function getColor(value: number, max: number, inverse: boolean): string {
  const ratio = value / max;
  if (inverse) {
    if (ratio <= 0.4) return COLORS.good;
    if (ratio <= 0.7) return COLORS.mid;
    return COLORS.bad;
  } else {
    if (ratio >= 0.7) return COLORS.good;
    if (ratio >= 0.4) return COLORS.mid;
    return COLORS.bad;
  }
}

export default function ScoreBar({ label, value, max = 5, inverse = false, unit }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100);
  const color = getColor(value, max, inverse);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-stone-400">{label}</span>
        <span className="text-xs font-mono text-stone-300">
          {value.toFixed(1)}{unit ?? `/${max}`}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-stone-800">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
