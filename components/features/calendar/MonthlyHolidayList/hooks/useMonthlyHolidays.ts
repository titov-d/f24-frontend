import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Holiday } from '../types';
import { isWeekend } from '../utils/dateUtils';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1';

export const useMonthlyHolidays = (startMonth: number, endMonth: number, year: number) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextNonWeekendHoliday, setNextNonWeekendHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${API_URL}/holidays/next`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const filteredHolidays = data.holidays
          .filter((holiday: Holiday) => {
            const holidayDate = dayjs(holiday.date);
            const holidayMonth = holidayDate.month() + 1;
            return (
              holidayDate.year() === year &&
              holidayMonth >= startMonth &&
              holidayMonth <= endMonth
            );
          })
          .sort((a: Holiday, b: Holiday) => dayjs(a.date).diff(dayjs(b.date)));

        setHolidays(filteredHolidays);

        const now = dayjs().tz('America/Santiago');
        const nextNonWeekend = filteredHolidays.find(
          (holiday: Holiday) =>
            dayjs(holiday.date).isAfter(now, 'day') && !isWeekend(holiday.date)
        );
        setNextNonWeekendHoliday(nextNonWeekend || null);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setError('Failed to load holiday data');
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [startMonth, endMonth, year]);

  return {
    holidays,
    loading,
    error,
    nextNonWeekendHoliday
  };
};