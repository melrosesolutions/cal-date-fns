import { describe, it, expect } from 'vitest';
import { since } from './since';
import { CalDateOptionsError } from '../errors/cal-date-options-error';

describe('since', () => {
  it('returns the day difference when dateRight is earlier', () => {
    expect(since('2025-04-01', '2025-03-01')).toEqual({ days: 31 });
  });

  it('returns months when smallestUnit defaults to months', () => {
    expect(since('2025-04-01', '2025-01-15', { largestUnit: 'months' })).toEqual({ months: 2 });
  });

  it('returns months and days when smallestUnit is days', () => {
    expect(
      since('2025-04-01', '2025-01-15', { largestUnit: 'months', smallestUnit: 'days' }),
    ).toEqual({ months: 2, days: 17 });
  });

  it('returns years and months with largestUnit years and smallestUnit months', () => {
    expect(
      since('2026-06-01', '2024-01-15', { largestUnit: 'years', smallestUnit: 'months' }),
    ).toEqual({ years: 2, months: 4 });
  });

  it('returns zero duration for identical dates', () => {
    expect(since('2025-03-15', '2025-03-15')).toEqual({ days: 0 });
  });

  it('returns years only when smallestUnit is years', () => {
    expect(
      since('2026-03-01', '2024-01-15', { largestUnit: 'years', smallestUnit: 'years' }),
    ).toEqual({ years: 2 });
  });

  it('returns months and weeks when smallestUnit is weeks', () => {
    expect(
      since('2025-04-01', '2025-01-15', { largestUnit: 'months', smallestUnit: 'weeks' }),
    ).toEqual({ months: 2, weeks: 2 });
  });

  it('returns weeks and days when largestUnit is weeks and smallestUnit is days', () => {
    expect(
      since('2025-04-01', '2025-01-15', { largestUnit: 'weeks', smallestUnit: 'days' }),
    ).toEqual({ weeks: 10, days: 6 });
  });

  it('returns negative day duration when dateRight is later', () => {
    expect(since('2025-04-01', '2025-06-01')).toEqual({ days: -61 });
  });

  it('supports YearMonth inputs by defaulting to the first of the month', () => {
    expect(since('2025-04-01', '2025-01', { largestUnit: 'months' })).toEqual({ months: 3 });
  });

  it('throws CalDateOptionsError when smallestUnit is larger than largestUnit', () => {
    expect(() =>
      since('2025-04-01', '2025-03-01', { largestUnit: 'days', smallestUnit: 'months' }),
    ).toThrow(CalDateOptionsError);
  });
});
