import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { HolidayCountdown } from '../types';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.locale('es');

export const formatDateInSpanish = (date: string): string => {
  return dayjs(date).format('D [de] MMMM');
};

export const getDayName = (date: string): string => {
  return dayjs(date).format('dddd');
};

export const getCountdown = (date: string): HolidayCountdown => {
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

export const isPastDate = (date: string): boolean => {
  const now = dayjs().tz('America/Santiago');
  return dayjs(date).tz('America/Santiago').isBefore(now, 'day');
};

export const isCurrentDate = (date: string): boolean => {
  const now = dayjs().tz('America/Santiago');
  return dayjs(date).tz('America/Santiago').isSame(now, 'day');
};