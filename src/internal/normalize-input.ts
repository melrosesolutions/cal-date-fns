import type { CalDateObj } from '../types/cal-date.type';
import type { YearMonthObj } from '../types/year-month.type';
import type { AnyDateInput } from '../types/any-date-input.type';
import { daysInMonthInternal } from './days-in-month-internal';

const CAL_DATE_STRING_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEAR_MONTH_STRING_RE = /^(\d{4})-(\d{2})$/;

/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Normalises any `AnyDateInput` into its object form, performing full
 * calendar-correctness validation along the way (not just shape-matching).
 *
 * Returns `null` if the input is not a valid `CalDate`, `YearMonth`,
 * `CalDateObj`, or `YearMonthObj` — including cases where the shape is
 * correct but the calendar values are impossible (month 13, Feb 30, etc).
 *
 * This is the single source of truth for "what counts as valid" — the public
 * `isValid`/`isCalDate`/`isYearMonth` type guards and the `toObject`/`toCalDate`/
 * `toYearMonth` converters all delegate here rather than duplicating validation
 * logic.
 *
 * Distinguishing object inputs: a `CalDateObj` has a `d` property, a
 * `YearMonthObj` does not. Both are plain objects with `y`/`m` (and possibly `d`)
 * numeric fields — anything else (wrong types, extra/missing fields) is rejected.
 */
export function normalizeInput(input: unknown): CalDateObj | YearMonthObj | null {
  if (typeof input === 'string') {
    return normalizeString(input);
  }

  if (typeof input === 'object' && input !== null) {
    return normalizeObject(input);
  }

  return null;
}

function normalizeString(input: string): CalDateObj | YearMonthObj | null {
  const calDateMatch = CAL_DATE_STRING_RE.exec(input);
  if (calDateMatch) {
    const y = Number(calDateMatch[1]);
    const m = Number(calDateMatch[2]);
    const d = Number(calDateMatch[3]);
    return isValidCalDateValues(y, m, d) ? { y, m, d } : null;
  }

  const yearMonthMatch = YEAR_MONTH_STRING_RE.exec(input);
  if (yearMonthMatch) {
    const y = Number(yearMonthMatch[1]);
    const m = Number(yearMonthMatch[2]);
    return isValidYearMonthValues(y, m) ? { y, m } : null;
  }

  return null;
}

function normalizeObject(input: object): CalDateObj | YearMonthObj | null {
  if (!('y' in input) || !('m' in input)) {
    return null;
  }

  const y = (input as Record<string, unknown>).y;
  const m = (input as Record<string, unknown>).m;

  if (typeof y !== 'number' || typeof m !== 'number') {
    return null;
  }

  if ('d' in input) {
    const d = (input as Record<string, unknown>).d;
    if (typeof d !== 'number') {
      return null;
    }
    return isValidCalDateValues(y, m, d) ? { y, m, d } : null;
  }

  return isValidYearMonthValues(y, m) ? { y, m } : null;
}

function isValidYearMonthValues(y: number, m: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m)) {
    return false;
  }
  return m >= 1 && m <= 12;
}

function isValidCalDateValues(y: number, m: number, d: number): boolean {
  if (!isValidYearMonthValues(y, m) || !Number.isInteger(d)) {
    return false;
  }
  return d >= 1 && d <= daysInMonthInternal(y, m);
}

/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Type guard distinguishing `CalDateObj` from `YearMonthObj` once normalised.
 */
export function isCalDateObj(input: CalDateObj | YearMonthObj): input is CalDateObj {
  return 'd' in input;
}

/** Re-exported for use by other internal modules that need raw AnyDateInput typing. */
export type { AnyDateInput };
