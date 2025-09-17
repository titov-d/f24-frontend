import { useState, useEffect } from 'react';
import { fetchHolidays, ApiHoliday } from '@/lib/api/holidays';

interface UseHolidaysResult {
  holidays: ApiHoliday[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHolidays(year?: number): UseHolidaysResult {
  const [holidays, setHolidays] = useState<ApiHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const currentYear = year || new Date().getFullYear();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchHolidays(currentYear);
      setHolidays(response.holidays);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentYear]);

  return { holidays, loading, error, refetch: fetchData };
}