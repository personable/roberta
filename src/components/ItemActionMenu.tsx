import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Ellipsis, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Block } from '../types';

interface ItemActionMenuProps {
  blocks: Block[];
  currentBlockId: string;
  itemTitle: string;
  onMove: (toBlockId: string) => void;
  onDelete: () => void;
  triggerClassName?: string;
}

export default function ItemActionMenu({
  blocks,
  currentBlockId,
  itemTitle,
  onMove,
  onDelete,
  triggerClassName,
}: ItemActionMenuProps) {
  const otherBlocks = blocks.filter((b) => b.id !== currentBlockId);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={`Actions for "${itemTitle}"`}
          className={cn(
            'flex items-center text-slate-600 hover:text-slate-800 transition-all data-[state=open]:opacity-100',
            triggerClassName,
          )}
        >
          <Ellipsis size={18} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="end"
          sideOffset={4}
          className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 min-w-[180px] z-50 animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <DropdownMenu.Label className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Move to
          </DropdownMenu.Label>
          {otherBlocks.map((block) => (
            <DropdownMenu.Item
              key={block.id}
              onSelect={() => onMove(block.id)}
              className="flex items-center px-3 py-1.5 text-sm text-slate-700 cursor-default select-none outline-none data-[highlighted]:bg-slate-50"
            >
              {block.name}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
          <DropdownMenu.Item
            onSelect={onDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-800 cursor-default select-none outline-none data-[highlighted]:bg-slate-50"
          >
            <Trash2 size={14} />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
