'use client';

export type FilterKey =
  | 'free'
  | 'work'
  | 'rest'
  | 'waiting'
  | 'indoor'
  | 'rainy'
  | 'lowConsumption'
  | 'lowVisibility';

const FILTER_LABELS: Record<FilterKey, string> = {
  free: '無料・低価格',
  work: '作業向き',
  rest: '休憩向き',
  waiting: '待機向き',
  indoor: '屋内',
  rainy: '雨の日向き',
  lowConsumption: '消費圧が低い',
  lowVisibility: '人目圧が低い',
};

interface FilterPanelProps {
  active: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
}

export default function FilterPanel({ active, onToggle }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className={`rounded-full px-3 py-1 text-xs border transition-all duration-150 ${
            active.has(key)
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
              : 'bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
          }`}
        >
          {FILTER_LABELS[key]}
        </button>
      ))}
    </div>
  );
}
