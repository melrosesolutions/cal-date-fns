import type { AnyDateInput } from '../types/any-date-input.type';
import type { YearMonthObj } from '../types/year-month.type';
import type { CalMonthFormatter } from './cal-month-formatter.type';

const MONTH_DATE_YEAR = 2020;

function normalizeMonthInput(input: AnyDateInput | number): number {
  if (typeof input === 'number') {
    const normalized = ((((input - 1) % 12) + 12) % 12) + 1;
    return normalized;
  }
  if (typeof input === 'string') {
    const iso = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
    const match = iso.exec(input);
    if (match) {
      return Number(match[2]);
    }

    const date = new Date(Date.parse(input));
    if (!Number.isNaN(date.getTime())) {
      return date.getUTCMonth() + 1;
    }
  }

  function isYearMonthObj(x: unknown): x is YearMonthObj {
    return (
      typeof x === 'object' &&
      x !== null &&
      'm' in (x as Record<string, unknown>) &&
      typeof (x as Record<string, unknown>).m === 'number'
    );
  }

  if (isYearMonthObj(input)) {
    return input.m;
  }

  throw new TypeError('Invalid month input');
}

function toUtcMonthDate(month: number): Date {
  return new Date(Date.UTC(MONTH_DATE_YEAR, month - 1, 1));
}

export function createMonthFormatter(
  locale: string,
  style: 'long' | 'short' | 'narrow',
): CalMonthFormatter {
  const formatter = new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' });

  return {
    getMonth(input: AnyDateInput | number): string {
      return formatter.format(toUtcMonthDate(normalizeMonthInput(input)));
    },

    getMonthRange(start: AnyDateInput | number, end: AnyDateInput | number): string {
      const startDate = toUtcMonthDate(normalizeMonthInput(start));
      const endDate = toUtcMonthDate(normalizeMonthInput(end));
      const formatterWithRange = formatter as Intl.DateTimeFormat & {
        formatRange?(date1: Date, date2: Date): string;
      };

      if (typeof formatterWithRange.formatRange === 'function') {
        return formatterWithRange.formatRange(startDate, endDate);
      }

      return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
    },

    getMonthParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[] {
      return formatter.formatToParts(toUtcMonthDate(normalizeMonthInput(input)));
    },

    getMonthRangeParts(
      start: AnyDateInput | number,
      end: AnyDateInput | number,
    ): Intl.DateTimeFormatPart[] {
      const startDate = toUtcMonthDate(normalizeMonthInput(start));
      const endDate = toUtcMonthDate(normalizeMonthInput(end));
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
