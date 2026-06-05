import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import ColorBox from './ColorBox';
import type { DayType } from '../types';

const DAY_NAMES = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri'];
const UPPER_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

interface DayHeaderProps {
  weekStart: string;
  selectedDayIndex: number;
  getDayType: (dayIndex: number) => DayType;
  onSelectDay: (dayIndex: number) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function DayHeader({
  weekStart,
  selectedDayIndex,
  getDayType,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
}: DayHeaderProps) {
  const monday = new Date(weekStart + 'T00:00:00');
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const weekNum = getISOWeekNumber(monday);
  const year = friday.getFullYear();
  const dateRange = monday.getMonth() === friday.getMonth()
    ? `${SHORT_MONTHS[monday.getMonth()]} ${monday.getDate()}–${friday.getDate()}`
    : `${SHORT_MONTHS[monday.getMonth()]} ${monday.getDate()} – ${SHORT_MONTHS[friday.getMonth()]} ${friday.getDate()}`;

  return (
    <div className="flex border-b border-slate-200 bg-white shrink-0">

      {/* Week nav — sits above the block sidebar */}
      <div className="w-[260px] shrink-0 border-r border-slate-100 flex items-center justify-between px-4">
        <button
          onClick={onPrevWeek}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 bg-slate-50 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col items-center gap-1">
          <span className="font-display font-bold text-slate-900 text-m leading-tight">Week {weekNum}</span>
          <span className="text-slate-600 text-xs leading-tight">{dateRange}, {year}</span>
        </div>

        <button
          onClick={onNextWeek}
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-60 bg-slate-50 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day columns */}
      {[0, 1, 2, 3, 4].map((i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dayType = getDayType(i);
        const isSelected = i === selectedDayIndex;
        const isRed = dayType === 'red';

        return (
          <div key={i} className="flex-1 flex flex-col border-r border-slate-100 last:border-r-0">

            {/* Day-type label — not yet wired up */}
            <button
              className={cn(
                'flex items-center gap-2 px-5 py-4 border-b border-slate-100 w-full text-left transition-colors hover:bg-slate-50'
              )}
              aria-label={`${isRed ? 'Red' : 'White'} day — click to change`}
            >
              <ColorBox size={18} color={isRed ? 'red' : 'slate'} />
              <span className="text-xs tracking-widest uppercase text-slate-600">
                {isRed ? 'Red Day' : 'White Day'}
              </span>
            </button>

            {/* Day select button */}
            <button
              onClick={() => onSelectDay(i)}
              className={cn(
                'flex items-baseline gap-2 px-5 py-5 w-full transition-colors',
                isSelected ? 'bg-slate-800 hover:bg-slate-800' : 'hover:bg-slate-50',
              )}
            >
              <span className={cn(
                'font-display text-lg font-semibold leading-none flex-1 text-left',
                isSelected ? 'text-white' : 'text-slate-900',
              )}>
                {DAY_NAMES[i]}
              </span>
              <span className={cn(
                'text-xs font-medium tracking-wide',
                isSelected ? 'text-slate-300' : 'text-slate-600',
              )}>
                {UPPER_MONTHS[date.getMonth()]} {date.getDate()}
              </span>
            </button>

          </div>
        );
      })}
    </div>
  );
}
