'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001/api/v1';

interface Holiday {
  date: string;
  name: string;
  description?: string;
  irrenunciable?: boolean;
  is_irrenunciable?: boolean;
  type?: string;
}

interface KanbanCalendarProps {
  year: number;
}

const MONTHS = [
  { name: 'Enero', color: '#4C9AFF' },      // Blue
  { name: 'Febrero', color: '#F99CDB' },    // Pink
  { name: 'Marzo', color: '#79E2F2' },      // Cyan
  { name: 'Abril', color: '#7EE2B8' },      // Green
  { name: 'Mayo', color: '#FFC400' },       // Yellow
  { name: 'Junio', color: '#FF8B00' },      // Orange
  { name: 'Julio', color: '#FF5630' },      // Red
  { name: 'Agosto', color: '#B38BFF' },     // Purple
  { name: 'Septiembre', color: '#57D9A3' }, // Teal
  { name: 'Octubre', color: '#FFC400' },    // Yellow
  { name: 'Noviembre', color: '#FF7452' },  // Coral
  { name: 'Diciembre', color: '#2684FF' },  // Bright Blue
];

const KanbanCalendar: React.FC<KanbanCalendarProps> = ({ year }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${API_URL}/holidays/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // API returns array directly, filter by year and deduplicate by date+name
        const yearHolidays = data.filter((h: { date: string; year?: number }) =>
          h.year === year || dayjs(h.date).year() === year
        );
        // Deduplicate by date (some dates have duplicate entries)
        const seen = new Set<string>();
        const uniqueHolidays = yearHolidays.filter((h: Holiday) => {
          const key = `${h.date}-${h.name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setHolidays(uniqueHolidays);
      } catch (err) {
        console.error('Error fetching holidays:', err);
        setError('Error cargando feriados');
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [year]);

  const getHolidaysByMonth = (monthIndex: number): Holiday[] => {
    return holidays.filter(h => dayjs(h.date).month() === monthIndex)
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  };

  const isWeekend = (date: string): boolean => {
    const day = dayjs(date).day();
    return day === 0 || day === 6;
  };

  const isPastDate = (date: string): boolean => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  const isCurrentMonth = (monthIndex: number): boolean => {
    return dayjs().month() === monthIndex && dayjs().year() === year;
  };

  const formatDate = (date: string): string => {
    return dayjs(date).format('D MMM');
  };

  const getDayName = (date: string): string => {
    return dayjs(date).format('dddd');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-lg text-gray-500">Cargando calendario...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="kanban-calendar w-full overflow-x-auto pb-4">
      <div className="flex min-w-max gap-3 px-4">
        {MONTHS.map((month, index) => {
          const monthHolidays = getHolidaysByMonth(index);
          const isCurrent = isCurrentMonth(index);

          return (
            <div
              key={month.name}
              className={`kanban-column flex w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-lg ${
                isCurrent
                  ? 'ring-2 ring-blue-400'
                  : ''
              }`}
              style={{ backgroundColor: '#F4F5F7' }}
            >
              {/* Colored top border */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: month.color }}
              />

              {/* Column Header */}
              <div className="bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {month.name}
                  </h3>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                    {monthHolidays.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-2 p-3" style={{ minHeight: '400px' }}>
                {monthHolidays.length === 0 ? (
                  <div className="flex h-20 items-center justify-center text-sm text-gray-400">
                    Sin feriados
                  </div>
                ) : (
                  monthHolidays.map((holiday, idx) => {
                    const isPast = isPastDate(holiday.date);
                    const weekend = isWeekend(holiday.date);

                    return (
                      <div
                        key={`${holiday.date}-${idx}`}
                        className={`kanban-card rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md ${
                          isPast ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Card Header - Date */}
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`text-xs font-semibold uppercase ${
                            weekend ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {getDayName(holiday.date)}
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            {formatDate(holiday.date)}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h4 className="mb-2 text-sm font-medium text-gray-800">
                          {holiday.name}
                        </h4>

                        {/* Card Footer - Labels */}
                        <div className="flex flex-wrap gap-1">
                          {(holiday.irrenunciable || holiday.is_irrenunciable) && (
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                              Irrenunciable
                            </span>
                          )}
                          {weekend && (
                            <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                              Fin de semana
                            </span>
                          )}
                          {isPast && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                              Pasado
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanCalendar;
