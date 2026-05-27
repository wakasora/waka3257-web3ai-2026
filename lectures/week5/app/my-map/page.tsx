'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadLogs } from '@/lib/storage';
import { SEED_SPOTS } from '@/lib/seed';
import type { StayLog } from '@/lib/types';

const ACTIVITY_LABELS: Record<string, string> = {
  work: '作業', reading: '読書', rest: '休憩',
  waiting: '待機', spacing_out: 'ぼーっとする', conversation: '会話', eating: '食事',
};
const SCOPE_LABELS: Record<string, string> = {
  private: '🔒', friends: '👥', area_only: '📍', public: '🌐',
};

interface SpotSummary {
  spot: typeof SEED_SPOTS[0];
  logs: StayLog[];
  lastVisit: string;
  avgComfort: number;
}

export default function MyMapPage() {
  const [summaries, setSummaries] = useState<SpotSummary[]>([]);

  useEffect(() => {
    const all = loadLogs();
    const grouped: Record<string, StayLog[]> = {};
    for (const log of all) {
      if (!grouped[log.spotId]) grouped[log.spotId] = [];
      grouped[log.spotId].push(log);
    }
    const result: SpotSummary[] = Object.entries(grouped)
      .map(([spotId, logs]) => {
        const spot = SEED_SPOTS.find((s) => s.id === spotId);
        if (!spot) return null;
        const sorted = [...logs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const avgComfort =
          Math.round((logs.reduce((s, l) => s + l.comfort, 0) / logs.length) * 10) / 10;
        return { spot, logs: sorted, lastVisit: sorted[0].createdAt, avgComfort };
      })
      .filter(Boolean) as SpotSummary[];
    result.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
    setSummaries(result);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-wider text-stone-900">マイマップ</h1>
          <p className="text-xs text-stone-400 font-mono mt-0.5">Your recorded spots</p>
        </div>

        {summaries.length === 0 ? (
          <div className="border border-dashed border-stone-200 rounded-lg py-16 text-center bg-white">
            <span className="text-amber-500 font-mono text-base block mb-1">◎</span>
            <p className="text-xs text-stone-500 mb-4">まだ滞在記録がありません</p>
            <Link
              href="/map"
              className="text-xs text-amber-700 hover:text-amber-800 font-medium underline decoration-amber-300 underline-offset-4"
            >
              マップを開く →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {summaries.map(({ spot, logs, lastVisit, avgComfort }) => {
              const activities = [...new Set(logs.map((l) => ACTIVITY_LABELS[l.activity]))];

              return (
                <div
                  key={spot.id}
                  className="rounded border border-stone-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        href={`/spots/${spot.id}`}
                        className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                      >
                        {spot.name}
                      </Link>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {spot.category} · {spot.area}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-amber-600">{avgComfort}</div>
                      <div className="text-[8px] font-mono text-stone-400">COMFORT</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2.5 text-[10px] text-stone-400 font-mono">
                    <span>
                      最終訪問: {new Date(lastVisit).toLocaleDateString('ja-JP')}
                    </span>
                    <span>
                      ログ: {logs.length}件
                    </span>
                  </div>

                  {/* 記録したアクティビティ */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {activities.map((act) => (
                      <span
                        key={act}
                        className="text-[9px] text-stone-600 bg-stone-100 rounded px-1.5 py-0.5"
                      >
                        {act}
                      </span>
                    ))}
                  </div>

                  {/* 直近のログメモ */}
                  {logs.filter((l) => l.memo).slice(0, 1).map((log) => (
                    <div key={log.id} className="border-t border-stone-100 pt-2.5 mt-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] text-stone-400">{SCOPE_LABELS[log.scope]}</span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(log.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{log.memo}</p>
                    </div>
                  ))}

                  <div className="mt-3 text-right">
                    <Link
                      href={`/spots/${spot.id}`}
                      className="text-xs text-amber-700 hover:text-amber-800 font-medium underline decoration-amber-200 underline-offset-4"
                    >
                      詳細・追加ログ →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
