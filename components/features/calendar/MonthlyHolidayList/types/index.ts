export interface Holiday {
  date: string;
  name: string;
  description: string;
  irrenunciable?: boolean;
}

export interface MonthlyHolidayListProps {
  startMonth: number; // 1-12
  endMonth: number; // 1-12
  year: number;
}

export interface NavigationLinks {
  prev: string;
  current: string;
  next: string;
}

export interface HolidaysByMonth {
  [key: string]: Holiday[];
}