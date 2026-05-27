import type { Metadata } from 'next';
import AreaScoreCard from '@/components/AreaScoreCard';

export const metadata: Metadata = {
  title: '津田沼 街スコア — 滞在地図',
  description: '津田沼駅周辺のマクロな滞在しやすさを可視化します。',
};

const AREA_SCORES = [
  {
    label: '無料滞在スコア',
    score: 38,
    description: '無料でただ座れる場所は、まだ少ない。図書館と公共施設がほぼ唯一の選択肢。',
  },
  {
    label: '作業スコア',
    score: 55,
    description: 'カフェや図書館で作業できる場所は一定数ある。ただし混雑時や無料という条件は難しい。',
  },
  {
    label: '休憩スコア',
    score: 48,
    description: '休憩専用の場所は少なく、何かを買うか、目的がある施設を使うことになりがち。',
  },
  {
    label: '雨の日耐性',
    score: 62,
    description: '屋内施設は多い。ただし長時間無料で滞在できる雨避けスポットは限られる。',
  },
  {
    label: '消費圧の低さ',
    score: 42,
    description: '商業施設が多く、「買う」ことが前提の場所に囲まれている。意識的に選ばないと消費を促される。',
  },
  {
    label: '目的なく居られる度',
    score: 35,
    description: '最も厳しい指標。何もしないために座れる場所は都市の中で希少。津田沼もその例外ではない。',
  },
];

const REVIEWS = [
  '津田沼は、作業する場所はある。しかし、何もしないで座るには少し理由がいる。',
  '商業施設やカフェに滞在機能を頼りやすく、無料でただ居られる余白はまだ少ない。',
  '雨の日は屋内に逃げられる場所があるが、長時間無料で滞在できる場所は限られる。',
  '図書館と公共施設ロビーが、この街の「滞在できる余白」を実質的に支えている。',
];

export default function AreaPage() {
  const avgScore = Math.round(AREA_SCORES.reduce((s, a) => s + a.score, 0) / AREA_SCORES.length);

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-8">
          <p className="text-xs text-stone-500 font-mono mb-2">AREA SCORE</p>
          <h1 className="text-xl font-bold text-stone-100 mb-1">津田沼 街スコア</h1>
          <p className="text-xs text-stone-500">津田沼駅周辺のマクロな滞在しやすさ</p>
        </div>

        {/* 総合スコア */}
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-6 mb-8 text-center">
          <p className="text-xs text-amber-600 font-mono mb-2">TOTAL STAY SCORE</p>
          <div className="text-6xl font-mono font-bold text-amber-400 mb-1">{avgScore}</div>
          <div className="text-xs text-stone-500">/ 100</div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-stone-800 max-w-xs mx-auto">
            <div
              className="h-1.5 rounded-full bg-amber-500/60"
              style={{ width: `${avgScore}%` }}
            />
          </div>
        </div>

        {/* 各指標 */}
        <div className="grid gap-3 sm:grid-cols-2 mb-10">
          {AREA_SCORES.map((item) => (
            <AreaScoreCard key={item.label} {...item} />
          ))}
        </div>

        {/* 批評文 */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-5">
          <h2 className="text-xs font-mono text-stone-500 tracking-widest mb-4">CRITIC</h2>
          <div className="space-y-3">
            {REVIEWS.map((text, i) => (
              <p key={i} className="text-sm text-stone-400 leading-relaxed border-l-2 border-stone-700 pl-3">
                {text}
              </p>
            ))}
          </div>
          <p className="text-xs text-stone-600 mt-4">
            ※ このスコアは seed data に基づく定性評価です。ログが蓄積されると更新される予定。
          </p>
        </div>
      </div>
    </div>
  );
}
