import type { CalDate, CalDateObj } from '../types/cal-date.type';

/**
 * Converts an integer epoch-day count (as produced by `toEpochDay`) back to a
 * `CalDate` string. Round-trips cleanly with `toEpochDay`.
 *
 * Throws a plain `RangeError` if `epochDay` is not a finite integer — this is
 * a programming-error guard (the value should only ever come from `toEpochDay`
 * or arithmetic on its result), not a user-facing input validation failure,
 * so it does not use the library's `CalDate*Error` classes.
 */
export function fromEpochDay(epochDay: number): CalDate {
  const { y, m, d } = fromEpochDayObj(epochDay);
  const yyyy = String(y).padStart(4, '0');
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Object-returning variant of `fromEpochDay`, used internally by other
 * functions (e.g. `add`/`subtract`) that need the components without paying
 * for a string round-trip.
 */
export function fromEpochDayObj(epochDay: number): CalDateObj {
  if (!Number.isInteger(epochDay)) {
    throw new RangeError(`fromEpochDay: epochDay must be an integer, got ${String(epochDay)}`);
  }

  const { y, m, d } = epochDayToGregorian(epochDay);
  return { y, m, d };
}

/**
 * Civil-from-days algorithm — the inverse of the days-from-civil algorithm
 * used in `toEpochDay`. See: Howard Hinnant, "chrono-Compatible Low-Level
 * Date Algorithms".
 *
 * Note: see the comment in to-epoch-day.ts — the truncation-compensation
 * special-casing from Hinnant's C++ reference (`z >= 0 ? z : z - 146096`)
 * must NOT be carried over to JavaScript's `Math.floor`, which already
 * floors correctly for negative numbers. Applying both produces wrong
 * results for epoch days before roughly year 0.
 */
function epochDayToGregorian(epochDay: number): {
  y: number;
  m: number;
  d: number;
} {
  const z = epochDay + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097; // [0, 146096]
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  ); // [0, 399]
  const yAdj = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100)); // [0, 365]
  const mp = Math.floor((5 * doy + 2) / 153); // [0, 11]
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1; // [1, 31]
  const m = mp < 10 ? mp + 3 : mp - 9; // [1, 12]
  const y = m <= 2 ? yAdj + 1 : yAdj;
  return { y, m, d };
}
