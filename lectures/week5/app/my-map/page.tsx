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
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-100 mb-1">マイマップ</h1>
          <p className="text-xs text-stone-500">あなたが記録した滞在スポット</p>
        </div>

        {summaries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 text-stone-700">◎</p>
            <p className="text-sm text-stone-500 mb-2">まだ記録がありません</p>
            <p className="text-xs text-stone-600 mb-6">
              スポット詳細ページから滞在ログを書くと、ここに表示されます。
            </p>
            <Link
              href="/map"
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              → マップを見る
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map(({ spot, logs, lastVisit, avgComfort }) => {
              const wantReturn = logs.filter((l) => l.wantToReturn).length;
              const activities = [...new Set(logs.map((l) => ACTIVITY_LABELS[l.activity]))];

              return (
                <div
                  key={spot.id}
                  className="rounded-xl border border-stone-800 bg-stone-900/60 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={`/spots/${spot.id}`}
                        className="text-base font-semibold text-stone-100 hover:text-amber-400 transition-colors"
                      >
                        {spot.name}
                      </Link>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {spot.category} · {spot.area}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-lg font-mono font-bold text-amber-400">{avgComfort}</div>
                      <div className="text-xs text-stone-600">居心地</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-stone-500">
                    <span>
                      最終訪問:{' '}
                      <span className="text-stone-400">
                        {new Date(lastVisit).toLocaleDateString('ja-JP', {
                          month: 'long', day: 'numeric',
                        })}
                      </span>
                    </span>
                    <span>
                      ログ: <span className="text-stone-400">{logs.length}件</span>
                    </span>
                    <span>
                      また来たい:{' '}
                      <span className={wantReturn > logs.length / 2 ? 'text-emerald-400' : 'text-stone-400'}>
                        {wantReturn}/{logs.length}
                      </span>
                    </span>
                  </div>

                  {/* 記録したアクティビティ */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {activities.map((act) => (
                      <span
                        key={act}
                        className="text-xs text-stone-400 bg-stone-800/60 border border-stone-700/30 rounded-full px-2 py-0.5"
                      >
                        {act}
                      </span>
                    ))}
                  </div>

                  {/* 各ログのメモと公開範囲 */}
                  {logs.filter((l) => l.memo).slice(0, 2).map((log) => (
                    <div key={log.id} className="border-t border-stone-800 mt-3 pt-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs text-stone-600">{SCOPE_LABELS[log.scope]}</span>
                        <span className="text-xs text-stone-600">
                          {new Date(log.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">{log.memo}</p>
                    </div>
                  ))}

                  <div className="mt-3">
                    <Link
                      href={`/spots/${spot.id}`}
                      className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
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
