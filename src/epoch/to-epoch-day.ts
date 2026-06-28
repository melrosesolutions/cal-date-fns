import type { CalDateInput } from '../types/cal-date.type';
import { normalizeInput, isCalDateObj } from '../internal/normalize-input';
import { CalDateRangeError } from '../errors/cal-date-range-error';

/**
 * Converts a calendar date to an integer count of days since a fixed epoch.
 *
 * The epoch value itself is an implementation detail (currently 1970-01-01,
 * i.e. day 0 = "1970-01-01") and is not part of the public contract — only
 * that it is internally consistent and monotonic (later dates always produce
 * larger numbers) is guaranteed. Round-trips cleanly with `fromEpochDay`.
 *
 * This is the foundational primitive most of the library's arithmetic,
 * comparison, and difference functions are built on — once a date is reduced
 * to a single integer, "add 5 days" is just `+5`, and "compare two dates" is
 * just `<`.
 *
 * Throws `CalDateRangeError` if `input` is not a valid calendar date.
 */
export function toEpochDay(input: CalDateInput): number {
  const normalized = normalizeInput(input);

  if (normalized === null || !isCalDateObj(normalized)) {
    throw new CalDateRangeError(
      `toEpochDay: input is not a valid calendar date: ${JSON.stringify(input)}`,
    );
  }

  const { y, m, d } = normalized;
  return gregorianToEpochDay(y, m, d);
}

/**
 * Days-from-civil algorithm — a well-known constant-time conversion from a
 * proleptic Gregorian calendar date to a day count relative to 1970-01-01.
 * See: Howard Hinnant, "chrono-Compatible Low-Level Date Algorithms".
 *
 * Note: Hinnant's reference implementation is written for C++, where integer
 * division truncates toward zero, so it includes a `y >= 0 ? y : y - 399`
 * adjustment to make truncating division behave like floor division for
 * negative years. JavaScript's `Math.floor` already floors correctly for
 * negative numbers, so that adjustment must NOT be carried over here — doing
 * so double-compensates and produces wrong results for years before 0
 * (verified via brute-force round-trip testing across ~2000 years on each
 * side of the epoch; see to-epoch-day.test.ts).
 */
function gregorianToEpochDay(y: number, m: number, d: number): number {
  const yAdj = m <= 2 ? y - 1 : y;
  const era = Math.floor(yAdj / 400);
  const yoe = yAdj - era * 400; // year of era, [0, 399]
  const mp = (m + 9) % 12; // [0, 11], Mar=0 .. Feb=11
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1; // [0, 365]
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy; // [0, 146096]
  return era * 146097 + doe - 719468; // shift so day 0 = 1970-01-01
}
