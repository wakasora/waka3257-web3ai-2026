'use client';
import type { StayLog } from './types';

const KEY = 'staymap_logs_v1';

export function loadLogs(): StayLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StayLog[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(log: StayLog): void {
  if (typeof window === 'undefined') return;
  const logs = loadLogs();
  logs.unshift(log); // 新しい順
  localStorage.setItem(KEY, JSON.stringify(logs));
}

export function getLogsBySpotId(spotId: string): StayLog[] {
  return loadLogs().filter((l) => l.spotId === spotId);
}

export function deleteLog(logId: string): void {
  if (typeof window === 'undefined') return;
  const logs = loadLogs().filter((l) => l.id !== logId);
  localStorage.setItem(KEY, JSON.stringify(logs));
}
