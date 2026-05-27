import type { StayLog } from '@/lib/types';

const ACTIVITY_LABELS: Record<string, string> = {
  work: '作業',
  reading: '読書',
  rest: '休憩',
  waiting: '待機',
  spacing_out: 'ぼーっとする',
  conversation: '会話',
  eating: '食事',
};

const DURATION_LABELS: Record<string, string> = {
  '5min': '5分',
  '15min': '15分',
  '30min': '30分',
  '1hour': '1時間',
  '2hour_plus': '2時間以上',
};

const SCOPE_LABELS: Record<string, string> = {
  private: '🔒 プライベート',
  friends: '👥 フレンド',
  area_only: '📍 エリア限定',
  public: '🌐 全体',
};

interface StayLogListProps {
  logs: StayLog[];
}

export default function StayLogList({ logs }: StayLogListProps) {
  if (logs.length === 0) {
    return (
      <p className="text-xs text-stone-400 py-6 text-center font-mono">
        no logs recorded
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div key={log.id} className="rounded border border-stone-200 bg-white p-4">
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-stone-800">
                {ACTIVITY_LABELS[log.activity] ?? log.activity}
              </span>
              <span className="text-stone-300 text-[10px]">|</span>
              <span className="text-xs text-stone-500">{DURATION_LABELS[log.duration] ?? log.duration}</span>
              <span className="text-stone-300 text-[10px]">|</span>
              <span className="text-[10px] text-stone-400 font-mono">{SCOPE_LABELS[log.scope]}</span>
            </div>
            <time className="text-[10px] text-stone-400 font-mono">
              {new Date(log.createdAt).toLocaleDateString('ja-JP')}
            </time>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2 text-[10px] text-stone-400 font-mono">
            <span>居心地:{log.comfort}</span>
            <span>消費圧:{log.consumptionPressure}</span>
            <span>作業許容:{log.workTolerance}</span>
            <span>人目圧:{log.visibilityPressure}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {log.canOpenPC && (
              <span className="text-[9px] text-stone-600 bg-stone-100 rounded px-1.5 py-0.5">
                PC可
              </span>
            )}
            {log.weatherEscape && (
              <span className="text-[9px] text-stone-600 bg-stone-100 rounded px-1.5 py-0.5">
                雨避け
              </span>
            )}
            {log.wantToReturn && (
              <span className="text-[9px] text-amber-800 bg-amber-100 rounded px-1.5 py-0.5 font-medium">
                また来たい
              </span>
            )}
            {log.spentAmount !== '0' && (
              <span className="text-[9px] text-stone-500 bg-stone-100 rounded px-1.5 py-0.5">
                {log.spentAmount === '~300' ? '〜300円' : log.spentAmount === '~700' ? '〜700円' : '1000円+'}
              </span>
            )}
          </div>

          {log.memo && (
            <p className="text-xs text-stone-600 leading-relaxed mt-2 border-t border-stone-100 pt-2">
              {log.memo}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
