import { useState, useCallback, useRef } from 'react';
import type { Block, ItemType, ClassItemType, DayType, ScheduleItem } from './types';
import {
  getWeekStart,
  getItems,
  saveItems,
  getDayType,
  setDayType,
} from './lib/storage';
import AppHeader from './components/AppHeader';
import DayHeader from './components/DayHeader';
import BlockSidebar from './components/BlockSidebar';
import AllBlocksContent, { type AllBlocksContentHandle } from './components/AllBlocksContent';
import ItemDrawer from './components/ItemDrawer';
import AddItemBar from './components/AddItemBar';

export const BLOCKS: Block[] = [
  { id: 'before', name: 'Before School', time: '' },
  { id: 'block1', name: 'Block 1', time: '8:25 – 8:49' },
  { id: 'block2', name: 'Block 2', time: '8:50 – 9:38' },
  { id: 'block3', name: 'Block 3', time: '9:40 – 10:28' },
  { id: 'block4', name: 'Block 4', time: '10:30 – 11:18' },
  { id: 'block5', name: 'Block 5', time: '11:20 – 12:08' },
  { id: 'block67', name: 'Blocks 6 & 7', time: '1:20 – 3:00' },
  { id: 'after', name: 'After School', time: '' },
];

function getInitialState(): { weekOffset: number; dayIndex: number } {
  const day = new Date().getDay(); // 0 = Sun, 6 = Sat
  if (day === 0) return { weekOffset: 1, dayIndex: 0 }; // Sunday → next Monday
  if (day === 6) return { weekOffset: 1, dayIndex: 0 }; // Saturday → next Monday
  return { weekOffset: 0, dayIndex: day - 1 };          // Mon–Fri → today
}

const { weekOffset: initialWeekOffset, dayIndex: initialDayIndex } = getInitialState();

export default function App() {
  const [weekOffset, setWeekOffset] = useState(initialWeekOffset);
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);
  const [activeBlockId, setActiveBlockId] = useState(BLOCKS[0].id);

  // Drawer stores the item AND which block it lives in
  const [drawerItem, setDrawerItem] = useState<{ item: ScheduleItem; blockId: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addToAllDayIndex, setAddToAllDayIndex] = useState<number | null>(null);

  const allBlocksRef = useRef<AllBlocksContentHandle>(null);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekStart = getWeekStart(baseDate);

  const handleDayTypeForIndex = useCallback(
    (dayIndex: number) => getDayType(weekStart, dayIndex),
    [weekStart],
  );

  const [renderToken, setRenderToken] = useState(0);
  void renderToken;

  // Read items for every block on each render
  const allItems: Record<string, ScheduleItem[]> = Object.fromEntries(
    BLOCKS.map((b) => [b.id, getItems(weekStart, selectedDayIndex, b.id)]),
  );

  function handleAddItem(title: string, type: ItemType) {
    const newItem: ScheduleItem = { id: crypto.randomUUID(), type, title };
    const existing = getItems(weekStart, selectedDayIndex, activeBlockId);
    saveItems(weekStart, selectedDayIndex, activeBlockId, [...existing, newItem]);
    setRenderToken((t) => t + 1);
  }

  function handleItemClick(item: ScheduleItem, blockId: string) {
    setDrawerItem({ item, blockId });
    setDrawerOpen(true);
  }

  function handleSaveItem(updated: ScheduleItem) {
    if (!drawerItem) return;
    const blockItems = getItems(weekStart, selectedDayIndex, drawerItem.blockId);
    const next = blockItems.map((it) => (it.id === updated.id ? updated : it));
    saveItems(weekStart, selectedDayIndex, drawerItem.blockId, next);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteItem(blockId: string, id: string) {
    const blockItems = getItems(weekStart, selectedDayIndex, blockId);
    const next = blockItems.filter((it) => it.id !== id);
    saveItems(weekStart, selectedDayIndex, blockId, next);
    if (drawerItem?.item.id === id) {
      setDrawerOpen(false);
      setDrawerItem(null);
    }
    setRenderToken((t) => t + 1);
  }

  function handleClearAllBlocks(dayIndex: number) {
    BLOCKS.forEach((block) => saveItems(weekStart, dayIndex, block.id, []));
    if (drawerItem) {
      setDrawerOpen(false);
      setDrawerItem(null);
    }
    setRenderToken((t) => t + 1);
  }

  function handleSetDayType(dayIndex: number, type: DayType) {
    setDayType(weekStart, dayIndex, type);
    setRenderToken((t) => t + 1);
  }

  function handleAddToAllBlocks(dayIndex: number) {
    setAddToAllDayIndex(dayIndex);
  }

  function handleAddToAllDone(title: string, type: ItemType, description?: string) {
    if (addToAllDayIndex === null) return;
    BLOCKS.forEach((block) => {
      const blockItems = getItems(weekStart, addToAllDayIndex, block.id);
      const newItem: ScheduleItem = { id: crypto.randomUUID(), type, title, description };
      saveItems(weekStart, addToAllDayIndex, block.id, [...blockItems, newItem]);
    });
    setAddToAllDayIndex(null);
    setRenderToken((t) => t + 1);
  }

  function handleToggleComplete(blockId: string, itemId: string) {
    const blockItems = getItems(weekStart, selectedDayIndex, blockId);
    const next = blockItems.map((it) =>
      it.id === itemId ? { ...it, completed: !it.completed } : it,
    );
    saveItems(weekStart, selectedDayIndex, blockId, next);
    setRenderToken((t) => t + 1);
  }

  function handleMoveItem(fromBlockId: string, toBlockId: string, itemId: string) {
    const fromItems = getItems(weekStart, selectedDayIndex, fromBlockId);
    const item = fromItems.find((it) => it.id === itemId);
    if (!item) return;
    saveItems(weekStart, selectedDayIndex, fromBlockId, fromItems.filter((it) => it.id !== itemId));
    const toItems = getItems(weekStart, selectedDayIndex, toBlockId);
    saveItems(weekStart, selectedDayIndex, toBlockId, [...toItems, item]);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteAll(blockId: string) {
    saveItems(weekStart, selectedDayIndex, blockId, []);
    if (drawerItem?.blockId === blockId) {
      setDrawerOpen(false);
      setDrawerItem(null);
    }
    setRenderToken((t) => t + 1);
  }

  function handleAddClassSubItem(blockId: string, classItemId: string, title: string, type: ClassItemType) {
    const blockItems = getItems(weekStart, selectedDayIndex, blockId);
    const updated = blockItems.map((item) => {
      if (item.id !== classItemId) return item;
      return {
        ...item,
        classItems: [...(item.classItems ?? []), { id: crypto.randomUUID(), type, title }],
      };
    });
    saveItems(weekStart, selectedDayIndex, blockId, updated);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteClassSubItem(blockId: string, classItemId: string, subItemId: string) {
    const blockItems = getItems(weekStart, selectedDayIndex, blockId);
    const updated = blockItems.map((item) => {
      if (item.id !== classItemId) return item;
      return {
        ...item,
        classItems: (item.classItems ?? []).filter((s) => s.id !== subItemId),
      };
    });
    saveItems(weekStart, selectedDayIndex, blockId, updated);
    setRenderToken((t) => t + 1);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 min-w-[768px]">
      <AppHeader
        weekStart={weekStart}
        onPrevWeek={() => setWeekOffset((o) => o - 1)}
        onNextWeek={() => setWeekOffset((o) => o + 1)}
      />

      <DayHeader
        weekStart={weekStart}
        selectedDayIndex={selectedDayIndex}
        getDayType={handleDayTypeForIndex}
        onSelectDay={setSelectedDayIndex}
        onPrevWeek={() => setWeekOffset((o) => o - 1)}
        onNextWeek={() => setWeekOffset((o) => o + 1)}
        onSetDayType={handleSetDayType}
        onAddToAllBlocks={handleAddToAllBlocks}
        onClearAllBlocks={handleClearAllBlocks}
      />

      <div className="flex flex-1 overflow-hidden">
        <BlockSidebar
          blocks={BLOCKS}
          activeBlockId={activeBlockId}
          onScrollToBlock={(id) => allBlocksRef.current?.scrollToBlock(id)}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AllBlocksContent
            ref={allBlocksRef}
            blocks={BLOCKS}
            allItems={allItems}
            dayKey={`${weekStart}-${selectedDayIndex}`}
            activeBlockId={activeBlockId}
            onActiveBlockChange={setActiveBlockId}
            onItemClick={handleItemClick}
            onDeleteAll={handleDeleteAll}
            onDeleteItem={handleDeleteItem}
            onMoveItem={handleMoveItem}
            onToggleComplete={handleToggleComplete}
            onAddClassSubItem={handleAddClassSubItem}
            onDeleteClassSubItem={handleDeleteClassSubItem}
          />

          <AddItemBar
            onAdd={handleAddItem}
            activeBlockName={BLOCKS.find((b) => b.id === activeBlockId)?.name ?? ''}
          />
        </div>
      </div>

      <ItemDrawer
        item={drawerItem?.item ?? null}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveItem}
        onDelete={(id) => drawerItem && handleDeleteItem(drawerItem.blockId, id)}
      />

      <ItemDrawer
        item={null}
        open={addToAllDayIndex !== null}
        onClose={() => setAddToAllDayIndex(null)}
        onSave={() => {}}
        onDelete={() => {}}
        onAddToAll={handleAddToAllDone}
      />
    </div>
  );
}
