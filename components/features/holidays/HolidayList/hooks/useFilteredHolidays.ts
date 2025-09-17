import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { Holiday, HolidayFilters } from '../types';
import { isWeekend } from '../utils/dateUtils';

export const useFilteredHolidays = (holidays: Holiday[], filters: HolidayFilters) => {
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);
  const [visibleNextHoliday, setVisibleNextHoliday] = useState<Holiday | null>(null);

  const filterHolidays = useMemo(() => {
    const currentYear = dayjs().year();
    const now = dayjs().tz('America/Santiago');

    return holidays.filter((holiday) => {
      const holidayYear = dayjs(holiday.date).year();
      const isWeekendDay = isWeekend(holiday.date);

      return (filters.showWeekends || !isWeekendDay) &&
             (filters.showNextYear || holidayYear === currentYear);
    });
  }, [holidays, filters.showWeekends, filters.showNextYear]);

  useEffect(() => {
    setFilteredHolidays(filterHolidays);

    const now = dayjs().tz('America/Santiago');

    // Set current and next holidays
    const pastHolidays = holidays.filter((holiday) =>
      dayjs(holiday.date).isSameOrBefore(now, 'day')
    );
    const futureHolidays = holidays.filter((holiday) =>
      dayjs(holiday.date).isAfter(now, 'day')
    );

    setCurrentHoliday(pastHolidays.length > 0 ? pastHolidays[pastHolidays.length - 1] : null);
    setNextHoliday(futureHolidays[0] || null);

    // Set visible next holiday
    const nextVisible = filterHolidays.find(
      (holiday) => dayjs(holiday.date).isAfter(now, 'day') ||
                   dayjs(holiday.date).isSame(now, 'day')
    );
    setVisibleNextHoliday(nextVisible || null);
  }, [holidays, filterHolidays]);

  return {
    filteredHolidays,
    nextHoliday,
    currentHoliday,
    visibleNextHoliday
  };
};