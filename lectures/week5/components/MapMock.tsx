'use client';
import type { Spot, Scores } from '@/lib/types';

interface MapMockProps {
  spots: Spot[];
  scores: Record<string, Scores>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  図書館: '#f59e0b',
  商業施設: '#64748b',
  イートイン: '#a78bfa',
  公園: '#4ade80',
  公共施設: '#38bdf8',
  カフェ: '#fb923c',
  その他: '#94a3b8',
};

export default function MapMock({ spots, selectedId, onSelect }: MapMockProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-stone-800 bg-stone-950"
      style={{ paddingTop: '60%' }}>
      {/* 背景：グリッドで地図っぽく */}
      <div className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}>
        {/* 道路風のライン */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-700/50" />
        <div className="absolute top-[35%] left-0 right-0 h-px bg-stone-700/30" />
        <div className="absolute top-[65%] left-0 right-0 h-px bg-stone-700/30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-700/50" />
        <div className="absolute left-[30%] top-0 bottom-0 w-px bg-stone-700/30" />
        <div className="absolute left-[70%] top-0 bottom-0 w-px bg-stone-700/30" />

        {/* 駅ラベル */}
        <div className="absolute top-[46%] left-[44%] flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-500/80 border border-amber-400/60" />
          <span className="text-[10px] text-amber-400/80 font-mono whitespace-nowrap">津田沼駅</span>
        </div>

        {/* スポットピン */}
        {spots.map((spot) => {
          const isSelected = spot.id === selectedId;
          const color = CATEGORY_COLORS[spot.category] ?? '#94a3b8';
          return (
            <button
              key={spot.id}
              onClick={() => onSelect(spot.id)}
              title={spot.name}
              style={{ left: `${spot.mapX}%`, top: `${spot.mapY}%` }}
              className="absolute -translate-x-1/2 -translate-y-full group"
            >
              {/* ピン */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`transition-all duration-200 rounded-full border-2 flex items-center justify-center font-bold text-[10px] text-stone-950 ${
                    isSelected
                      ? 'w-8 h-8 shadow-lg scale-125'
                      : 'w-6 h-6 opacity-80 hover:opacity-100 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: color,
                    borderColor: isSelected ? '#fff' : color,
                    boxShadow: isSelected ? `0 0 12px ${color}80` : undefined,
                  }}
                >
                  {isSelected ? '◎' : '●'}
                </div>
                <div
                  className="w-px h-2"
                  style={{ backgroundColor: color, opacity: isSelected ? 1 : 0.6 }}
                />
                {/* ホバーでラベル表示 */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-stone-900 border border-stone-700 rounded px-2 py-1 whitespace-nowrap">
                    <span className="text-[10px] text-stone-200">{spot.name}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="absolute bottom-2 left-2 bg-stone-950/80 border border-stone-800 rounded-lg p-2">
        <p className="text-[9px] text-stone-500 mb-1 font-mono">LEGEND</p>
        {Object.entries(CATEGORY_COLORS).slice(0, 5).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[9px] text-stone-500">{cat}</span>
          </div>
        ))}
      </div>

      {/* スケール */}
      <div className="absolute bottom-2 right-2 text-[9px] text-stone-600 font-mono">
        津田沼駅周辺 ≈ 1km圏
      </div>
    </div>
  );
}
