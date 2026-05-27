import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '滞在地図 — 都市の余白を記録する',
  description:
    '街は目的を要請してくる。でも、私たちはただ滞在したいだけだ。作業・休憩・待機・何もしない時間のための地図。',
};

const SCORE_AXES = [
  {
    key: 'consumptionPressure',
    label: '消費圧',
    desc: 'お金を使わないと居づらい感覚。低いほど、財布を気にせず滞在できる。',
    inverse: true,
  },
  {
    key: 'workTolerance',
    label: '作業許容度',
    desc: 'PCや読書など、何かに集中できる環境かどうか。高いほど作業に向く。',
    inverse: false,
  },
  {
    key: 'purposePressure',
    label: '目的要求度',
    desc: '「何かを買う」「何かをする」という理由が必要な場所かどうか。低いほど、理由なく居られる。',
    inverse: true,
  },
  {
    key: 'visibilityPressure',
    label: '人目圧',
    desc: '他者の視線を意識する度合い。低いほど、周りを気にせず過ごせる。',
    inverse: true,
  },
  {
    key: 'stayTolerance',
    label: '滞在許容時間',
    desc: '場の空気として、どれくらいの時間居ていいか。高いほど長居できる。',
    inverse: false,
  },
  {
    key: 'weatherResistance',
    label: '天候耐性',
    desc: '雨・猛暑・寒さなどから守られているか。高いほど天候に左右されない。',
    inverse: false,
  },
  {
    key: 'fragility',
    label: '壊れやすさ',
    desc: '混雑・閉鎖・撤去などのリスク。低いほど安定して使える場所。',
    inverse: true,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[200px] bg-emerald-900/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-amber-400/60 font-mono text-xs tracking-widest">◎ TSUDANUMA</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-stone-100">滞在</span>
            <span className="text-amber-400">地図</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-400 mb-4 leading-relaxed font-light">
            街は目的を要請してくる。<br />
            <span className="text-stone-300">でも、私たちはただ滞在したいだけだ。</span>
          </p>

          <p className="text-sm text-stone-500 max-w-lg mx-auto mb-10 leading-relaxed">
            滞在地図は、作業・休憩・待機・何もしない時間のための地図です。
            場所そのものではなく、<strong className="text-stone-400 font-medium">そこにどのように居られるか</strong>を記録します。
          </p>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 hover:border-amber-400/60 px-6 py-3 text-amber-300 font-medium transition-all duration-200"
          >
            津田沼の滞在地図を見る
            <span className="text-amber-500">→</span>
          </Link>
        </div>
      </section>

      {/* 評価軸の説明 */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-2">Score Axes</h2>
          <p className="text-stone-300 text-sm">この地図が使う7つの評価軸</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SCORE_AXES.map((axis) => (
            <div
              key={axis.key}
              className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  axis.inverse
                    ? 'text-rose-400 border-rose-800/40 bg-rose-950/30'
                    : 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30'
                }`}>
                  {axis.inverse ? '低いほど良' : '高いほど良'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-stone-200 mb-1">{axis.label}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{axis.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-600 mb-4 font-mono">まずは津田沼で試している</p>
          <div className="flex justify-center gap-4">
            <Link href="/map" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              → マップを見る
            </Link>
            <Link href="/area" className="text-sm text-stone-400 hover:text-stone-300 transition-colors">
              → 街スコアを見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
