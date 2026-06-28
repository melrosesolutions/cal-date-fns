/**
 * A calendar month string in ISO 8601 format: "YYYY-MM".
 *
 * This is a plain `string` at the type level — see `CalDate` in ./cal-date.ts
 * for the rationale shared by both types.
 */
export type YearMonth = string;

/**
 * Object representation of a `YearMonth`. Months are 1-based (January = 1).
 */
export interface YearMonthObj {
  y: number;
  m: number;
}
