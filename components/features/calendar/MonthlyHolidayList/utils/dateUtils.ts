import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { NavigationLinks } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const formatDateInSpanish = (date: string): string => {
  return dayjs(date).format('D [de] MMMM');
};

export const getDayName = (date: string): string => {
  return dayjs(date).format('dddd');
};

export const getCountdown = (date: string): { days: number; hours: number } => {
  const now = dayjs().tz('America/Santiago');
  const eventDate = dayjs(date).tz('America/Santiago');
  const diff = eventDate.diff(now, 'hour');

  if (diff < 0) {
    return { days: 0, hours: 0 };
  }

  const days = Math.floor(diff / 24);
  const hours = diff % 24;
  return { days, hours };
};

export const isWeekend = (date: string): boolean => {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
};

export const getMonthName = (month: number): string => {
  return dayjs()
    .month(month - 1)
    .format('MMMM');
};

export const isPastDate = (date: string): boolean => {
  return dayjs(date).tz('America/Santiago').isBefore(dayjs().tz('America/Santiago'), 'day');
};

export const isCurrentDate = (date: string): boolean => {
  return dayjs(date).tz('America/Santiago').isSame(dayjs().tz('America/Santiago'), 'day');
};

export const getNavigationLinks = (currentMonth: number, year: number): NavigationLinks => {
  let prevMonth = currentMonth - 1;
  let prevYear = year;
  let nextMonth = currentMonth + 1;
  let nextYear = year;

  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = year + 1;
  }

  return {
    prev: `/calendario/${prevYear}/${getMonthName(prevMonth)}`,
    current: `/calendario/${year}`,
    next: `/calendario/${nextYear}/${getMonthName(nextMonth)}`,
  };
};