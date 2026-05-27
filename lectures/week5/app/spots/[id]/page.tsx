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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* ナビゲーション */}
        <Link href="/map" className="text-xs text-stone-400 hover:text-stone-600 transition-colors mb-6 inline-block font-mono">
          ← BACK TO MAP
        </Link>

        {/* ヘッダー情報 */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400 mb-1">
            <span>{spot.category}</span>
            <span>·</span>
            <span>{spot.area}</span>
          </div>
          <h1 className="text-xl font-semibold text-stone-900 mb-3">{spot.name}</h1>
          
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 font-mono">
              {spot.price}
            </span>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 font-mono">
              {spot.indoor ? '屋内' : '屋外'}
            </span>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 font-mono">
              目安 {spot.stayDuration}
            </span>
          </div>
        </div>

        {/* 簡潔な批評文 */}
        <div className="border border-stone-200 bg-white rounded p-4 mb-6">
          <p className="text-xs text-stone-600 leading-relaxed font-light">{spot.description}</p>
        </div>

        {/* スコア一覧 */}
        <div className="border border-stone-200 bg-white rounded p-5 mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <h2 className="text-xs font-bold tracking-wider text-stone-700">STAY SCORES</h2>
            <span className="text-[10px] font-mono text-stone-400">
              信頼度: {reliability} ({logs.length} logs)
            </span>
          </div>

          <div className="space-y-1">
            <ScoreBar label="消費圧" value={scores.consumptionPressure} inverse />
            <ScoreBar label="作業許容度" value={scores.workTolerance} />
            <ScoreBar label="目的要求度" value={scores.purposePressure} inverse />
            <ScoreBar label="人目圧" value={scores.visibilityPressure} inverse />
            <ScoreBar label="滞在許容時間" value={scores.stayTolerance} />
            <ScoreBar label="天候耐性" value={scores.weatherResistance} />
            <ScoreBar label="壊れやすさ" value={scores.fragility} inverse />
          </div>
        </div>

        {/* 滞在ログセクション */}
        <div className="mb-8">
          <h2 className="text-xs font-bold tracking-wider text-stone-700 mb-3">LOGS</h2>
          <StayLogList key={refreshKey} logs={logs} />
        </div>

        {/* 投稿フォーム */}
        <StayLogForm spotId={spot.id} onSaved={reload} />
      </div>
    </div>
  );
}
