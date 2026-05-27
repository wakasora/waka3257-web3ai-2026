interface AreaScoreCardProps {
  label: string;
  score: number;
  description?: string;
}

export default function AreaScoreCard({ label, score, description }: AreaScoreCardProps) {
  const pct = Math.round((score / 100) * 100);
  const color =
    score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-rose-400';
  const barColor =
    score >= 70 ? 'bg-emerald-500/60' : score >= 40 ? 'bg-amber-500/60' : 'bg-rose-500/50';

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-stone-300">{label}</span>
        <span className={`text-2xl font-mono font-bold ${color}`}>{score}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-stone-800 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
