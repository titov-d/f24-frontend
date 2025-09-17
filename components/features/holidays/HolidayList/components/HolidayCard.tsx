import React from 'react';
import { Holiday } from '../types';
import { formatDateInSpanish, getDayName, getCountdown, isWeekend, isPastDate, isCurrentDate } from '../utils/dateUtils';
import ClockIcon from '@/components/HolidayList/icons/ClockIcon';
import ToolTip from '@/components/ToolTip/ToolTip';
import styles from '../HolidayList.module.css';

interface HolidayCardProps {
  holiday: Holiday;
  isNextVisibleHoliday: boolean;
  showWeekends: boolean;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({
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
      className={`eventCard my-8 w-[378px] flex-shrink-0 rounded-[8px] bg-white p-5 ${
        isPast ? 'opacity-30' : ''
      } ${isCurrent || isNextVisibleHoliday ? styles.glowCard : ''}`}
    >
      <p className="text-[30px] text-[#686868]">{formatDateInSpanish(holiday.date)}</p>
      <div className="flex w-full justify-between pl-1 text-[18px] capitalize leading-8 text-[#686868]">
        <span className={dayNameClass}>{getDayName(holiday.date)}</span>
        <div className="flex items-center gap-2 text-[16px] font-semibold text-[#D16F00]">
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
      <hr className="mb-3 mt-2 border-[#f7f5f5]" />
      <div className="flex gap-3">
        <h3 className="text-[16px] font-semibold text-[#333]">{holiday.name}</h3>
        {holiday.irrenunciable && (
          <span className="irrenunciable">
            <ToolTip
              text="i"
              tooltip="Feriado irrenunciable: Día de descanso obligatorio por ley para trabajadores del comercio. El empleador no puede exigir trabajo este día, salvo excepciones específicas. Garantiza el derecho al descanso."
              position="right"
            />
          </span>
        )}
      </div>
      <p className="my-2 text-sm font-semibold text-[#667]">{holiday.description}</p>
    </div>
  );
};