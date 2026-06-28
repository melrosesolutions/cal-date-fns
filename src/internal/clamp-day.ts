import { daysInMonthInternal } from './days-in-month-internal';

/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Clamps `day` to the last valid day of the given year/month, if it exceeds it.
 * Used by month/year arithmetic (`add`/`subtract`) to handle cases like
 * Jan 31 + 1 month, where February has no 31st — the result clamps to Feb 28/29
 * rather than overflowing into March.
 */
export function clampDay(year: number, month: number, day: number): number {
  const maxDay = daysInMonthInternal(year, month);
  return Math.min(day, maxDay);
}
