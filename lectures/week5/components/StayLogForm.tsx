'use client';
import { useState } from 'react';
import { saveLog } from '@/lib/storage';
import type { StayLog, ActivityType, SharingScope } from '@/lib/types';

interface StayLogFormProps {
  spotId: string;
  onSaved: () => void;
}

const ACTIVITIES: { value: ActivityType; label: string }[] = [
  { value: 'work', label: '作業' },
  { value: 'reading', label: '読書' },
  { value: 'rest', label: '休憩' },
  { value: 'waiting', label: '待機' },
  { value: 'spacing_out', label: 'ぼーっとする' },
  { value: 'conversation', label: '会話' },
  { value: 'eating', label: '食事' },
];

const DURATIONS: { value: StayLog['duration']; label: string }[] = [
  { value: '5min', label: '5分' },
  { value: '15min', label: '15分' },
  { value: '30min', label: '30分' },
  { value: '1hour', label: '1時間' },
  { value: '2hour_plus', label: '2時間以上' },
];

const AMOUNTS: { value: StayLog['spentAmount']; label: string }[] = [
  { value: '0', label: '0円' },
  { value: '~300', label: '〜300円' },
  { value: '~700', label: '〜700円' },
  { value: '1000+', label: '1000円以上' },
];

const SCOPES: { value: SharingScope; label: string }[] = [
  { value: 'private', label: 'プライベート' },
  { value: 'friends', label: 'フレンドのみ' },
  { value: 'area_only', label: 'エリア公開' },
  { value: 'public', label: '全体公開' },
];

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-700 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded px-2.5 py-1 text-xs border transition-all ${
              value === opt.value
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StarRating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-700 mb-1.5">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-7 h-7 rounded text-xs transition-all ${
              n <= value
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-white text-stone-400 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-semibold text-stone-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full border transition-all ${
          value ? 'bg-amber-400 border-amber-400' : 'bg-stone-200 border-stone-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
            value ? 'left-4' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function StayLogForm({ spotId, onSaved }: StayLogFormProps) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityType>('rest');
  const [duration, setDuration] = useState<StayLog['duration']>('30min');
  const [spentAmount, setSpentAmount] = useState<StayLog['spentAmount']>('0');
  const [canOpenPC, setCanOpenPC] = useState(false);
  const [comfort, setComfort] = useState(3);
  const [consumptionPressure, setConsumptionPressure] = useState(3);
  const [workTolerance, setWorkTolerance] = useState(3);
  const [visibilityPressure, setVisibilityPressure] = useState(3);
  const [weatherEscape, setWeatherEscape] = useState(false);
  const [wantToReturn, setWantToReturn] = useState(true);
  const [scope, setScope] = useState<SharingScope>('public');
  const [memo, setMemo] = useState('');

  const handleSubmit = () => {
    const log: StayLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      spotId,
      createdAt: new Date().toISOString(),
      activity,
      duration,
      spentAmount,
      canOpenPC,
      comfort,
      consumptionPressure,
      workTolerance,
      visibilityPressure,
      weatherEscape,
      wantToReturn,
      scope,
      memo,
    };
    saveLog(log);
    onSaved();
    setOpen(false);
    setMemo('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded border border-dashed border-stone-300 bg-white py-3 text-xs text-stone-600 hover:border-amber-400 hover:text-amber-900 transition-all font-medium"
      >
        ＋ 滞在ログを書く
      </button>
    );
  }

  return (
    <div className="rounded border border-stone-200 bg-white p-5 space-y-5">
      <h3 className="text-xs font-bold text-stone-800 tracking-wider">滞在ログを記録する</h3>

      <RadioGroup label="何をしたか" options={ACTIVITIES} value={activity} onChange={setActivity} />
      <RadioGroup label="滞在時間" options={DURATIONS} value={duration} onChange={setDuration} />
      <RadioGroup label="使った金額" options={AMOUNTS} value={spentAmount} onChange={setSpentAmount} />

      <div className="space-y-2 border-t border-stone-100 pt-3">
        <Toggle label="PCを開けたか" value={canOpenPC} onChange={setCanOpenPC} />
        <Toggle label="天候から逃げられたか" value={weatherEscape} onChange={setWeatherEscape} />
        <Toggle label="また使いたいか" value={wantToReturn} onChange={setWantToReturn} />
      </div>

      <div className="space-y-3 border-t border-stone-100 pt-3">
        <StarRating label="居心地 (1=最悪, 5=最高)" value={comfort} onChange={setComfort} />
        <StarRating label="消費圧 (1=低, 5=高)" value={consumptionPressure} onChange={setConsumptionPressure} />
        <StarRating label="作業許容度 (1=不可, 5=最適)" value={workTolerance} onChange={setWorkTolerance} />
        <StarRating label="人目圧 (1=低, 5=高)" value={visibilityPressure} onChange={setVisibilityPressure} />
      </div>

      <RadioGroup label="公開範囲" options={SCOPES} value={scope} onChange={setScope} />

      <div>
        <p className="text-xs font-semibold text-stone-700 mb-1.5">自由メモ</p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="気づいたこと、場所の雰囲気など..."
          rows={3}
          className="w-full rounded border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded bg-amber-500 hover:bg-amber-600 py-2 text-xs font-semibold text-white transition-all"
        >
          記録する
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded border border-stone-200 px-4 py-2 text-xs text-stone-500 hover:border-stone-300 transition-all bg-white"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
