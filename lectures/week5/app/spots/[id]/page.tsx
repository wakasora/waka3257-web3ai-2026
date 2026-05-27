'use client';
import { useState, useEffect, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SEED_SPOTS } from '@/lib/seed';
import { calcAdjustedScores, getReliability } from '@/lib/scoring';
import { getLogsBySpotId } from '@/lib/storage';
import ScoreBar from '@/components/ScoreBar';
import StayLogForm from '@/components/StayLogForm';
import StayLogList from '@/components/StayLogList';
import type { StayLog } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function SpotDetailPage({ params }: Props) {
  const [spotId, setSpotId] = useState<string>('');
  const [logs, setLogs] = useState<StayLog[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    params.then(({ id }) => setSpotId(id));
  }, [params]);

  const reload = useCallback(() => {
    if (spotId) setLogs(getLogsBySpotId(spotId));
    setRefreshKey((k) => k + 1);
  }, [spotId]);

  useEffect(() => {
    reload();
  }, [reload]);

  if (!spotId) return null;

  const spot = SEED_SPOTS.find((s) => s.id === spotId);
  if (!spot) notFound();

  const scores = calcAdjustedScores(spot, logs);
  const reliability = getReliability(logs.length);

  const PRICE_COLORS: Record<string, string> = {
    無料: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30',
    低価格: 'text-amber-400 border-amber-800/40 bg-amber-950/30',
    有料: 'text-stone-400 border-stone-700/40 bg-stone-800/30',
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* パンくず */}
        <Link href="/map" className="text-xs text-stone-500 hover:text-stone-400 transition-colors mb-4 inline-block">
          ← マップに戻る
        </Link>

        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-stone-500">{spot.category}</span>
            <span className="text-stone-700">·</span>
            <span className="text-xs text-stone-500">{spot.area}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-100 mb-3">{spot.name}</h1>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs border ${PRICE_COLORS[spot.price]}`}>
              {spot.price}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs border ${
              spot.indoor
                ? 'text-sky-400 border-sky-800/40 bg-sky-950/30'
                : 'text-lime-400 border-lime-800/40 bg-lime-950/30'
            }`}>
              {spot.indoor ? '屋内' : '屋外'}
            </span>
            <span className="rounded-full px-3 py-1 text-xs border border-stone-700/40 bg-stone-800/30 text-stone-400">
              目安 {spot.stayDuration}
            </span>
          </div>
        </div>

        {/* 批評文 */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 mb-6">
          <p className="text-sm text-stone-300 leading-relaxed">{spot.description}</p>
        </div>

        {/* スコア */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-200">評価スコア</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">信頼度</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                reliability === '高'
                  ? 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30'
                  : reliability === '中'
                  ? 'text-amber-400 border-amber-800/40 bg-amber-950/30'
                  : 'text-stone-400 border-stone-700/40 bg-stone-800/30'
              }`}>
                {reliability}（{logs.length}件）
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <ScoreBar label="消費圧" value={scores.consumptionPressure} inverse />
            <ScoreBar label="作業許容度" value={scores.workTolerance} />
            <ScoreBar label="目的要求度" value={scores.purposePressure} inverse />
            <ScoreBar label="人目圧" value={scores.visibilityPressure} inverse />
            <ScoreBar label="滞在許容時間" value={scores.stayTolerance} />
            <ScoreBar label="天候耐性" value={scores.weatherResistance} />
            <ScoreBar label="壊れやすさ" value={scores.fragility} inverse />
          </div>

          <p className="text-xs text-stone-600 mt-4">
            ※ ログ{logs.length}件で補正済み。ログが増えるほど実態に近づきます。
          </p>
        </div>

        {/* 滞在ログ */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-200 mb-3">
            滞在ログ
            <span className="text-stone-600 font-normal ml-2">({logs.length}件)</span>
          </h2>
          <StayLogList key={refreshKey} logs={logs} />
        </div>

        {/* 投稿フォーム */}
        <StayLogForm spotId={spot.id} onSaved={reload} />
      </div>
    </div>
  );
}
