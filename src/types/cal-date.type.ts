/**
 * A calendar date string in ISO 8601 format: "YYYY-MM-DD".
 *
 * This is a plain `string` at the type level. Real validity (correct days-in-month,
 * leap years, etc.) is checked at runtime via `isValid`/`isCalDate`, not encoded
 * in the type itself — see docs/API.md for the rationale.
 */
export type CalDate = string;

/**
 * Object representation of a `CalDate`. Months are 1-based (January = 1).
 */
export interface CalDateObj {
  y: number;
  m: number;
  d: number;
}

/**
 * Anything that unambiguously identifies a single calendar date
 * (i.e. includes a day component).
 */
export type CalDateInput = CalDate | CalDateObj;
