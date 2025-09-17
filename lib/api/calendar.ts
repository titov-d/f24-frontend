// API functions for calendar
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1';

export interface CalendarMonth {
  month: number;
  year: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  date: string;
  isHoliday: boolean;
  isWeekend: boolean;
  holidayName?: string;
}

export async function fetchCalendarMonth(month: number, year: number): Promise<CalendarMonth> {
  const response = await fetch(`${API_URL}/calendar/${year}/${month}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCalendarYear(year: number): Promise<CalendarMonth[]> {
  const response = await fetch(`${API_URL}/calendar/${year}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch yearly calendar: ${response.statusText}`);
  }

  return response.json();
}