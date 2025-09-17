// API functions for holidays
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1';

export interface ApiHoliday {
  id?: string;
  date: string;
  name: string;
  description: string;
  irrenunciable?: boolean;
  type?: string;
  legal_basis?: string;
}

export interface HolidaysResponse {
  holidays: ApiHoliday[];
  total: number;
  year: number;
}

export async function fetchHolidays(year: number): Promise<HolidaysResponse> {
  const response = await fetch(`${API_URL}/holidays-simple/?year=${year}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch holidays: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchHolidayById(id: string): Promise<ApiHoliday> {
  const response = await fetch(`${API_URL}/holidays/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch holiday: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchLongWeekends(year: number) {
  const response = await fetch(`${API_URL}/long-weekends/?year=${year}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch long weekends: ${response.statusText}`);
  }

  return response.json();
}