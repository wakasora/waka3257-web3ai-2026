'use client';

export type FilterKey = 'free' | 'indoor' | 'work' | 'rest';

const FILTER_LABELS: Record<FilterKey, string> = {
  free: '無料・低価格',
  indoor: '屋内',
  work: '作業向き',
  rest: '休憩向き',
};

interface FilterPanelProps {
  active: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
}

export default function FilterPanel({ active, onToggle }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => {
        const isSelected = active.has(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`rounded px-3 py-1 text-xs font-medium border transition-all ${
              isSelected
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900'
            }`}
          >
            {FILTER_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}
