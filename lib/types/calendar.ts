export interface CalendarDay {
  date: string;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  dayOfMonth: number;
  isWeekend: boolean;
  isHoliday: boolean;
  isToday: boolean;
  holidayName?: string;
  holidayType?: string;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

export interface CalendarMonth {
  year: number;
  month: number; // 1-12
  monthName: string;
  weeks: CalendarWeek[];
  totalDays: number;
  holidays: number;
  weekends: number;
}

export interface CalendarYear {
  year: number;
  months: CalendarMonth[];
  totalHolidays: number;
  totalLongWeekends: number;
}