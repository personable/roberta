import type { DayType, ScheduleItem } from '../types';

const DEFAULT_DAY_TYPES: DayType[] = ['red', 'white', 'white', 'red', 'white'];

export function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  // Adjust so Monday = 0
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayStr = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
}

function itemsKey(weekStart: string, dayIndex: number, blockId: string): string {
  return `roberta:items:${weekStart}:${dayIndex}:${blockId}`;
}

function dayTypeKey(weekStart: string, dayIndex: number): string {
  return `roberta:daytype:${weekStart}:${dayIndex}`;
}

export function getItems(weekStart: string, dayIndex: number, blockId: string): ScheduleItem[] {
  const key = itemsKey(weekStart, dayIndex, blockId);
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ScheduleItem[];
  } catch {
    return [];
  }
}

export function saveItems(
  weekStart: string,
  dayIndex: number,
  blockId: string,
  items: ScheduleItem[],
): void {
  const key = itemsKey(weekStart, dayIndex, blockId);
  localStorage.setItem(key, JSON.stringify(items));
}

export function getDayType(weekStart: string, dayIndex: number): DayType {
  const key = dayTypeKey(weekStart, dayIndex);
  const stored = localStorage.getItem(key);
  if (stored === 'red' || stored === 'white') return stored;
  return DEFAULT_DAY_TYPES[dayIndex] ?? 'white';
}

export function setDayType(weekStart: string, dayIndex: number, type: DayType): void {
  const key = dayTypeKey(weekStart, dayIndex);
  localStorage.setItem(key, type);
}
