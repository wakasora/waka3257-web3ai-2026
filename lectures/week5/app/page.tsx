import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '滞在地図 — 都市の余白を見つける',
  description: '作業・休憩・待機・何もしない時間のための地図。',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-8">
        {/* ロゴ・シンボル */}
        <div className="flex justify-center">
          <span className="text-amber-500 font-mono text-3xl font-bold">◎</span>
        </div>

        {/* コピー */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-wider text-stone-900">滞在地図</h1>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
            作業、休憩、あるいはただ時間を過ごすための、都市の余白を見つける地図。
          </p>
        </div>

        {/* CTAボタン */}
        <div>
          <Link
            href="/map"
            className="inline-block rounded border border-stone-300 bg-white px-8 py-3 text-xs font-semibold tracking-widest text-stone-800 hover:border-amber-500 hover:bg-amber-50/30 transition-all duration-200"
          >
            地図を開く
          </Link>
        </div>

        {/* サブリンク */}
        <div className="flex justify-center gap-6 pt-4 text-xs font-mono text-stone-400">
          <Link href="/my-map" className="hover:text-stone-600 transition-colors">
            マイマップ
          </Link>
          <span>·</span>
          <Link href="/area" className="hover:text-stone-600 transition-colors">
            街スコア
          </Link>
        </div>
      </div>
    </main>
  );
}
