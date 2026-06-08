import { Square, CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface CompleteButtonProps {
  completed: boolean;
  onToggle: () => void;
  /** Applied to the outer wrapper div — use this for layout (flex, self-stretch, px) and
   *  visibility (opacity-0, group-hover:opacity-100, etc.) from the parent context. */
  className?: string;
}

export default function CompleteButton({ completed, onToggle, className }: CompleteButtonProps) {
  return (
    <div className={cn('relative group/complete flex items-center', className)}>
      <button
        role="checkbox"
        aria-checked={completed}
        aria-label="Complete"
        onClick={onToggle}
        className={cn(
          'flex items-center justify-center transition-colors',
          completed
            ? 'text-slate-600 hover:text-slate-800'
            : 'text-slate-600 hover:text-slate-800',
        )}
      >
        {completed ? <CheckSquare size={18} /> : <Square size={18} />}
      </button>

      {/* Tooltip */}
      <div
        aria-hidden
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md text-xs bg-slate-800 text-white whitespace-nowrap pointer-events-none opacity-0 group-hover/complete:opacity-100 group-focus-within/complete:opacity-100 transition-opacity z-50"
      >
        {completed ? 'Mark incomplete' : 'Mark complete'}
      </div>
    </div>
  );
}
