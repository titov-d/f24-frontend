import React from 'react';
import CardIcon from '@/components/HolidayList/icons/CardIcon';
import ListIcon from '@/components/HolidayList/icons/ListIcon';
import { ViewMode } from '../types';

interface ViewSelectorProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  onViewChange
}) => {
  return (
    <div className="hidden space-x-2 md:flex">
      <button
        onClick={() => onViewChange('cards')}
        className={`flex min-w-max items-center gap-2 rounded-md px-4 py-2 transition-all ${
          viewMode === 'cards'
            ? 'bg-white text-black shadow-sm'
            : 'bg-none hover:bg-black hover:bg-opacity-5'
        }`}
      >
        <CardIcon />
        Vista de Tarjetas
      </button>

      <button
        onClick={() => onViewChange('list')}
        className={`flex min-w-max items-center gap-2 rounded-md px-4 py-2 transition-all ${
          viewMode === 'list'
            ? 'bg-white text-black shadow-sm'
            : 'bg-none hover:bg-black hover:bg-opacity-5'
        }`}
      >
        <ListIcon />
        Vista de Lista
      </button>
    </div>
  );
};