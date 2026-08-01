import type { AnyDateInput } from '../types/any-date-input.type';
import type { YearMonth } from '../types/year-month.type';
import { normalizeInput } from '../internal/normalize-input';
import { CalDateRangeError } from '../errors/cal-date-range-error';

/**
 * Converts any input to a `YYYY-MM` string, dropping the day component if
 * present.
 *
 * Throws `CalDateRangeError` if `input` is not a valid date or month.
 */
export function toYearMonth(input: AnyDateInput): YearMonth {
  const normalized = normalizeInput(input);

  if (normalized === null) {
    throw new CalDateRangeError(
      `toYearMonth: input is not a valid date or month: ${JSON.stringify(input)}`,
    );
  }

  const { y, m } = normalized;
  const yyyy = String(y).padStart(4, '0');
  const mm = String(m).padStart(2, '0');
  return `${yyyy}-${mm}`;
}
