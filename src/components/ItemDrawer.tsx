import * as Dialog from '@radix-ui/react-dialog';
import { X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ITEM_TYPE_CONFIGS } from '../lib/itemTypes';
import { Button } from './Button';
import ColorBox from './ColorBox';
import type { ItemType, ScheduleItem } from '../types';

interface ItemDrawerProps {
  item: ScheduleItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: ScheduleItem) => void;
  onDelete: (id: string) => void;
  /** When provided the drawer opens in create-mode: empty fields, Done adds to all blocks. */
  onAddToAll?: (title: string, type: ItemType, description?: string) => void;
}

export default function ItemDrawer({
  item,
  open,
  onClose,
  onSave,
  onDelete,
  onAddToAll,
}: ItemDrawerProps) {
  const isCreateMode = !!onAddToAll;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ItemType>('reminder');

  useEffect(() => {
    if (open && isCreateMode) {
      setTitle('');
      setDescription('');
      setType('reminder');
    } else if (item) {
      setTitle(item.title);
      setDescription(item.description ?? '');
      setType(item.type);
    }
  }, [open, item, isCreateMode]);

  function handleSave() {
    if (!item || isCreateMode) return;
    onSave({ ...item, title, description: description || undefined, type });
  }

  function handleDelete() {
    if (!item) return;
    onDelete(item.id);
  }

  function handleAddToAll() {
    if (!title.trim()) return;
    onAddToAll!(title.trim(), type, description || undefined);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (isCreateMode) {
      handleAddToAll();
    } else {
      handleSave();
      onClose();
    }
  }

  function handleOpenChange(o: boolean) {
    if (!o) {
      if (!isCreateMode) handleSave();
      onClose();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 bg-black/25 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* Panel */}
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed top-0 right-0 bottom-0 z-50 w-96 bg-white shadow-2xl flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <Dialog.Title className="font-semibold text-slate-800 text-md font-display">
                      {isCreateMode ? 'Add to All Blocks' : 'Edit Item'}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                    {/* Type selector */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
                        {type}
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {ITEM_TYPE_CONFIGS.map((c) => (
                          <button
                            key={c.type}
                            onClick={() => setType(c.type)}
                            title={c.label}
                            className={cn(
                              'transition-all rounded-lg focus:outline-none',
                              type === c.type ? 'scale-110' : 'opacity-50 hover:opacity-100',
                            )}
                          >
                            <ColorBox size={32} color={c.color} iconName={c.iconName} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={isCreateMode ? undefined : handleSave}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        placeholder="Item title"
                        autoFocus={isCreateMode}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={isCreateMode ? undefined : handleSave}
                        onKeyDown={handleKeyDown}
                        rows={4}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                        placeholder="Optional notes..."
                      />
                    </div>

                    {/* Done button — create mode only */}
                    {isCreateMode && (
                      <Button onClick={handleAddToAll} disabled={!title.trim()}>
                        Done
                      </Button>
                    )}
                  </div>

                  {/* Footer — edit mode only */}
                  {!isCreateMode && (
                    <div className="px-4 py-3 border-t border-slate-100 flex flex-col gap-3">
                      <Button onClick={() => { handleSave(); onClose(); }}>
                        Done
                      </Button>
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete Item
                      </button>
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
