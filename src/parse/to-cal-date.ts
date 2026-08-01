import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDate } from '../types/cal-date.type';
import { normalizeInput, isCalDateObj } from '../internal/normalize-input';
import { CalDateRangeError } from '../errors/cal-date-range-error';

/**
 * Converts any input to a `YYYY-MM-DD` string. When given a `YearMonth` or
 * `YearMonthObj`, defaults to the 1st of the month.
 *
 * Throws `CalDateRangeError` if `input` is not a valid date or month.
 */
export function toCalDate(input: AnyDateInput): CalDate {
  const normalized = normalizeInput(input);

  if (normalized === null) {
    throw new CalDateRangeError(
      `toCalDate: input is not a valid date or month: ${JSON.stringify(input)}`,
    );
  }

  const { y, m, d } = isCalDateObj(normalized) ? normalized : { ...normalized, d: 1 };

  const yyyy = String(y).padStart(4, '0');
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
