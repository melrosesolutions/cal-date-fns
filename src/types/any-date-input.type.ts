import type { CalDateObj } from './cal-date.type';
import type { YearMonthObj } from './year-month.type';

/**
 * Anything that identifies either a calendar date or a calendar month.
 * Used by functions that work sensibly with either level of precision
 * (e.g. `startOfMonth`, `getYear`, `isAfter`).
 *
 * Note: `CalDate` and `YearMonth` are both plain `string` at the type level
 * (see docs/API.md for the rationale), so the string member of this union is
 * written as `string` rather than `CalDate | YearMonth` — the two are
 * type-identical and a linter (correctly) flags the duplication. Runtime
 * functions distinguish "YYYY-MM-DD" from "YYYY-MM" via `normalizeInput`,
 * not via the type system.
 */
export type AnyDateInput = string | CalDateObj | YearMonthObj;
