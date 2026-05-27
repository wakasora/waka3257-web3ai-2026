export type SharingScope = 'private' | 'friends' | 'area_only' | 'public';

export type ActivityType =
  | 'work'
  | 'reading'
  | 'rest'
  | 'waiting'
  | 'spacing_out'
  | 'conversation'
  | 'eating';

export interface Scores {
  consumptionPressure: number;   // 消費圧 1-5 (低いほど良)
  workTolerance: number;         // 作業許容度 1-5 (高いほど良)
  purposePressure: number;       // 目的要求度 1-5 (低いほど良)
  visibilityPressure: number;    // 人目圧 1-5 (低いほど良)
  stayTolerance: number;         // 滞在許容時間 1-5 (高いほど良)
  weatherResistance: number;     // 天候耐性 1-5 (高いほど良)
  fragility: number;             // 壊れやすさ 1-5 (低いほど良)
}

export type SpotCategory =
  | '図書館'
  | '商業施設'
  | 'イートイン'
  | '公園'
  | '公共施設'
  | 'カフェ'
  | 'その他';

export interface Spot {
  id: string;
  name: string;
  category: SpotCategory;
  area: string;
  indoor: boolean;
  price: '無料' | '低価格' | '有料';
  stayDuration: string;
  description: string;
  baseScores: Scores;
  // map上の相対座標 (0-100の%)
  mapX: number;
  mapY: number;
}

export interface StayLog {
  id: string;
  spotId: string;
  createdAt: string; // ISO string
  activity: ActivityType;
  duration: '5min' | '15min' | '30min' | '1hour' | '2hour_plus';
  spentAmount: '0' | '~300' | '~700' | '1000+';
  canOpenPC: boolean;
  comfort: number;       // 居心地 1-5
  consumptionPressure: number;
  workTolerance: number;
  visibilityPressure: number;
  weatherEscape: boolean;
  wantToReturn: boolean;
  scope: SharingScope;
  memo: string;
}
