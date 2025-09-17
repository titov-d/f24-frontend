import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.locale('es');

const CHILE_TZ = 'America/Santiago';

export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  return dayjs(date).tz(CHILE_TZ).format(format);
}

export function formatDateInSpanish(date: string | Date): string {
  return dayjs(date).tz(CHILE_TZ).format('D [de] MMMM');
}

export function getDayName(date: string | Date): string {
  return dayjs(date).tz(CHILE_TZ).format('dddd');
}

export function isWeekend(date: string | Date): boolean {
  const day = dayjs(date).tz(CHILE_TZ).day();
  return day === 0 || day === 6;
}

export function isPastDate(date: string | Date): boolean {
  return dayjs(date).tz(CHILE_TZ).isBefore(dayjs().tz(CHILE_TZ), 'day');
}

export function isFutureDate(date: string | Date): boolean {
  return dayjs(date).tz(CHILE_TZ).isAfter(dayjs().tz(CHILE_TZ), 'day');
}

export function isToday(date: string | Date): boolean {
  return dayjs(date).tz(CHILE_TZ).isSame(dayjs().tz(CHILE_TZ), 'day');
}

export function getDaysUntil(date: string | Date): number {
  const target = dayjs(date).tz(CHILE_TZ).startOf('day');
  const today = dayjs().tz(CHILE_TZ).startOf('day');
  return target.diff(today, 'day');
}

export function getRelativeTime(date: string | Date): string {
  return dayjs(date).tz(CHILE_TZ).fromNow();
}