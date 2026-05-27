'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SEED_SPOTS } from '@/lib/seed';
import { calcAdjustedScores, calcOverallScore, getReliability } from '@/lib/scoring';
import { getLogsBySpotId } from '@/lib/storage';
import FilterPanel, { type FilterKey } from '@/components/FilterPanel';
import type { Scores, Spot } from '@/lib/types';

// Leafletはブラウザでのみ動くため dynamic import (ssr: false) とする
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-lg text-xs text-stone-500 font-mono">
      地図を読み込み中...
    </div>
  ),
});

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
    if (f === 'indoor' && !indoor) return false;
    if (f === 'work' && scores.workTolerance < 3) return false;
    if (f === 'rest' && scores.stayTolerance < 3) return false;
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

  const selectedData = useMemo(() => {
    return filtered.find((d) => d.spot.id === selectedId);
  }, [filtered, selectedId]);

  const filteredSpots = filtered.map(({ spot }) => spot);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-stone-900 tracking-wider">津田沼 滞在マップ</h1>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {filtered.length} spots matched
            </p>
          </div>
          <FilterPanel active={activeFilters} onToggle={toggleFilter} />
        </div>

        {/* メインの Leaflet マップ領域 (高さを十分にとる) */}
        <div className="w-full h-[55vh] min-h-[380px] mb-6">
          <LeafletMap
            spots={filteredSpots}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
          />
        </div>

        {/* 選択されたスポットの簡潔なカード表示 */}
        <div className="min-h-[140px]">
          {selectedData ? (
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm transition-all duration-300">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-100 rounded text-stone-600">
                      {selectedData.spot.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {selectedData.spot.indoor ? '屋内' : '屋外'} · {selectedData.spot.price}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-stone-900">{selectedData.spot.name}</h2>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-amber-600">
                    {calcOverallScore(selectedData.scores)}
                  </div>
                  <div className="text-[9px] font-mono text-stone-400">STAY SCORE</div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-2">
                {selectedData.spot.description}
              </p>

              <div className="flex justify-between items-center border-t border-stone-100 pt-3">
                <span className="text-[10px] font-mono text-stone-400">
                  信頼度: {getReliability(selectedData.logCount)}（ログ: {selectedData.logCount}件）
                </span>
                <Link
                  href={`/spots/${selectedData.spot.id}`}
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium tracking-wide underline decoration-amber-300 decoration-2 underline-offset-4"
                >
                  詳細・ログを記録する →
                </Link>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-stone-200 rounded-lg py-12 text-center text-stone-400">
              <span className="text-amber-500 font-mono text-base mb-1 block">◎</span>
              <p className="text-xs font-mono">地図上のピンを選択すると詳細が表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
