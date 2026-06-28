import type { DurationUnit } from './duration.type';

/** Canonical ordering of duration units, largest to smallest. */
export const DURATION_UNIT_ORDER: readonly DurationUnit[] = ['years', 'months', 'weeks', 'days'];
