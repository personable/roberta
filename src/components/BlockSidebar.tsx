import { cn } from '../lib/utils';
import type { Block } from '../types';

interface BlockSidebarProps {
  blocks: Block[];
  activeBlockId: string;
  onScrollToBlock: (blockId: string) => void;
}

export default function BlockSidebar({
  blocks,
  activeBlockId,
  onScrollToBlock,
}: BlockSidebarProps) {
  return (
    <div className="hidden min-[1000px]:block w-[260px] shrink-0 border-r border-slate-200 overflow-y-auto bg-white">
      {blocks.map((block) => {
        const isSelected = block.id === activeBlockId;
        return (
          <button
            key={block.id}
            onClick={() => onScrollToBlock(block.id)}
            className={cn(
              'w-full text-left py-5 px-4 transition-all ',
              isSelected
                ? 'bg-slate-800'
                : 'hover:bg-slate-50',
            )}
          >
            <div
              className={cn(
                'text-m font-semibold leading-tight font-display',
                isSelected ? 'text-white' : 'text-slate-800'
              )}
            >
              {block.name}
            </div>
            {block.time && (
              <div className="text-xs mt-0.5 leading-tight text-slate-400">
                {block.time}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
