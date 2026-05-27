import type { Metadata } from 'next';
import AreaScoreCard from '@/components/AreaScoreCard';

export const metadata: Metadata = {
  title: '津田沼 街スコア — 滞在地図',
  description: '津田沼駅周辺の滞在しやすさ指標。',
};

const AREA_SCORES = [
  { label: '無料滞在スコア', score: 38 },
  { label: '作業スコア', score: 55 },
  { label: '休憩スコア', score: 48 },
  { label: '雨の日耐性', score: 62 },
  { label: '消費圧の低さ', score: 42 },
  { label: '目的なく居られる度', score: 35 },
];

export default function AreaPage() {
  const avgScore = Math.round(AREA_SCORES.reduce((s, a) => s + a.score, 0) / AREA_SCORES.length);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-10 text-center">
          <span className="text-amber-500 font-mono text-base font-bold">◎</span>
          <h1 className="text-lg font-semibold tracking-wider text-stone-900 mt-2">津田沼 街スコア</h1>
          <p className="text-[10px] text-stone-400 font-mono mt-0.5">Macro stayability index</p>
        </div>

        {/* 総合スコア */}
        <div className="border border-stone-200 bg-white rounded p-6 mb-8 text-center">
          <p className="text-[10px] font-mono text-stone-400 mb-1">TOTAL STAYABILITY</p>
          <div className="text-5xl font-mono font-bold text-stone-900">{avgScore}</div>
          <div className="text-[10px] font-mono text-stone-400">/ 100</div>
        </div>

        {/* 各指標 */}
        <div className="grid gap-3 sm:grid-cols-2 mb-8">
          {AREA_SCORES.map((item) => (
            <AreaScoreCard key={item.label} {...item} />
          ))}
        </div>

        {/* 批評（一言だけ） */}
        <div className="border border-stone-200 bg-white rounded p-4 text-center">
          <p className="text-xs text-stone-500 leading-relaxed">
            「津田沼は作業スペースこそ点在するが、理由なく、無料でただ佇める余白は極めて少ない。」
          </p>
        </div>
      </div>
    </div>
  );
}
