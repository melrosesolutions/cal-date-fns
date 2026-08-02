import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDateObj } from '../types/cal-date.type';
import type { Duration, DurationOptions, DurationUnit } from '../types/duration.type';
import { CalDateOptionsError } from '../errors/cal-date-options-error';
import { toCalDate } from '../parse/to-cal-date';
import { toObject } from '../parse/to-object';
import { toEpochDay } from '../epoch/to-epoch-day';
import { daysInMonthInternal } from '../internal/days-in-month-internal';

const DURATION_UNIT_ORDER: readonly DurationUnit[] = ['years', 'months', 'weeks', 'days'];

function normalizeOptions(options?: DurationOptions): Required<DurationOptions> {
  const largestUnit = options?.largestUnit ?? 'days';
  const smallestUnit = options?.smallestUnit ?? largestUnit;

  if (DURATION_UNIT_ORDER.indexOf(largestUnit) > DURATION_UNIT_ORDER.indexOf(smallestUnit)) {
    throw new CalDateOptionsError(
      `since: smallestUnit must not be larger than largestUnit (${smallestUnit} > ${largestUnit})`,
    );
  }

  return { largestUnit, smallestUnit };
}

function toCalDateObj(input: AnyDateInput): CalDateObj {
  return toObject(toCalDate(input)) as CalDateObj;
}

function addMonths(year: number, month: number, months: number): { year: number; month: number } {
  const absoluteMonths = year * 12 + (month - 1) + months;
  return {
    year: Math.floor(absoluteMonths / 12),
    month: (((absoluteMonths % 12) + 12) % 12) + 1,
  };
}

function calculateCalendarDifference(start: CalDateObj, end: CalDateObj) {
  let years = end.y - start.y;
  let months = end.m - start.m;
  let days = end.d - start.d;

  if (days < 0) {
    const previousMonth = addMonths(end.y, end.m, -1);
    days += daysInMonthInternal(previousMonth.year, previousMonth.month);
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

function appendRemainder(result: Duration, days: number, smallestUnit: DurationUnit): Duration {
  if (smallestUnit === 'weeks') {
    result.weeks = Math.trunc(days / 7);
  } else if (smallestUnit === 'days') {
    result.days = days;
  }

  return result;
}

function buildDurationFromCalendarDifference(
  calendarDiff: { years: number; months: number; days: number },
  diffDays: number,
  largestUnit: DurationUnit,
  smallestUnit: DurationUnit,
): Duration {
  const { years, months, days } = calendarDiff;

  if (largestUnit === 'years') {
    if (smallestUnit === 'years') {
      return { years };
    }

    if (smallestUnit === 'months') {
      return { years, months };
    }

    const result: Duration = { years, months };
    return appendRemainder(result, days, smallestUnit);
  }

  if (largestUnit === 'months') {
    const totalMonths = years * 12 + months;
    if (smallestUnit === 'months') {
      return { months: totalMonths };
    }

    const result: Duration = { months: totalMonths };
    return appendRemainder(result, days, smallestUnit);
  }

  if (largestUnit === 'weeks') {
    const result: Duration = {};
    const weeks = Math.trunc(diffDays / 7);
    result.weeks = weeks;
    if (smallestUnit === 'days') {
      result.days = diffDays % 7;
    }
    return result;
  }

  return { days: diffDays };
}

function negateDuration(duration: Duration): Duration {
  const negated: Duration = {};

  if (duration.years !== undefined) {
    negated.years = -duration.years;
  }

  if (duration.months !== undefined) {
    negated.months = -duration.months;
  }

  if (duration.weeks !== undefined) {
    negated.weeks = -duration.weeks;
  }

  if (duration.days !== undefined) {
    negated.days = -duration.days;
  }

  return negated;
}

export function since(
  dateLeft: AnyDateInput,
  dateRight: AnyDateInput,
  options?: DurationOptions,
): Duration {
  const { largestUnit, smallestUnit } = normalizeOptions(options);
  const left = toCalDateObj(dateLeft);
  const right = toCalDateObj(dateRight);

  const leftEpoch = toEpochDay(left);
  const rightEpoch = toEpochDay(right);

  if (leftEpoch === rightEpoch) {
    return { days: 0 };
  }

  const positive = leftEpoch > rightEpoch;
  const start = positive ? right : left;
  const end = positive ? left : right;

  const calendarDiff = calculateCalendarDifference(start, end);
  const diffDays = Math.abs(leftEpoch - rightEpoch);
  const result = buildDurationFromCalendarDifference(
    calendarDiff,
    diffDays,
    largestUnit,
    smallestUnit,
  );

  return positive ? result : negateDuration(result);
}
