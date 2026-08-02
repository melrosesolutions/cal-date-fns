// cal-date-fns — public entry point
//
// This is the ONLY barrel file in the package. It re-exports every public
// function/type/error by name (never `export *`) so the full public surface
// is visible by scrolling this one file, and tree-shaking works reliably.
//
// Anything under src/internal/ is intentionally NOT re-exported here — it is
// implementation detail, not part of the public API. See docs/FILE_STRUCTURE.md.

// ---- Types ----
export type { CalDate, CalDateObj, CalDateInput } from './types/cal-date.type';
export type { YearMonth, YearMonthObj } from './types/year-month.type';
export type { AnyDateInput } from './types/any-date-input.type';
export type { Duration, DurationUnit, DurationOptions } from './types/duration.type';

// ---- Errors ----
export { CalDateFormatError } from './errors/cal-date-format-error';
export { CalDateParseError } from './errors/cal-date-parse-error';
export { CalDateRangeError } from './errors/cal-date-range-error';
export { CalDateOptionsError } from './errors/cal-date-options-error';

// ---- Epoch Helpers ----
export { toEpochDay } from './epoch/to-epoch-day';
export { fromEpochDay } from './epoch/from-epoch-day';

// ---- Arithmetic ----
export { add } from './arithmetic/add';
export { subtract } from './arithmetic/subtract';

// ---- Differences ----
export { since } from './difference/since';
export { until } from './difference/until';

// ---- Intl Helpers ----
export { createCalDateFormat } from './intl/create-cal-date-format';
export type { CalDateFormat } from './intl/cal-date-format.type';
export type { CalDateFormatOptions } from './intl/cal-date-format-options.type';

// ---- Parsing & Validation ----
export { isCalDate } from './parse/is-cal-date';
export { isValid } from './parse/is-valid';
export { isYearMonth } from './parse/is-year-month';
export { toCalDate } from './parse/to-cal-date';
export { toObject } from './parse/to-object';
export { toYearMonth } from './parse/to-year-month';
