import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDateObj } from '../types/cal-date.type';
import type { CalDayFormatter } from './cal-day-formatter.type';

const DAY_DATE_YEAR = 2020;
const DAY_DATE_MONTH = 3; // March contains a Saturday and Sunday in a fixed week that is stable across iso weekdays

function normalizeDayInput(input: AnyDateInput | number): number {
  if (typeof input === 'number') {
    const normalized = ((((input - 1) % 7) + 7) % 7) + 1;
    return normalized;
  }
  if (typeof input === 'string') {
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = iso.exec(input);
    if (match) {
      return (
        new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))).getUTCDay() ||
        7
      );
    }

    const date = new Date(Date.parse(input));
    if (!Number.isNaN(date.getTime())) {
      return date.getUTCDay() === 0 ? 7 : date.getUTCDay();
    }
  }

  function isCalDateObj(x: unknown): x is CalDateObj {
    return (
      typeof x === 'object' &&
      x !== null &&
      'y' in (x as Record<string, unknown>) &&
      'm' in (x as Record<string, unknown>) &&
      'd' in (x as Record<string, unknown>) &&
      typeof (x as Record<string, unknown>).y === 'number' &&
      typeof (x as Record<string, unknown>).m === 'number' &&
      typeof (x as Record<string, unknown>).d === 'number'
    );
  }

  if (isCalDateObj(input)) {
    return new Date(Date.UTC(input.y, input.m - 1, input.d)).getUTCDay() || 7;
  }

  throw new TypeError('Invalid day input');
}

function toUtcDayDate(day: number): Date {
  const mondayDate = 9; // a Monday in March 2020
  return new Date(Date.UTC(DAY_DATE_YEAR, DAY_DATE_MONTH - 1, mondayDate + day - 1));
}

export function createDayFormatter(
  locale: string,
  style: 'long' | 'short' | 'narrow',
): CalDayFormatter {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' });

  return {
    getDay(input: AnyDateInput | number): string {
      return formatter.format(toUtcDayDate(normalizeDayInput(input)));
    },

    getDayRange(start: AnyDateInput | number, end: AnyDateInput | number): string {
      const startDate = toUtcDayDate(normalizeDayInput(start));
      const endDate = toUtcDayDate(normalizeDayInput(end));
      const formatterWithRange = formatter as Intl.DateTimeFormat & {
        formatRange?(date1: Date, date2: Date): string;
      };

      if (typeof formatterWithRange.formatRange === 'function') {
        return formatterWithRange.formatRange(startDate, endDate);
      }

      return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
    },

    getDayParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[] {
      return formatter.formatToParts(toUtcDayDate(normalizeDayInput(input)));
    },

    getDayRangeParts(
      start: AnyDateInput | number,
      end: AnyDateInput | number,
    ): Intl.DateTimeFormatPart[] {
      const startDate = toUtcDayDate(normalizeDayInput(start));
      const endDate = toUtcDayDate(normalizeDayInput(end));
      const formatterWithRange = formatter as Intl.DateTimeFormat & {
        formatRangeToParts?(date1: Date, date2: Date): Intl.DateTimeFormatPart[];
      };

      if (typeof formatterWithRange.formatRangeToParts === 'function') {
        return formatterWithRange.formatRangeToParts(startDate, endDate);
      }

      return [
        ...formatter.formatToParts(startDate),
        { type: 'literal', value: ' – ' },
        ...formatter.formatToParts(endDate),
      ];
    },
  };
}
