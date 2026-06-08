import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

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

interface WeekNavProps {
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  className?: string;
}

export default function WeekNav({ weekStart, onPrevWeek, onNextWeek, className }: WeekNavProps) {
  const monday = new Date(weekStart + 'T00:00:00');
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const weekNum = getISOWeekNumber(monday);
  const year = friday.getFullYear();
  const dateRange = monday.getMonth() === friday.getMonth()
    ? `${SHORT_MONTHS[monday.getMonth()]} ${monday.getDate()}–${friday.getDate()}`
    : `${SHORT_MONTHS[monday.getMonth()]} ${monday.getDate()} – ${SHORT_MONTHS[friday.getMonth()]} ${friday.getDate()}`;

  return (
    <div className={cn('flex items-center justify-between', className)}>
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
        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 bg-slate-50 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Next week"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
