export type ItemType = 'reminder' | 'prep' | 'meeting' | 'personal' | 'class' | 'testing' | 'supervise';

export type ClassItemType = 'bell-work' | 'announcement' | 'reminder' | 'lesson' | 'wrap-up' | 'other';

export interface ClassSubItem {
  id: string;
  type: ClassItemType;
  title: string;
}

export interface ScheduleItem {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  classItems?: ClassSubItem[];
  completed?: boolean;
}

export interface Block {
  id: string;
  name: string;
  time: string;
}

export type DayType = 'red' | 'white';
