'use client';
import { useState, useMemo } from 'react';
import { SEED_SPOTS } from '@/lib/seed';
import { calcAdjustedScores } from '@/lib/scoring';
import { getLogsBySpotId } from '@/lib/storage';
import SpotCard from '@/components/SpotCard';
import MapMock from '@/components/MapMock';
import FilterPanel, { type FilterKey } from '@/components/FilterPanel';
import type { Scores } from '@/lib/types';

function useSpotData() {
  return useMemo(() => {
    return SEED_SPOTS.map((spot) => {
      const logs = getLogsBySpotId(spot.id);
      const scores = calcAdjustedScores(spot, logs);
      return { spot, scores, logCount: logs.length };
    });
  }, []);
}

function matchesFilter(
  scores: Scores,
  indoor: boolean,
  price: string,
  filters: Set<FilterKey>
): boolean {
  if (filters.size === 0) return true;
  for (const f of filters) {
    if (f === 'free' && price === '有料') return false;
    if (f === 'work' && scores.workTolerance < 3) return false;
    if (f === 'rest' && scores.stayTolerance < 3) return false;
    if (f === 'waiting' && scores.purposePressure > 3) return false;
    if (f === 'indoor' && !indoor) return false;
    if (f === 'rainy' && scores.weatherResistance < 4) return false;
    if (f === 'lowConsumption' && scores.consumptionPressure > 2) return false;
    if (f === 'lowVisibility' && scores.visibilityPressure > 2) return false;
  }
  return true;
}

export default function MapPage() {
  const data = useSpotData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filtered = data.filter(({ spot, scores }) =>
    matchesFilter(scores, spot.indoor, spot.price, activeFilters)
  );

  const scoresMap: Record<string, Scores> = {};
  data.forEach(({ spot, scores }) => { scoresMap[spot.id] = scores; });

  const filteredSpots = filtered.map(({ spot }) => spot);

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-100 mb-1">津田沼 滞在マップ</h1>
          <p className="text-xs text-stone-500">
            {filtered.length} / {data.length} スポット表示中
          </p>
        </div>

        {/* フィルター */}
        <div className="mb-6">
          <FilterPanel active={activeFilters} onToggle={toggleFilter} />
        </div>

        {/* マップ */}
        <div className="mb-6">
          <MapMock
            spots={filteredSpots}
            scores={scoresMap}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          />
        </div>

        {/* スポットカード一覧 */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(({ spot, scores, logCount }) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              scores={scores}
              logCount={logCount}
              selected={spot.id === selectedId}
              onClick={() => setSelectedId(spot.id === selectedId ? null : spot.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-stone-600">
            <p className="text-4xl mb-3">◎</p>
            <p className="text-sm">条件に合うスポットがありません</p>
            <button
              onClick={() => setActiveFilters(new Set())}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
