import { useState, useEffect } from 'react';
import { fetchCalendarMonth, CalendarMonth } from '@/lib/api/calendar';

interface UseCalendarResult {
  calendar: CalendarMonth | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCalendar(month: number, year: number): UseCalendarResult {
  const [calendar, setCalendar] = useState<CalendarMonth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCalendarMonth(month, year);
      setCalendar(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month && year) {
      fetchData();
    }
  }, [month, year]);

  return { calendar, loading, error, refetch: fetchData };
}