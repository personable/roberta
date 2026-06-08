import { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { getItemTypeConfig } from '../lib/itemTypes';
import ColorBox from './ColorBox';
import ClassItemCard from './ClassItemCard';
import ItemActionMenu from './ItemActionMenu';
import CompleteButton from './CompleteButton';
import type { Block, ScheduleItem, ClassItemType } from '../types';

interface BlockContentProps {
  block: Block;
  blocks: Block[];
  items: ScheduleItem[];
  isActive?: boolean;
  onItemClick: (item: ScheduleItem) => void;
  onDeleteAll: () => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (toBlockId: string, itemId: string) => void;
  onToggleComplete: (itemId: string) => void;
  onAddClassSubItem: (classItemId: string, title: string, type: ClassItemType) => void;
  onDeleteClassSubItem: (classItemId: string, subItemId: string) => void;
}

export default function BlockContent({ block, blocks, items, isActive, onItemClick, onDeleteAll, onDeleteItem, onMoveItem, onToggleComplete, onAddClassSubItem, onDeleteClassSubItem }: BlockContentProps) {
  // Stays false during the first render so pre-existing items skip the entrance animation.
  // Flips to true after mount so any subsequently added item animates in normally.
  const hasMounted = useRef(false);
  useEffect(() => { hasMounted.current = true; }, []);

  return (
    <div
      className={cn(
        'p-7',
        isActive ? 'bg-slate-50' : 'bg-white',
      )}
    >
      {/* Block heading */}
      <div className="flex items-baseline justify-between mb-6">
        <div
          className={cn(
            'flex items-baseline gap-4 transition-all duration-300 origin-left',
            isActive ? 'scale-[1.2]' : 'scale-100',
          )}
        >
          <h2 className={cn(
            'font-display text-2xl text-slate-800',
            isActive ? 'font-extrabold' : 'font-bold'
          )}>{block.name}</h2>
          {block.time && (
            <span className="text-sm text-slate-500">{block.time}</span>
          )}
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={onDeleteAll}>
            <Trash2 size={16} />
            Clear Block
          </Button>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center">No items yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
          {items.map((item) => {
            const config = getItemTypeConfig(item.type);
            const completed = item.completed ?? false;
            return (
              <motion.div
                key={item.id}
                layout
                initial={hasMounted.current ? { opacity: 0, y: 100, scale: 0.99 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                {item.type === 'class' ? (
                  <ClassItemCard
                    item={item}
                    blocks={blocks}
                    currentBlockId={block.id}
                    onClick={() => onItemClick(item)}
                    onDelete={() => onDeleteItem(item.id)}
                    onMove={(toBlockId) => onMoveItem(toBlockId, item.id)}
                    onToggleComplete={() => onToggleComplete(item.id)}
                    onAddSubItem={(title, type) => onAddClassSubItem(item.id, title, type)}
                    onDeleteSubItem={(subItemId) => onDeleteClassSubItem(item.id, subItemId)}
                  />
                ) : (
                  <div className={cn(
                    'group flex items-stretch rounded-xl border border-slate-200',
                    'bg-white transition-colors hover:border-slate-400',
                  )}>
                    {/* Main clickable area — opens drawer */}
                    <button
                      onClick={() => onItemClick(item)}
                      className="flex-1 flex items-start gap-4 p-4 text-left min-w-0 rounded-l-xl"
                    >
                      <ColorBox size={32} color={config.color} iconName={config.iconName} className={cn('mt-0.5 transition-opacity', completed && 'opacity-40')} />
                      <div className="min-w-0">
                        <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-slate-400">
                          {config.label}
                        </h3>
                        <p className={cn(
                          'font-display font-bold text-md truncate transition-colors',
                          completed ? 'line-through text-slate-400' : 'text-slate-800',
                        )}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className={cn(
                            'text-xs mt-0.5 line-clamp-2 transition-colors',
                            completed ? 'text-slate-400' : 'text-slate-600',
                          )}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                    {/* Complete + action menu — siblings, never nested */}
                    <CompleteButton
                      completed={completed}
                      onToggle={() => onToggleComplete(item.id)}
                      className="px-3 self-stretch transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    />
                    <ItemActionMenu
                      blocks={blocks}
                      currentBlockId={block.id}
                      itemTitle={item.title}
                      onMove={(toBlockId) => onMoveItem(toBlockId, item.id)}
                      onDelete={() => onDeleteItem(item.id)}
                      triggerClassName="px-3 rounded-r-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
