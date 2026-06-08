import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, ListPlus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ColorBox from './ColorBox';
import WeekNav from './WeekNav';
import type { DayType } from '../types';

const DAY_NAMES = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri'];
const UPPER_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

interface DayHeaderProps {
  weekStart: string;
  selectedDayIndex: number;
  getDayType: (dayIndex: number) => DayType;
  onSelectDay: (dayIndex: number) => void;
  onSetDayType: (dayIndex: number, type: DayType) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddToAllBlocks: (dayIndex: number) => void;
  onClearAllBlocks: (dayIndex: number) => void;
}

export default function DayHeader({
  weekStart,
  selectedDayIndex,
  getDayType,
  onSelectDay,
  onSetDayType,
  onPrevWeek,
  onNextWeek,
  onAddToAllBlocks,
  onClearAllBlocks,
}: DayHeaderProps) {
  const monday = new Date(weekStart + 'T00:00:00');

  return (
    <div className="flex border-b border-slate-200 bg-white shrink-0">

      {/* Week nav — aligned with the block sidebar, hidden below 1000px */}
      <WeekNav
        weekStart={weekStart}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        className="hidden min-[1000px]:flex w-[260px] shrink-0 border-r border-slate-100 px-4"
      />

      {/* Day columns */}
      {[0, 1, 2, 3, 4].map((i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dayType = getDayType(i);
        const isSelected = i === selectedDayIndex;
        const isRed = dayType === 'red';

        return (
          <div key={i} className="flex-1 flex flex-col border-r border-slate-100 last:border-r-0">

            <div className="flex transition-colors hover:bg-slate-50 border-b border-slate-100">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="flex items-center gap-2 px-5 py-3 w-full text-left hover:opacity-75 transition-opacity focus:outline-none"
                  aria-label={`${isRed ? 'Red' : 'White'} day — click to change`}
                >
                  <ColorBox size={18} color={isRed ? 'red' : 'white'} />
                  <span className="text-xs tracking-wide uppercase text-slate-600 truncate">
                    {isRed ? 'Red Day' : 'White Day'}
                  </span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 min-w-[160px] z-50 animate-in fade-in-0 zoom-in-95 duration-100 origin-top-left"
                >
                  {(['red', 'white'] as DayType[]).map((t) => (
                    <DropdownMenu.Item
                      key={t}
                      onSelect={() => onSetDayType(i, t)}
                      className={cn(
                        'flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 cursor-default select-none outline-none data-[highlighted]:bg-slate-50',
                        dayType === t && 'font-medium',
                      )}
                    >
                      <ColorBox size={18} color={t === 'red' ? 'red' : 'white'} />
                      {t === 'red' ? 'Red Day' : 'White Day'}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <DropdownMenu.Root onOpenChange={(open) => { if (open) onSelectDay(i); }}>
              <DropdownMenu.Trigger asChild>
                <button
                  aria-label="Day options"
                  className="px-4 flex items-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
                >
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={-4}
                  className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 min-w-[210px] z-50 animate-in fade-in-0 zoom-in-95 duration-100 origin-top-right"
                >
                  <DropdownMenu.Item
                    onSelect={() => onAddToAllBlocks(i)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 cursor-pointer select-none outline-none data-[highlighted]:bg-slate-50"
                  >
                    <ListPlus size={16} className="text-slate-600 shrink-0" />
                    Add All-Day Item
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => onClearAllBlocks(i)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 cursor-pointer select-none outline-none data-[highlighted]:bg-slate-50"
                  >
                    <Trash2 size={16} className="text-slate-600 shrink-0" />
                    Clear Day
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            </div>

            {/* Day select button */}
            <button
              onClick={() => onSelectDay(i)}
              className={cn(
                'flex flex-wrap items-baseline gap-2 px-5 py-4 w-full transition-colors',
                isSelected ? 'bg-slate-800 hover:bg-slate-800' : 'hover:bg-slate-50',
              )}
            >
              <span className={cn(
                'flex-1 font-display text-md font-semibold leading-none text-left',
                isSelected ? 'text-white' : 'text-slate-800',
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
