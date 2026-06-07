import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { cn } from '../lib/utils';
import BlockContent from './BlockContent';
import type { Block, ClassItemType, ScheduleItem } from '../types';

export interface AllBlocksContentHandle {
  scrollToBlock: (blockId: string) => void;
}

interface AllBlocksContentProps {
  blocks: Block[];
  allItems: Record<string, ScheduleItem[]>;
  /** Changes when week/day changes — used to key BlockContent so animations reset */
  dayKey: string;
  activeBlockId: string;
  onActiveBlockChange: (blockId: string) => void;
  onItemClick: (item: ScheduleItem, blockId: string) => void;
  onDeleteItem: (blockId: string, itemId: string) => void;
  onDeleteAll: (blockId: string) => void;
  onAddClassSubItem: (blockId: string, classItemId: string, title: string, type: ClassItemType) => void;
  onDeleteClassSubItem: (blockId: string, classItemId: string, subItemId: string) => void;
}

const AllBlocksContent = forwardRef<AllBlocksContentHandle, AllBlocksContentProps>(
  function AllBlocksContent(
    { blocks, allItems, dayKey, activeBlockId, onActiveBlockChange, onItemClick, onDeleteItem, onDeleteAll, onAddClassSubItem, onDeleteClassSubItem },
    ref,
  ) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Stable ref so the scroll listener never needs to be re-registered when the callback changes
    const onActiveBlockChangeRef = useRef(onActiveBlockChange);
    useEffect(() => { onActiveBlockChangeRef.current = onActiveBlockChange; });

    useImperativeHandle(ref, () => ({
      scrollToBlock(blockId: string) {
        const el = sectionRefs.current.get(blockId);
        const container = scrollRef.current;
        if (!el || !container) return;
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        container.scrollTo({
          top: container.scrollTop + elTop - containerTop,
          behavior: 'smooth',
        });
      },
    }));

    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      function updateActive() {
        const containerTop = container!.getBoundingClientRect().top;
        // Walk blocks in order; the last one whose top edge has reached (or crossed)
        // the container top — with a small offset matching BlockContent's p-8 padding
        // so the block activates as its heading becomes visible, not just its border.
        const OFFSET = 40;
        let activeId = blocks[0].id;
        for (const block of blocks) {
          const el = sectionRefs.current.get(block.id);
          if (!el) continue;
          if (el.getBoundingClientRect().top - containerTop <= OFFSET) {
            activeId = block.id;
          }
        }
        onActiveBlockChangeRef.current(activeId);
      }

      updateActive(); // initialise on mount
      container.addEventListener('scroll', updateActive, { passive: true });
      return () => container.removeEventListener('scroll', updateActive);
    }, [blocks]);

    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50 pb-[600px] snap-y snap-mandatory">
        {blocks.map((block, idx) => (
          <section
            key={block.id}
            data-block-id={block.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(block.id, el);
              else sectionRefs.current.delete(block.id);
            }}
            className={cn(
              'snap-start',
              idx < blocks.length - 1 && 'border-b border-slate-200',
            )}
          >
            <BlockContent
              key={`${dayKey}-${block.id}`}
              block={block}
              isActive={block.id === activeBlockId}
              items={allItems[block.id] ?? []}
              onItemClick={(item) => onItemClick(item, block.id)}
              onDeleteAll={() => onDeleteAll(block.id)}
              onDeleteItem={(id) => onDeleteItem(block.id, id)}
              onAddClassSubItem={(classItemId, title, type) =>
                onAddClassSubItem(block.id, classItemId, title, type)
              }
              onDeleteClassSubItem={(classItemId, subItemId) =>
                onDeleteClassSubItem(block.id, classItemId, subItemId)
              }
            />
          </section>
        ))}
      </div>
    );
  },
);

export default AllBlocksContent;
