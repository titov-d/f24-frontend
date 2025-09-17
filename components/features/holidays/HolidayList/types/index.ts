export interface Holiday {
  date: string;
  name: string;
  description: string;
  irrenunciable?: boolean;
}

export interface ViewStyles {
  container: string;
  item: string;
}

export type ViewMode = 'cards' | 'list';

export interface HolidayCountdown {
  days: number;
  hours: number;
}

export interface HolidayFilters {
  showWeekends: boolean;
  showNextYear: boolean;
}