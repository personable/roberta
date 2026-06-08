import type { BoxColor } from '../components/ColorBox';
import type { ItemType, ClassItemType } from '../types';

export interface ItemTypeConfig {
  type: ItemType;
  label: string;
  color: BoxColor;
  iconName: string;
  // Used by BlockContent card styling
  cardBg: string;
  borderColor: string;
}

export const ITEM_TYPE_CONFIGS: ItemTypeConfig[] = [
  {
    type: 'reminder',
    label: 'Reminder',
    color: 'yellow',
    iconName: 'AlarmClock',
    cardBg: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
  },
  {
    type: 'prep',
    label: 'Prep',
    color: 'green',
    iconName: 'Sprout',
    cardBg: 'bg-green-50',
    borderColor: 'border-green-400',
  },
  {
    type: 'meeting',
    label: 'Meeting',
    color: 'purple',
    iconName: 'Users',
    cardBg: 'bg-purple-50',
    borderColor: 'border-purple-400',
  },
  {
    type: 'personal',
    label: 'Personal',
    color: 'pink',
    iconName: 'Heart',
    cardBg: 'bg-pink-50',
    borderColor: 'border-pink-400',
  },
  {
    type: 'class',
    label: 'Class',
    color: 'teal',
    iconName: 'Library',
    cardBg: 'bg-teal-50',
    borderColor: 'border-teal-400',
  },
  {
    type: 'testing',
    label: 'Testing',
    color: 'orange',
    iconName: 'ClipboardCheck',
    cardBg: 'bg-orange-50',
    borderColor: 'border-orange-400',
  },
  {
    type: 'supervise',
    label: 'Supervise',
    color: 'red',
    iconName: 'School',
    cardBg: 'bg-red-50',
    borderColor: 'border-red-400',
  },
];

export function getItemTypeConfig(type: ItemType): ItemTypeConfig {
  return ITEM_TYPE_CONFIGS.find((c) => c.type === type) ?? ITEM_TYPE_CONFIGS[0];
}

export interface ClassItemTypeConfig {
  type: ClassItemType;
  label: string;
  iconName: string;
  color: BoxColor;
}

export const CLASS_ITEM_TYPE_CONFIGS: ClassItemTypeConfig[] = [
  { type: 'reminder',      label: 'Reminder',      iconName: 'AlarmClock',    color: 'yellow' },
  { type: 'bell-work',     label: 'Bell Work',     iconName: 'Bell',          color: 'slate' },
  { type: 'announcement',  label: 'Announcement',  iconName: 'Megaphone',     color: 'slate' },
  { type: 'lesson',        label: 'Lesson',        iconName: 'BookOpen',      color: 'slate' },
  { type: 'wrap-up',       label: 'Wrap-Up',       iconName: 'CheckCheck',    color: 'slate' },
  { type: 'other',         label: 'Other',         iconName: 'ArrowRight',    color: 'slate' },
];

export function getClassItemTypeConfig(type: ClassItemType): ClassItemTypeConfig {
  return CLASS_ITEM_TYPE_CONFIGS.find((c) => c.type === type) ?? CLASS_ITEM_TYPE_CONFIGS[0];
}
