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
        const response = await fetch(`${API_URL}/holidays-simple/?year=${currentYear}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const now = dayjs().tz('America/Santiago');
        const sortedHolidays = data.holidays.sort((a: Holiday, b: Holiday) => {
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