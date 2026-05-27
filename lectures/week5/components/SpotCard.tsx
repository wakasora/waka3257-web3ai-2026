import Link from 'next/link';
import type { Spot } from '@/lib/types';
import type { Scores } from '@/lib/types';
import { calcOverallScore, getReliability } from '@/lib/scoring';

interface SpotCardProps {
  spot: Spot;
  scores: Scores;
  logCount: number;
  selected?: boolean;
  onClick?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  図書館: '📚',
  商業施設: '🏬',
  イートイン: '🥤',
  公園: '🌿',
  公共施設: '🏛️',
  カフェ: '☕',
  その他: '📍',
};

const PRICE_STYLES: Record<string, string> = {
  無料: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40',
  低価格: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
  有料: 'text-stone-400 bg-stone-800/60 border border-stone-700/40',
};

export default function SpotCard({ spot, scores, logCount, selected, onClick }: SpotCardProps) {
  const overall = calcOverallScore(scores);
  const reliability = getReliability(logCount);

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-amber-500/60 bg-stone-800/80 shadow-lg shadow-amber-900/20'
          : 'border-stone-800 bg-stone-900/60 hover:border-stone-700 hover:bg-stone-800/60'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{CATEGORY_ICONS[spot.category] ?? '📍'}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-stone-100 truncate">{spot.name}</h3>
            <p className="text-xs text-stone-500">{spot.category} · {spot.area}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-mono font-bold text-amber-400">{overall}</div>
          <div className="text-xs text-stone-600">/ 100</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`rounded-full px-2 py-0.5 text-xs ${PRICE_STYLES[spot.price]}`}>
          {spot.price}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs border ${spot.indoor ? 'text-sky-400 bg-sky-950/50 border-sky-800/40' : 'text-lime-400 bg-lime-950/50 border-lime-800/40'}`}>
          {spot.indoor ? '屋内' : '屋外'}
        </span>
        <span className="rounded-full px-2 py-0.5 text-xs text-stone-400 bg-stone-800/60 border border-stone-700/40">
          {spot.stayDuration}
        </span>
        <span className="rounded-full px-2 py-0.5 text-xs text-stone-500 bg-stone-800/40 border border-stone-700/30">
          信頼度: {reliability}
        </span>
      </div>

      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-3">
        {spot.description}
      </p>

      <Link
        href={`/spots/${spot.id}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-block text-xs text-amber-400 hover:text-amber-300 transition-colors border-b border-amber-800/40 hover:border-amber-400/40"
      >
        詳細を見る →
      </Link>
    </div>
  );
}
