import type { AnyDateInput } from '../types/any-date-input.type';
import type { Duration } from '../types/duration.type';
import { normalizeInput, isCalDateObj } from '../internal/normalize-input';
import { clampDay } from '../internal/clamp-day';
import { toEpochDay } from '../epoch/to-epoch-day';
import { fromEpochDay } from '../epoch/from-epoch-day';
import { CalDateOptionsError } from '../errors/cal-date-options-error';
import { CalDateRangeError } from '../errors/cal-date-range-error';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function addMonths(year: number, month: number, years: number, months: number) {
  const absoluteMonths = year * 12 + (month - 1) + years * 12 + months;
  const normalizedYear = Math.floor(absoluteMonths / 12);
  const normalizedMonth = (((absoluteMonths % 12) + 12) % 12) + 1;
  return { year: normalizedYear, month: normalizedMonth };
}

function durationHasDayOrWeek(duration: Duration): boolean {
  return duration.days !== undefined || duration.weeks !== undefined;
}

function normalizeDuration(value: number | undefined): number {
  return value ?? 0;
}

function buildCalDateString(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${pad2(month)}-${pad2(day)}`;
}

function buildYearMonthString(year: number, month: number): string {
  return `${String(year).padStart(4, '0')}-${pad2(month)}`;
}

export function add(input: AnyDateInput, duration: Duration): string {
  const normalized = normalizeInput(input);

  if (normalized === null) {
    throw new CalDateRangeError(
      `add: input is not a valid date or month: ${JSON.stringify(input)}`,
    );
  }

  if (!isCalDateObj(normalized) && durationHasDayOrWeek(duration)) {
    throw new CalDateOptionsError('add: cannot apply days or weeks duration to a YearMonth input');
  }

  const years = normalizeDuration(duration.years);
  const months = normalizeDuration(duration.months);
  const weeks = normalizeDuration(duration.weeks);
  const days = normalizeDuration(duration.days);
  const totalDays = days + weeks * 7;

  if (isCalDateObj(normalized)) {
    let { y, m, d } = normalized;

    if (years !== 0 || months !== 0) {
      const result = addMonths(y, m, years, months);
      y = result.year;
      m = result.month;
      d = clampDay(y, m, d);
    }

    if (totalDays !== 0) {
      const epochDay = toEpochDay({ y, m, d }) + totalDays;
      return fromEpochDay(epochDay);
    }

    return buildCalDateString(y, m, d);
  }

  const result = addMonths(normalized.y, normalized.m, years, months);
  return buildYearMonthString(result.year, result.month);
}
