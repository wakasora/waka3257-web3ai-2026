'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/map?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/map');
    }
  };

  return (
    <main className="min-h-[calc(100vh-48px)] bg-stone-50 text-stone-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-10 text-center">
        
        {/* ロゴと見出し */}
        <div className="space-y-3">
          <span className="text-amber-500 font-mono text-4xl font-bold block">◎</span>
          <h1 className="text-2xl font-bold tracking-widest text-stone-900">滞在地図</h1>
          <p className="text-xs text-stone-500 font-light tracking-wide">
            街の中で、ただ居られる場所を探す。
          </p>
        </div>

        {/* 検索バー */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="駅名、場所、目的で探す..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-850 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              className="rounded bg-stone-900 hover:bg-stone-800 text-white px-5 text-xs font-semibold tracking-wide transition-colors"
            >
              探す
            </button>
          </div>

          <div className="text-right">
            <Link
              href="/map"
              className="inline-block rounded bg-amber-500 hover:bg-amber-600 text-white px-8 py-2.5 text-xs font-semibold tracking-widest transition-colors shadow-sm"
            >
              津田沼で探す (マップを開く) →
            </Link>
          </div>
        </form>

        {/* 目的タグ */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-mono text-stone-400 tracking-wider">BROWSE BY PURPOSE</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <Link
              href="/map?filter=free"
              className="rounded-full bg-white border border-stone-200 hover:border-amber-400 px-3.5 py-1 text-xs text-stone-600 transition-colors"
            >
              # 無料で座りたい
            </Link>
            <Link
              href="/map?filter=alone"
              className="rounded-full bg-white border border-stone-200 hover:border-amber-400 px-3.5 py-1 text-xs text-stone-600 transition-colors"
            >
              # 一人でいられる
            </Link>
            <Link
              href="/map?filter=work"
              className="rounded-full bg-white border border-stone-200 hover:border-amber-400 px-3.5 py-1 text-xs text-stone-600 transition-colors"
            >
              # 少し作業したい
            </Link>
            <Link
              href="/map?filter=rain"
              className="rounded-full bg-white border border-stone-200 hover:border-amber-400 px-3.5 py-1 text-xs text-stone-600 transition-colors"
            >
              # 雨を避けたい
            </Link>
          </div>
        </div>

        {/* 使い方 3ステップ */}
        <div className="border-t border-stone-200 pt-8 space-y-4 text-left">
          <p className="text-[10px] font-mono text-stone-400 tracking-wider text-center">HOW TO USE</p>
          
          <div className="grid gap-3 text-stone-700">
            <div className="bg-white border border-stone-200 rounded p-3 flex gap-3 items-center">
              <span className="font-mono font-bold text-amber-500 text-sm">1</span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900">地図で場所を探す</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">現在地やピンの位置から周辺スポットを探せます。</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded p-3 flex gap-3 items-center">
              <span className="font-mono font-bold text-amber-500 text-sm">2</span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900">ピンを押して居心地を見る</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">滞在時間や作業許容度、周囲の目を視覚的に把握。</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded p-3 flex gap-3 items-center">
              <span className="font-mono font-bold text-amber-500 text-sm">3</span>
              <div>
                <h4 className="text-xs font-semibold text-stone-900">滞在ログを残す</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">実際に滞在した記録を残して、スコアに反映させます。</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
