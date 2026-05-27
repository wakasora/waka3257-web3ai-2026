import type { Scores, StayLog, Spot } from './types';

/** ログ件数に応じたbaseScoresとlogAverageの重み付けを計算 */
function getWeights(logCount: number): { base: number; log: number } {
  if (logCount === 0) return { base: 1.0, log: 0.0 };
  if (logCount <= 4) return { base: 0.7, log: 0.3 };
  if (logCount <= 14) return { base: 0.4, log: 0.6 };
  return { base: 0.2, log: 0.8 };
}

/** ログからスコア平均を計算 */
function calcLogAverage(logs: StayLog[]): Partial<Scores> {
  if (logs.length === 0) return {};
  const sum = logs.reduce(
    (acc, log) => ({
      consumptionPressure: acc.consumptionPressure + log.consumptionPressure,
      workTolerance: acc.workTolerance + log.workTolerance,
      visibilityPressure: acc.visibilityPressure + log.visibilityPressure,
    }),
    { consumptionPressure: 0, workTolerance: 0, visibilityPressure: 0 }
  );
  const n = logs.length;
  return {
    consumptionPressure: sum.consumptionPressure / n,
    workTolerance: sum.workTolerance / n,
    visibilityPressure: sum.visibilityPressure / n,
  };
}

/** 補正済みスコアを返す */
export function calcAdjustedScores(spot: Spot, logs: StayLog[]): Scores {
  const { base, log } = getWeights(logs.length);
  const bs = spot.baseScores;

  if (log === 0) return { ...bs };

  const avg = calcLogAverage(logs);

  return {
    consumptionPressure:
      Math.round((bs.consumptionPressure * base + (avg.consumptionPressure ?? bs.consumptionPressure) * log) * 10) / 10,
    workTolerance:
      Math.round((bs.workTolerance * base + (avg.workTolerance ?? bs.workTolerance) * log) * 10) / 10,
    purposePressure: bs.purposePressure,
    visibilityPressure:
      Math.round((bs.visibilityPressure * base + (avg.visibilityPressure ?? bs.visibilityPressure) * log) * 10) / 10,
    stayTolerance: bs.stayTolerance,
    weatherResistance: bs.weatherResistance,
    fragility: bs.fragility,
  };
}

/** 総合「滞在しやすさ」スコア (0-100) */
export function calcOverallScore(scores: Scores): number {
  const positive =
    (scores.workTolerance + scores.stayTolerance + scores.weatherResistance) / 3;
  const negative =
    (scores.consumptionPressure + scores.purposePressure + scores.visibilityPressure + scores.fragility) / 4;
  // positive は高いほど良、negative は低いほど良
  const raw = ((positive - 1) / 4 - (negative - 1) / 4) * 50 + 50;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/** 信頼度ラベル */
export function getReliability(logCount: number): '低' | '中' | '高' {
  if (logCount <= 2) return '低';
  if (logCount <= 9) return '中';
  return '高';
}
