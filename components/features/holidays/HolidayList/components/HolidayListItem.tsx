import React from 'react';
import { Holiday } from '../types';
import { formatDateInSpanish, getDayName, getCountdown, isWeekend, isPastDate, isCurrentDate } from '../utils/dateUtils';
import ClockIcon from '@/components/HolidayList/icons/ClockIcon';
import ToolTip from '@/components/ToolTip/ToolTip';
import styles from '../HolidayList.module.css';

interface HolidayListItemProps {
  holiday: Holiday;
  isNextVisibleHoliday: boolean;
  showWeekends: boolean;
}

export const HolidayListItem: React.FC<HolidayListItemProps> = ({
  holiday,
  isNextVisibleHoliday,
  showWeekends
}) => {
  const isPast = isPastDate(holiday.date);
  const isCurrent = isCurrentDate(holiday.date);
  const { days, hours } = getCountdown(holiday.date);
  const holidayCountdown = isPast ? 'Evento pasado' : `${days}d ${hours}h`;
  const isWeekendDay = isWeekend(holiday.date);
  const dayNameClass = showWeekends && isWeekendDay ? 'text-red-500' : '';

  return (
    <div
      className={`flex items-center justify-between py-4 bg-white p-5 rounded-[8px] shadow-lg mb-4 ${
        isPast ? 'opacity-30' : ''
      } ${isCurrent || isNextVisibleHoliday ? styles.glowList : ''}`}
    >
      <div>
        <p className="text-[18px] font-semibold text-[#686868]">
          {formatDateInSpanish(holiday.date)} -{' '}
          <span className={dayNameClass}>{getDayName(holiday.date)}</span>
        </p>
        <div className="flex gap-3">
          <h3 className="text-[16px] text-[#333]">{holiday.name}</h3>
          {holiday.irrenunciable && (
            <span className="irrenunciable">
              <ToolTip
                text="i"
                tooltip="Feriado irrenunciable: Día de descanso obligatorio por ley para trabajadores del comercio. El empleador no puede exigir trabajo este día, salvo excepciones específicas. Garantiza el derecho al descanso."
                position="bottom"
              />
            </span>
          )}
        </div>
      </div>
      <div className="flex min-w-max items-center gap-2 text-[16px] font-semibold text-[#D16F00]">
        {isCurrent ? (
          <span className="rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-600">
            En curso
          </span>
        ) : (
          <>
            <ClockIcon />
            {holidayCountdown}
          </>
        )}
      </div>
    </div>
  );
};