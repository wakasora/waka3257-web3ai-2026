'use client';
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { SEED_SPOTS } from '@/lib/seed';
import { calcAdjustedScores, calcOverallScore, getReliability } from '@/lib/scoring';
import { getLogsBySpotId } from '@/lib/storage';
import FilterPanel, { type FilterKey } from '@/components/FilterPanel';
import ScoreBar from '@/components/ScoreBar';
import StayLogForm from '@/components/StayLogForm';
import StayLogList from '@/components/StayLogList';
import type { Scores, Spot, StayLog } from '@/lib/types';

// Leaflet dynamic load (ssr: false)
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-xs text-stone-400 font-mono">
      地図を読み込み中...
    </div>
  ),
});

function getCanDo(spot: Spot, scores: Scores): string[] {
  const list: string[] = [];
  if (scores.workTolerance >= 3.5) list.push('PC作業・勉強');
  if (scores.stayTolerance >= 3.5) list.push('長時間の読書や休憩');
  if (spot.price === '無料') list.push('お金をかけずに滞在');
  if (spot.indoor) list.push('天候を気にせず過ごす');
  if (list.length === 0) list.push('短時間の休憩・時間つぶし');
  return list;
}

function getCannotDo(spot: Spot, scores: Scores): string[] {
  const list: string[] = [];
  if (scores.workTolerance < 2.5) list.push('集中した長時間のPC作業');
  if (scores.visibilityPressure >= 3.5) list.push('周囲の目を気にせずくつろぐ');
  if (spot.price === '有料') list.push('お金をかけない長居');
  if (!spot.indoor) list.push('雨天や過酷な気温下での利用');
  if (list.length === 0) list.push('特になし');
  return list;
}

function matchesFilter(
  scores: Scores,
  indoor: boolean,
  price: string,
  filters: Set<FilterKey>
): boolean {
  if (filters.size === 0) return true;
  for (const f of filters) {
    if (f === 'free' && price !== '無料') return false;
    if (f === 'alone' && scores.visibilityPressure > 3) return false;
    if (f === 'work' && scores.workTolerance < 3) return false;
    if (f === 'rain' && !indoor) return false;
  }
  return true;
}

function MapPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') as FilterKey | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);
  const [spotLogs, setSpotLogs] = useState<Record<string, StayLog[]>>({});

  // クエリパラメータから検索語とフィルターの初期状態を設定
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialFilter) {
      setActiveFilters(new Set([initialFilter]));
    }
  }, [initialFilter]);

  const reloadLogs = useCallback(() => {
    const logsMap: Record<string, StayLog[]> = {};
    SEED_SPOTS.forEach((spot) => {
      logsMap[spot.id] = getLogsBySpotId(spot.id);
    });
    setSpotLogs(logsMap);
  }, []);

  useEffect(() => {
    reloadLogs();
  }, [reloadLogs, refreshKey]);

  const spotDataList = useMemo(() => {
    return SEED_SPOTS.map((spot) => {
      const logs = spotLogs[spot.id] || [];
      const scores = calcAdjustedScores(spot, logs);
      return { spot, scores, logCount: logs.length };
    });
  }, [spotLogs]);

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return spotDataList.filter(({ spot, scores }) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters = matchesFilter(scores, spot.indoor, spot.price, activeFilters);
      return matchesSearch && matchesFilters;
    });
  }, [spotDataList, searchQuery, activeFilters]);

  const selectedData = useMemo(() => {
    return spotDataList.find((d) => d.spot.id === selectedId);
  }, [spotDataList, selectedId]);

  const filteredSpotsOnly = useMemo(() => {
    return filtered.map(({ spot }) => spot);
  }, [filtered]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-48px)] overflow-hidden bg-stone-50">
      
      {/* 左サイドパネル */}
      <div className="w-full md:w-[380px] flex-shrink-0 bg-white border-r border-stone-200 flex flex-col h-full overflow-hidden">
        
        {selectedData ? (
          /* 詳細モード */
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-stone-150 flex items-center justify-between">
              <button
                onClick={() => setSelectedId(null)}
                className="text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors"
              >
                ← スポット一覧に戻る
              </button>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-100 rounded text-stone-500">
                {selectedData.spot.category}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-900 leading-tight">
                    {selectedData.spot.name}
                  </h2>
                  <p className="text-[10px] text-stone-400 mt-1 font-mono">
                    {selectedData.spot.indoor ? '屋内' : '屋外'} · {selectedData.spot.price} · {selectedData.spot.stayDuration}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-mono font-bold text-amber-600 leading-none">
                    {calcOverallScore(selectedData.scores)}
                  </div>
                  <span className="text-[8px] font-mono text-stone-400">STAY SCORE</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 rounded p-3 border border-stone-100 font-light">
                {selectedData.spot.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-stone-100 pt-4">
                <div>
                  <h4 className="font-semibold text-amber-700 mb-1 text-[11px]">◎ できること</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 space-y-0.5 font-light">
                    {getCanDo(selectedData.spot, selectedData.scores).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-500 mb-1 text-[11px]">× 向いていないこと</h4>
                  <ul className="list-disc list-inside text-[11px] text-stone-600 space-y-0.5 font-light">
                    {getCannotDo(selectedData.spot, selectedData.scores).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-1">
                <ScoreBar label="消費圧（低いほど良）" value={selectedData.scores.consumptionPressure} max={5} />
                <ScoreBar label="作業許容度" value={selectedData.scores.workTolerance} max={5} />
                <ScoreBar label="目的要求度（低いほど良）" value={selectedData.scores.purposePressure} max={5} />
                <ScoreBar label="人目圧（低いほど良）" value={selectedData.scores.visibilityPressure} max={5} />
                <ScoreBar label="滞在許容時間" value={selectedData.scores.stayTolerance} max={5} />
                <ScoreBar label="天候耐性" value={selectedData.scores.weatherResistance} max={5} />
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-stone-700 tracking-wider">LOGS</h3>
                  <span className="text-[9px] font-mono text-stone-400">
                    信頼度: {getReliability(selectedData.logCount)} ({selectedData.logCount}件)
                  </span>
                </div>
                
                <StayLogForm spotId={selectedData.spot.id} onSaved={reloadLogs} />
                
                <StayLogList logs={spotLogs[selectedData.spot.id] || []} />
              </div>

            </div>
          </div>
        ) : (
          /* 一覧・探索モード */
          <div className="flex flex-col h-full overflow-hidden p-5 space-y-5">
            <div>
              <h1 className="text-base font-semibold text-stone-900 tracking-wider">津田沼 滞在探索</h1>
              <p className="text-[10px] text-stone-400 font-mono">Find your urban breathing space</p>
            </div>

            <input
              type="text"
              placeholder="スポット名や特徴で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
            />

            <FilterPanel active={activeFilters} onToggle={toggleFilter} />

            <div className="p-3 bg-stone-50 border border-stone-150 rounded">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[10px] font-bold text-stone-600 tracking-wider">街の平均滞在しやすさ</span>
                <span className="text-xs font-mono font-bold text-stone-900">47 / 100</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                作業スペースは点在しますが、無料で理由なく居られる場所は極めて限られます。
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-[10px] font-mono text-stone-400 mb-1">
                {filtered.length} SPOTS FOUND
              </p>
              {filtered.map(({ spot, scores }) => (
                <div
                  key={spot.id}
                  onClick={() => setSelectedId(spot.id)}
                  className="p-3 rounded border border-stone-200 bg-white hover:border-stone-300 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold text-stone-900">
                      {spot.name}
                    </h3>
                    <p className="text-[9px] text-stone-400 font-mono">
                      {spot.category} · {spot.price} · {spot.indoor ? '屋内' : '屋外'}
                    </p>
                  </div>
                  <div className="text-right pl-3 flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-amber-600">
                      {calcOverallScore(scores)}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-stone-400 text-center py-8 font-mono">
                  No spots matched
                </p>
              )}
            </div>

          </div>
        )}

      </div>

      {/* 右メインマップ */}
      <div className="flex-1 h-full relative">
        <LeafletMap
          spots={filteredSpotsOnly}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id === selectedId ? null : id)}
        />
      </div>

    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-48px)] items-center justify-center bg-stone-50 text-xs text-stone-400 font-mono">
        マップアプリを起動中...
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
