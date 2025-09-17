'use client';

import React from 'react';
import dayjs from 'dayjs';
import { MonthlyHolidayListProps, HolidaysByMonth } from './types';
import { useMonthlyHolidays } from './hooks/useMonthlyHolidays';
import { MonthSection } from './components/MonthSection';
import { Navigation } from './components/Navigation';

const MonthlyHolidayList: React.FC<MonthlyHolidayListProps> = ({
  startMonth,
  endMonth,
  year
}) => {
  const { holidays, loading, error, nextNonWeekendHoliday } = useMonthlyHolidays(
    startMonth,
    endMonth,
    year
  );

  const isSingleMonth = startMonth === endMonth;

  const groupHolidaysByMonth = (): HolidaysByMonth => {
    const holidaysByMonth: HolidaysByMonth = {};

    holidays.forEach((holiday) => {
      const monthYear = dayjs(holiday.date).format('MMMM YYYY');
      if (!holidaysByMonth[monthYear]) {
        holidaysByMonth[monthYear] = [];
      }
      holidaysByMonth[monthYear].push(holiday);
    });

    return holidaysByMonth;
  };

  if (loading) {
    return (
      <div className="m-auto flex flex-col gap-4 p-4 md:mt-4 md:p-0 lg:max-w-5xl xl:max-w-7xl">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-auto flex flex-col gap-4 p-4 md:mt-4 md:p-0 lg:max-w-5xl xl:max-w-7xl">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (holidays.length === 0) {
    return (
      <div className="m-auto flex flex-col gap-4 p-4 md:mt-4 md:p-0 lg:max-w-5xl xl:max-w-7xl">
        <div className="text-center">No hay feriados en este período</div>
        {isSingleMonth && <Navigation currentMonth={startMonth} year={year} />}
      </div>
    );
  }

  const holidaysByMonth = groupHolidaysByMonth();

  return (
    <div className="m-auto flex flex-col gap-4 p-4 md:mt-4 md:p-0 lg:max-w-5xl xl:max-w-7xl">
      {Object.entries(holidaysByMonth).map(([monthYear, monthHolidays]) => (
        <MonthSection
          key={monthYear}
          monthYear={monthYear}
          holidays={monthHolidays}
          nextNonWeekendHoliday={nextNonWeekendHoliday}
        />
      ))}
      {isSingleMonth && <Navigation currentMonth={startMonth} year={year} />}
    </div>
  );
};

export default MonthlyHolidayList;