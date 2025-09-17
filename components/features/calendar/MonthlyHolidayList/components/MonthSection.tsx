import React from 'react';
import { Holiday } from '../types';
import { HolidayItem } from './HolidayItem';

interface MonthSectionProps {
  monthYear: string;
  holidays: Holiday[];
  nextNonWeekendHoliday: Holiday | null;
}

export const MonthSection: React.FC<MonthSectionProps> = ({
  monthYear,
  holidays,
  nextNonWeekendHoliday
}) => {
  return (
    <div>
      <h2 className="my-4 text-center text-2xl font-normal capitalize text-[#686868] md:text-left">
        {monthYear}
      </h2>
      {holidays.map((holiday, index) => (
        <HolidayItem
          key={`${holiday.date}-${index}`}
          holiday={holiday}
          isNextNonWeekendHoliday={holiday.date === nextNonWeekendHoliday?.date}
        />
      ))}
    </div>
  );
};