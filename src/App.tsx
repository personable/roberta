import { useState, useCallback } from 'react';
import type { Block, ItemType, ClassItemType, ScheduleItem } from './types';
import {
  getWeekStart,
  getItems,
  saveItems,
  getDayType,
} from './lib/storage';
import AppHeader from './components/AppHeader';
import DayHeader from './components/DayHeader';
import BlockSidebar from './components/BlockSidebar';
import BlockContent from './components/BlockContent';
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

function getTodayDayIndex(): number {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  if (day === 0 || day === 6) return 0; // weekend → default to Monday
  return day - 1; // Mon=0 ... Fri=4
}

export default function App() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex);
  const [selectedBlockId, setSelectedBlockId] = useState('block1');
  const [drawerItem, setDrawerItem] = useState<ScheduleItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Derive weekStart from weekOffset
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekStart = getWeekStart(baseDate);

  const currentBlock = BLOCKS.find((b) => b.id === selectedBlockId) ?? BLOCKS[0];

  const handleDayTypeForIndex = useCallback(
    (dayIndex: number) => getDayType(weekStart, dayIndex),
    [weekStart],
  );

  // Render token forces re-reads from localStorage after mutations
  const [renderToken, setRenderToken] = useState(0);
  void renderToken;

  // Read items each render — simple and correct for single-tab use
  const currentItems = getItems(weekStart, selectedDayIndex, selectedBlockId);

  function handleAddItem(title: string, type: ItemType) {
    const newItem: ScheduleItem = {
      id: crypto.randomUUID(),
      type,
      title,
    };
    const updated = [...currentItems, newItem];
    saveItems(weekStart, selectedDayIndex, selectedBlockId, updated);
    setRenderToken((t) => t + 1);
  }

  function handleItemClick(item: ScheduleItem) {
    setDrawerItem(item);
    setDrawerOpen(true);
  }

  function handleSaveItem(updated: ScheduleItem) {
    const next = currentItems.map((it) => (it.id === updated.id ? updated : it));
    saveItems(weekStart, selectedDayIndex, selectedBlockId, next);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteItem(id: string) {
    const next = currentItems.filter((it) => it.id !== id);
    saveItems(weekStart, selectedDayIndex, selectedBlockId, next);
    setDrawerOpen(false);
    setDrawerItem(null);
    setRenderToken((t) => t + 1);
  }

  function handleAddClassSubItem(classItemId: string, title: string, type: ClassItemType) {
    const updated = currentItems.map((item) => {
      if (item.id !== classItemId) return item;
      return {
        ...item,
        classItems: [
          ...(item.classItems ?? []),
          { id: crypto.randomUUID(), type, title },
        ],
      };
    });
    saveItems(weekStart, selectedDayIndex, selectedBlockId, updated);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteClassSubItem(classItemId: string, subItemId: string) {
    const updated = currentItems.map((item) => {
      if (item.id !== classItemId) return item;
      return {
        ...item,
        classItems: (item.classItems ?? []).filter((s) => s.id !== subItemId),
      };
    });
    saveItems(weekStart, selectedDayIndex, selectedBlockId, updated);
    setRenderToken((t) => t + 1);
  }

  function handleDeleteAll() {
    saveItems(weekStart, selectedDayIndex, selectedBlockId, []);
    setDrawerOpen(false);
    setDrawerItem(null);
    setRenderToken((t) => t + 1);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <AppHeader />

      <DayHeader
        weekStart={weekStart}
        selectedDayIndex={selectedDayIndex}
        getDayType={handleDayTypeForIndex}
        onSelectDay={setSelectedDayIndex}
        onPrevWeek={() => setWeekOffset((o) => o - 1)}
        onNextWeek={() => setWeekOffset((o) => o + 1)}
      />

      <div className="flex flex-1 overflow-hidden">
        <BlockSidebar
          blocks={BLOCKS}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <BlockContent
            key={`${weekStart}-${selectedDayIndex}-${selectedBlockId}`}
            block={currentBlock}
            items={currentItems}
            onItemClick={handleItemClick}
            onDeleteAll={handleDeleteAll}
            onDeleteItem={handleDeleteItem}
            onAddClassSubItem={handleAddClassSubItem}
            onDeleteClassSubItem={handleDeleteClassSubItem}
          />

          <AddItemBar onAdd={handleAddItem} />
        </div>
      </div>

      <ItemDrawer
        item={drawerItem}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
