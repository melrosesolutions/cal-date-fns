import type { CalDate } from '../types/cal-date.type';
import { normalizeInput, isCalDateObj } from '../internal/normalize-input';

/**
 * Type guard. Returns `true` if `input` is a valid `YYYY-MM-DD` string —
 * including full calendar-correctness checks (e.g. rejects `"2025-02-30"`).
 *
 * String-only: object inputs (`CalDateObj`/`YearMonthObj`) always return
 * `false` here, even if structurally valid — use `isValid` for a guard that
 * also accepts object forms.
 */
export function isCalDate(input: unknown): input is CalDate {
  if (typeof input !== 'string') {
    return false;
  }

  const normalized = normalizeInput(input);
  return normalized !== null && isCalDateObj(normalized);
}
