import { cn } from '../lib/utils';
import type { Block } from '../types';

interface BlockSidebarProps {
  blocks: Block[];
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
}

export default function BlockSidebar({
  blocks,
  selectedBlockId,
  onSelectBlock,
}: BlockSidebarProps) {
  return (
    <div className="w-[260px] shrink-0 border-r border-slate-200 overflow-y-auto bg-white">
      {blocks.map((block) => {
        const isSelected = block.id === selectedBlockId;
        return (
          <button
            key={block.id}
            onClick={() => onSelectBlock(block.id)}
            className={cn(
              'w-full text-left px-5 py-5 border-b border-slate-100 transition-colors',
              isSelected
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-50 text-slate-800',
            )}
          >
            <div
              className={cn(
                'text-sm text-md font-semibold leading-tight font-display',
                isSelected ? 'text-white' : 'text-slate-800',
              )}
            >
              {block.name}
            </div>
            {block.time && (
              <div
                className={cn(
                  'text-xs mt-0.5 leading-tight',
                  isSelected ? 'text-slate-400' : 'text-slate-400',
                )}
              >
                {block.time}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
