'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Holiday, ViewMode, HolidayFilters as FiltersType } from './types';
import { HolidayCard } from './components/HolidayCard';
import { HolidayListItem } from './components/HolidayListItem';
import { HolidayFilters } from './components/HolidayFilters';
import { ViewSelector } from './components/ViewSelector';
import { useHolidays } from './hooks/useHolidays';
import { useFilteredHolidays } from './hooks/useFilteredHolidays';
import { useWindowWidth } from './hooks/useWindowWidth';

const HolidayList: React.FC = () => {
  const windowWidth = useWindowWidth();
  const { holidays, loading, error } = useHolidays();
  const [viewMode, setViewMode] = useState<ViewMode>(windowWidth <= 768 ? 'list' : 'cards');
  const [filters, setFilters] = useState<FiltersType>({
    showWeekends: false,
    showNextYear: true
  });

  const {
    filteredHolidays,
    nextHoliday,
    currentHoliday: _currentHoliday,
    visibleNextHoliday
  } = useFilteredHolidays(holidays, filters);

  useEffect(() => {
    setViewMode(windowWidth <= 768 ? 'list' : 'cards');
  }, [windowWidth]);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!nextHoliday) return <div>No hay próximos feriados</div>;

  const renderHolidaysByMonth = () => {
    const holidaysByMonth: { [key: string]: Holiday[] } = {};

    filteredHolidays.forEach((holiday) => {
      const monthYear = dayjs(holiday.date).format('MMMM YYYY');
      if (!holidaysByMonth[monthYear]) {
        holidaysByMonth[monthYear] = [];
      }
      holidaysByMonth[monthYear].push(holiday);
    });

    return Object.entries(holidaysByMonth).map(([monthYear, monthHolidays]) => (
      <div key={monthYear}>
        <h2 className="my-4 text-center text-2xl font-normal capitalize text-[#686868] md:text-left">
          {monthYear}
        </h2>
        {monthHolidays.map((holiday, index) => (
          <HolidayListItem
            key={`${holiday.date}-${index}`}
            holiday={holiday}
            isNextVisibleHoliday={holiday.date === visibleNextHoliday?.date}
            showWeekends={filters.showWeekends}
          />
        ))}
      </div>
    ));
  };

  const renderHolidaysWithYearSeparator = () => {
    let previousYear: number | null = null;
    const renderedHolidays: JSX.Element[] = [];

    filteredHolidays.forEach((holiday, index) => {
      const holidayYear = dayjs(holiday.date).year();

      if (previousYear !== null && holidayYear !== previousYear) {
        renderedHolidays.push(
          <div
            key={`year-separator-${holidayYear}`}
            className="relative hidden items-end border-l border-dashed border-gray-300 md:flex"
          >
            <span className="absolute -left-[18px] z-10 bg-[#F8F7FA] font-semibold text-gray-500">
              {holidayYear}
            </span>
          </div>
        );
      }

      renderedHolidays.push(
        <HolidayCard
          key={`${holiday.date}-${index}`}
          holiday={holiday}
          isNextVisibleHoliday={holiday.date === visibleNextHoliday?.date}
          showWeekends={filters.showWeekends}
        />
      );
      previousYear = holidayYear;
    });

    return renderedHolidays;
  };

  return (
    <div className="border-none">
      <div className="m-auto flex flex-col items-center justify-between gap-4 rounded-md bg-black bg-opacity-[2%] px-4 py-2 shadow-inner md:flex-row lg:max-w-5xl xl:max-w-7xl">
        <HolidayFilters filters={filters} onFilterChange={setFilters} />
        <ViewSelector viewMode={viewMode} onViewChange={setViewMode} />
      </div>
      <div
        className={
          viewMode === 'cards'
            ? 'flex gap-6 overflow-x-auto'
            : 'flex flex-col gap-4 lg:max-w-5xl xl:max-w-7xl m-auto md:mt-4 p-4 md:p-0'
        }
      >
        {viewMode === 'cards' ? renderHolidaysWithYearSeparator() : renderHolidaysByMonth()}
      </div>
    </div>
  );
};

export default HolidayList;