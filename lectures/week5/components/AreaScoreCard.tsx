interface AreaScoreCardProps {
  label: string;
  score: number;
  description?: string;
}

export default function AreaScoreCard({ label, score }: AreaScoreCardProps) {
  const pct = Math.round((score / 100) * 100);

  return (
    <div className="rounded border border-stone-200 bg-white p-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-medium text-stone-700">{label}</span>
        <span className="text-lg font-mono font-bold text-stone-900">{score}</span>
      </div>
      <div className="h-1 w-full rounded bg-stone-100 mb-1">
        <div
          className="h-1 rounded bg-amber-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
