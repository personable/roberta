import { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { getItemTypeConfig } from '../lib/itemTypes';
import ColorBox from './ColorBox';
import ClassItemCard from './ClassItemCard';
import type { Block, ScheduleItem, ClassItemType } from '../types';

interface BlockContentProps {
  block: Block;
  items: ScheduleItem[];
  onItemClick: (item: ScheduleItem) => void;
  onDeleteAll: () => void;
  onDeleteItem: (id: string) => void;
  onAddClassSubItem: (classItemId: string, title: string, type: ClassItemType) => void;
  onDeleteClassSubItem: (classItemId: string, subItemId: string) => void;
}

export default function BlockContent({ block, items, onItemClick, onDeleteAll, onDeleteItem, onAddClassSubItem, onDeleteClassSubItem }: BlockContentProps) {
  // Stays false during the first render so pre-existing items skip the entrance animation.
  // Flips to true after mount so any subsequently added item animates in normally.
  const hasMounted = useRef(false);
  useEffect(() => { hasMounted.current = true; }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 border-b border-slate-200">
      {/* Block heading */}
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-4">
          <h2 className="font-display text-3xl text-slate-800 font-extrabold">{block.name}</h2>
          {block.time && (
            <span className="text-sm text-slate-400">{block.time}</span>
          )}
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={onDeleteAll}>
            <Trash2 size={16} />
            Delete All
          </Button>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No items yet. Add one below.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence>
          {items.map((item) => {
            const config = getItemTypeConfig(item.type);
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
                    onDelete={() => onDeleteItem(item.id)}
                    onAddSubItem={(title, type) => onAddClassSubItem(item.id, title, type)}
                    onDeleteSubItem={(subItemId) => onDeleteClassSubItem(item.id, subItemId)}
                  />
                ) : (
                  <div className={cn(
                    'flex items-stretch rounded-xl border border-slate-200',
                    'bg-white transition-colors hover:border-slate-400',
                  )}>
                    {/* Main clickable area — opens drawer */}
                    <button
                      onClick={() => onItemClick(item)}
                      className="flex-1 flex items-start gap-4 p-4 text-left min-w-0 rounded-l-xl"
                    >
                      <ColorBox size={32} color={config.color} iconName={config.iconName} className="mt-1" />
                      <div className="min-w-0">
                        <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-0.5 text-slate-400">
                          {config.label}
                        </h3>
                        <p className="font-display font-bold text-md text-slate-800 truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </button>
                    {/* Delete — sibling button, never nested */}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      aria-label={`Delete "${item.title}"`}
                      className="flex items-center px-4 text-slate-600 hover:text-slate-800 transition-colors rounded-r-xl"
                    >
                      <Trash2 size={18} />
                    </button>
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
