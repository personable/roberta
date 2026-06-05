import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Trash2, CornerDownLeft } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { getItemTypeConfig, CLASS_ITEM_TYPE_CONFIGS, getClassItemTypeConfig } from '../lib/itemTypes';
import ColorBox from './ColorBox';
import type { ScheduleItem, ClassSubItem, ClassItemType } from '../types';

interface ClassItemCardProps {
  item: ScheduleItem;
  onDelete: () => void;
  onAddSubItem: (title: string, type: ClassItemType) => void;
  onDeleteSubItem: (subItemId: string) => void;
}

export default function ClassItemCard({ item, onDelete, onAddSubItem, onDeleteSubItem }: ClassItemCardProps) {
  const classConfig = getItemTypeConfig('class');
  const [selectedType, setSelectedType] = useState<ClassItemType>('bell-work');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const currentTypeConfig = getClassItemTypeConfig(selectedType);
  const subItems = item.classItems ?? [];

  function handleSubmit() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAddSubItem(trimmed, selectedType);
    setInputValue('');
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Class header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <ColorBox size={32} color={classConfig.color} iconName={classConfig.iconName} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {classConfig.label}
          </p>
          <p className="font-display font-bold text-md text-slate-800 truncate">{item.title}</p>
        </div>
        <button
          onClick={onDelete}
          aria-label={`Delete "${item.title}"`}
          className="text-slate-600 hover:text-slate-800 transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Sub-items */}
      {subItems.length > 0 && (
        <div className="divide-y divide-slate-100">
          {subItems.map((sub) => (
            <SubItemRow
              key={sub.id}
              subItem={sub}
              onDelete={() => onDeleteSubItem(sub.id)}
            />
          ))}
        </div>
      )}

      {/* Inline add bar */}
      <div style={{outlineWidth: 1}} className={cn(
        'flex items-center gap-3 pr-4 pl-8 h-14 border-t border-slate-100 rounded-b-xl transition-colors',
        isFocused && '',
      )}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              aria-label={`Class item type: ${currentTypeConfig.label}. Click to change`}
              className="shrink-0 transition-opacity hover:opacity-75 focus:outline-none"
            >
              <ColorBox size={32} color="white" iconName={currentTypeConfig.iconName} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align="start"
              sideOffset={6}
              className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 min-w-[190px] z-50 origin-bottom-left animate-in fade-in-0 zoom-in-95 duration-100"
            >
              {CLASS_ITEM_TYPE_CONFIGS.map((c) => (
                <DropdownMenu.Item
                  key={c.type}
                  onSelect={() => setSelectedType(c.type)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-1.5 text-sm text-slate-700 cursor-default select-none outline-none',
                    'data-[highlighted]:bg-slate-50',
                    selectedType === c.type && 'font-medium',
                  )}
                >
                  <ColorBox size={28} color="white" iconName={c.iconName} />
                  {c.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Start typing to add..."
          className="flex-1 text-sm text-slate-900 placeholder-slate-400 font-display font-light bg-transparent focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          aria-label="Add class item"
          className="text-slate-400 hover:text-slate-700 transition-colors"
        >
          <CornerDownLeft size={16} />
        </button>
      </div>
    </div>
  );
}

function SubItemRow({ subItem, onDelete }: { subItem: ClassSubItem; onDelete: () => void }) {
  const config = getClassItemTypeConfig(subItem.type);
  return (
    <div className="flex items-center gap-3 pr-4 pl-8 py-3 group">
      <ColorBox size={32} color="white" iconName={config.iconName} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
          {config.label}
        </p>
        <p className="font-display font-bold text-m text-slate-800 truncate">{subItem.title}</p>
      </div>
      <button
        onClick={onDelete}
        aria-label={`Delete "${subItem.title}"`}
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-slate-600 hover:text-slate-800 transition-all p-1"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
