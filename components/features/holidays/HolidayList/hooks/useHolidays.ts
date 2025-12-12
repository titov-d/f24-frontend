import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Holiday } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1';

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const currentYear = dayjs().year();
        const nextYear = currentYear + 1;

        // Fetch both current and next year holidays
        const [currentResponse, nextResponse] = await Promise.all([
          fetch(`${API_URL}/holidays-simple/?year=${currentYear}`),
          fetch(`${API_URL}/holidays-simple/?year=${nextYear}`)
        ]);

        if (!currentResponse.ok) {
          throw new Error(`HTTP error! status: ${currentResponse.status}`);
        }

        const currentData = await currentResponse.json();
        const nextData = nextResponse.ok ? await nextResponse.json() : { holidays: [] };

        const now = dayjs().tz('America/Santiago');

        // Combine holidays from both years
        const allHolidaysData = [
          ...(currentData.holidays || []),
          ...(nextData.holidays || [])
        ];

        const sortedHolidays = allHolidaysData.sort((a: Holiday, b: Holiday) => {
          return dayjs(a.date).diff(dayjs(b.date));
        });

        const pastHolidays = sortedHolidays.filter((holiday: Holiday) =>
          dayjs(holiday.date).isSameOrBefore(now, 'day')
        );
        const futureHolidays = sortedHolidays.filter((holiday: Holiday) =>
          dayjs(holiday.date).isAfter(now, 'day')
        );

        const recentPastHolidays = pastHolidays.slice(-2);
        const allHolidays = [...recentPastHolidays, ...futureHolidays];

        setHolidays(allHolidays);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  return { holidays, loading, error };
};