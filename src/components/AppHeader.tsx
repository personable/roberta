import { Settings } from 'lucide-react';
import WeekNav from './WeekNav';

interface AppHeaderProps {
  weekStart: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function AppHeader({ weekStart, onPrevWeek, onNextWeek }: AppHeaderProps) {
  return (
    <div className="flex items-center px-6 py-3 border-b border-slate-100 bg-white shrink-0 justify-between">
      <h1 className="font-display text-lg text-slate-800 font-bold">Hi, Chris.</h1>
      <WeekNav
        weekStart={weekStart}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        className="gap-4 min-[1000px]:hidden"
      />
      <button
        onClick={() => alert(
          `Settings config where users could:
           - Set up the dates of their semester and the default items in each block during the semester
           - Configure their own item types for Blocks and Classes
           - Configure their own day labels (Red Day, etc.)
          `
        )}
        aria-label="Settings"
        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
