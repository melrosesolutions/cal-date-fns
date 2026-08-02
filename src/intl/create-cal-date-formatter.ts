import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDateObj } from '../types/cal-date.type';
import type { CalDateFormatter } from './cal-date-formatter.type';
import type { CalDateFormatterOptions } from './cal-date-formatter-options.type';
import { CalDateOptionsError } from '../errors/cal-date-options-error';
import { toObject } from '../parse/to-object';
import { isCalDateObj } from '../internal/normalize-input';

const INVALID_OPTION_KEYS = [
  'timeStyle',
  'hour',
  'minute',
  'second',
  'fractionalSecondDigits',
  'hour12',
  'hourCycle',
  'dayPeriod',
  'timeZone',
] as const;

type InvalidOptionKey = (typeof INVALID_OPTION_KEYS)[number];

function validateOptions(options?: CalDateFormatterOptions): Intl.DateTimeFormatOptions {
  if (!options) {
    return { timeZone: 'UTC' };
  }

  const invalidKeys = INVALID_OPTION_KEYS.filter((key): key is InvalidOptionKey => key in options);

  if (invalidKeys.length > 0) {
    throw new CalDateOptionsError(
      `createCalDateFormatter: unsupported option(s): ${invalidKeys.join(', ')}`,
    );
  }

  return { ...options, timeZone: 'UTC' };
}

function toUtcDate(input: AnyDateInput): Date {
  const normalized = toObject(input);
  const dateInput: CalDateObj = isCalDateObj(normalized) ? normalized : { ...normalized, d: 1 };
  return new Date(Date.UTC(dateInput.y, dateInput.m - 1, dateInput.d));
}

export function createCalDateFormatter(
  locale: string,
  options?: CalDateFormatterOptions,
): CalDateFormatter {
  const intlOptions = validateOptions(options);
  const formatter = new Intl.DateTimeFormat(locale, intlOptions);

  return {
    format(input: AnyDateInput): string {
      return formatter.format(toUtcDate(input));
    },

    formatRange(start: AnyDateInput, end: AnyDateInput): string {
      const startUtc = toUtcDate(start);
      const endUtc = toUtcDate(end);
      const formatterWithRange = formatter as Intl.DateTimeFormat & {
        formatRange?(date1: Date, date2: Date): string;
      };

      if (typeof formatterWithRange.formatRange === 'function') {
        return formatterWithRange.formatRange(startUtc, endUtc);
      }

      return `${formatter.format(startUtc)} – ${formatter.format(endUtc)}`;
    },

    formatToParts(input: AnyDateInput): Intl.DateTimeFormatPart[] {
      return formatter.formatToParts(toUtcDate(input));
    },
  };
}
