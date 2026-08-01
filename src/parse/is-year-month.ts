import type { YearMonth } from '../types/year-month.type';
import { normalizeInput, isCalDateObj } from '../internal/normalize-input';

/**
 * Type guard. Returns `true` if `input` is a valid `YYYY-MM` string —
 * including full calendar-correctness checks (e.g. rejects month `13`).
 *
 * String-only: object inputs (`CalDateObj`/`YearMonthObj`) always return
 * `false` here, even if structurally valid — use `isValid` for a guard that
 * also accepts object forms.
 */
export function isYearMonth(input: unknown): input is YearMonth {
  if (typeof input !== 'string') {
    return false;
  }

  const normalized = normalizeInput(input);
  return normalized !== null && !isCalDateObj(normalized);
}
