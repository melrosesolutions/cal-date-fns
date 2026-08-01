import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDateObj } from '../types/cal-date.type';
import type { YearMonthObj } from '../types/year-month.type';
import { normalizeInput } from '../internal/normalize-input';
import { CalDateRangeError } from '../errors/cal-date-range-error';

/**
 * Normalises any input to its object form. Returns a `CalDateObj` if the
 * input includes a day, otherwise a `YearMonthObj`.
 *
 * Throws `CalDateRangeError` if `input` is not a valid `CalDate`, `YearMonth`,
 * `CalDateObj`, or `YearMonthObj` — including cases where the shape is
 * correct but the calendar values are impossible (month 13, Feb 30, etc).
 *
 * If the input might be invalid and you'd rather not handle an exception,
 * check with `isValid` first.
 */
export function toObject(input: AnyDateInput): CalDateObj | YearMonthObj {
  const normalized = normalizeInput(input);

  if (normalized === null) {
    throw new CalDateRangeError(
      `toObject: input is not a valid date or month: ${JSON.stringify(input)}`,
    );
  }

  return normalized;
}
