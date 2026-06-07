import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CornerDownLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import { ITEM_TYPE_CONFIGS } from '../lib/itemTypes';
import ColorBox from './ColorBox';
import type { ItemType } from '../types';

interface AddItemBarProps {
  onAdd: (title: string, type: ItemType) => void;
  activeBlockName: string;
}

export default function AddItemBar({ onAdd, activeBlockName }: AddItemBarProps) {
  const [selectedType, setSelectedType] = useState<ItemType>('reminder');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentConfig = ITEM_TYPE_CONFIGS.find((c) => c.type === selectedType)!;

  function handleSubmit() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAdd(trimmed, selectedType);
    setInputValue('');
  }

  return (
    <div className={cn(
      'relative h-20 flex items-center gap-4 px-6 bg-white shrink-0 border-l-transparent border-r-slate-400 border-t border-t-slate-200',
      isFocused && 'border-slate-600',
    )}>
      {/* Type picker */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            aria-label={`Item type: ${currentConfig.label}. Click to change`}
            className="shrink-0 transition-opacity hover:opacity-75"
          >
            <ColorBox size={32} color={currentConfig.color} iconName={currentConfig.iconName} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="top"
            align="start"
            sideOffset={8}
            className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 min-w-[200px] z-50 origin-bottom-left animate-in fade-in-0 zoom-in-95 duration-100"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              inputRef.current?.focus();
            }}
          >
            {ITEM_TYPE_CONFIGS.map((c) => (
              <DropdownMenu.Item
                key={c.type}
                onSelect={() => setSelectedType(c.type)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 cursor-default select-none outline-none',
                  'data-[highlighted]:bg-slate-50',
                  selectedType === c.type && 'font-medium',
                )}
              >
                <ColorBox size={28} color={c.color} iconName={c.iconName} />
                {c.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        placeholder={`Add item to ${activeBlockName}…`}
        className="flex-1 text-lg text-slate-900 placeholder-slate-600 font-display font-light bg-transparent focus:outline-none"
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        aria-label="Add item"
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      >
        <CornerDownLeft size={16} />
      </button>
    </div>
  );
}
