/**
 * A duration of calendar time, used by `add`, `subtract`, `since`, and `until`.
 * All fields are optional — include only the units you need.
 */
export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
}

/**
 * A single unit of calendar time, used to configure `since`/`until` precision.
 */
export type DurationUnit = 'years' | 'months' | 'weeks' | 'days';

/**
 * Options controlling how `since`/`until` break a difference down into units.
 *
 * `largestUnit` defaults to `"days"`.
 * `smallestUnit` defaults to the same value as `largestUnit` (i.e. a single unit)
 * if not specified.
 */
export interface DurationOptions {
  largestUnit?: DurationUnit;
  smallestUnit?: DurationUnit;
}
