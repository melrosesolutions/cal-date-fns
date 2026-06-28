import { isLeapYearInternal } from './is-leap-year-internal';

const DAYS_IN_MONTH: readonly number[] = [
  31, // 1 - January
  28, // 2 - February (non-leap; overridden below)
  31, // 3 - March
  30, // 4 - April
  31, // 5 - May
  30, // 6 - June
  31, // 7 - July
  31, // 8 - August
  30, // 9 - September
  31, // 10 - October
  30, // 11 - November
  31, // 12 - December
];

/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Returns the number of days in the given month (1-based) of the given year.
 * Takes raw `year`/`month` numbers with no input coercion and no validation
 * of `month` range — callers are expected to have already validated input
 * via the public API. The public `getDaysInMonth` (in src/getters/) accepts
 * `AnyDateInput` and delegates here.
 *
 * Throws a plain `RangeError` (not `CalDateRangeError`) if `month` is outside
 * 1-12, since this is an internal programming-error guard, not a user-facing
 * validation failure.
 */
export function daysInMonthInternal(year: number, month: number): number {
  if (month < 1 || month > 12 || !Number.isInteger(month)) {
    throw new RangeError(
      `daysInMonthInternal: month must be an integer 1-12, got ${String(month)}`,
    );
  }

  if (month === 2 && isLeapYearInternal(year)) {
    return 29;
  }

  // month is 1-based; array is 0-indexed. The bounds check above guarantees
  // month - 1 is within [0, 11], so this lookup is always defined — but we
  // still guard explicitly rather than asserting, to avoid a non-null
  // assertion and keep the function honest if DAYS_IN_MONTH is ever changed.
  const days = DAYS_IN_MONTH[month - 1];
  if (days === undefined) {
    throw new RangeError(`daysInMonthInternal: unexpected month index ${String(month)}`);
  }
  return days;
}
