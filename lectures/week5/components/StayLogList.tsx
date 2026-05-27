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
  friends: '👥 フレンドのみ',
  area_only: '📍 エリア公開',
  public: '🌐 全体公開',
};

interface StayLogListProps {
  logs: StayLog[];
}

export default function StayLogList({ logs }: StayLogListProps) {
  if (logs.length === 0) {
    return (
      <p className="text-xs text-stone-600 py-4 text-center">
        まだ滞在ログがありません。
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-stone-200">
                {ACTIVITY_LABELS[log.activity] ?? log.activity}
              </span>
              <span className="text-xs text-stone-500">·</span>
              <span className="text-xs text-stone-400">{DURATION_LABELS[log.duration] ?? log.duration}</span>
              <span className="text-xs text-stone-500">·</span>
              <span className="text-xs text-stone-500">{SCOPE_LABELS[log.scope]}</span>
            </div>
            <time className="text-xs text-stone-600 flex-shrink-0 ml-2">
              {new Date(log.createdAt).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
            <span className="text-xs text-stone-500">
              居心地 <span className="text-amber-400 font-mono">{log.comfort}</span>/5
            </span>
            <span className="text-xs text-stone-500">
              消費圧 <span className="text-stone-300 font-mono">{log.consumptionPressure}</span>/5
            </span>
            <span className="text-xs text-stone-500">
              作業 <span className="text-stone-300 font-mono">{log.workTolerance}</span>/5
            </span>
            <span className="text-xs text-stone-500">
              人目圧 <span className="text-stone-300 font-mono">{log.visibilityPressure}</span>/5
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {log.canOpenPC && (
              <span className="text-xs text-sky-400 bg-sky-950/40 border border-sky-800/30 rounded-full px-2 py-0.5">
                PC可
              </span>
            )}
            {log.weatherEscape && (
              <span className="text-xs text-lime-400 bg-lime-950/40 border border-lime-800/30 rounded-full px-2 py-0.5">
                雨避けできた
              </span>
            )}
            {log.wantToReturn && (
              <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/30 rounded-full px-2 py-0.5">
                また来たい
              </span>
            )}
            {log.spentAmount !== '0' && (
              <span className="text-xs text-stone-400 bg-stone-800/60 border border-stone-700/30 rounded-full px-2 py-0.5">
                {log.spentAmount === '~300' ? '〜300円' : log.spentAmount === '~700' ? '〜700円' : '1000円+'}
              </span>
            )}
          </div>

          {log.memo && (
            <p className="text-xs text-stone-400 leading-relaxed mt-2 border-t border-stone-800 pt-2">
              {log.memo}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
