import React from 'react';
import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox';
import { HolidayFilters as FiltersType } from '../types';

interface HolidayFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
}

export const HolidayFilters: React.FC<HolidayFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const handleWeekendsChange = () => {
    onFilterChange({ ...filters, showWeekends: !filters.showWeekends });
  };

  const handleNextYearChange = () => {
    onFilterChange({ ...filters, showNextYear: !filters.showNextYear });
  };

  return (
    <div className="flex items-center md:gap-4">
      <div
        className="flex cursor-pointer items-center gap-2 rounded-md bg-none px-4 py-2 transition-all hover:bg-black hover:bg-opacity-5"
        onClick={handleWeekendsChange}
      >
        <CustomCheckbox
          checked={filters.showWeekends}
          onChange={handleWeekendsChange}
          className="custom-checkbox__input hover:cursor-pointer"
          aria-label="Mostrar feriados en fines de semana"
          color="#000000"
        />
        <p className="font-semibold leading-[28px] text-gray-600">
          Mostrar feriados en&nbsp;findes
        </p>
      </div>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-md bg-none px-4 py-2 transition-all hover:bg-black hover:bg-opacity-5"
        onClick={handleNextYearChange}
      >
        <CustomCheckbox
          checked={filters.showNextYear}
          onChange={handleNextYearChange}
          className="custom-checkbox__input"
          aria-label="Feriados 2025"
          color="#000000"
        />
        <p className="font-semibold leading-[28px] text-gray-600">Feriados 2025</p>
      </div>
    </div>
  );
};