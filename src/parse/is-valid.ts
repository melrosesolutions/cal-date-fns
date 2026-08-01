import { normalizeInput } from '../internal/normalize-input';

/**
 * Returns `true` if the input is a valid `CalDate`, `YearMonth`, `CalDateObj`,
 * or `YearMonthObj` — including full calendar-correctness checks (not just
 * shape-matching), e.g. rejecting `"2025-02-30"` or month `13`.
 *
 * Accepts `unknown` so it can be used as a guard before passing untrusted
 * data (e.g. from JSON, user input) to other functions.
 */
export function isValid(input: unknown): boolean {
  return normalizeInput(input) !== null;
}
