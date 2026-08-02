import { describe, it, expect } from 'vitest';
import { until } from './until';
import { CalDateOptionsError } from '../errors/cal-date-options-error';

describe('until', () => {
  it('returns the day difference when dateRight is later', () => {
    expect(until('2025-01-15', '2025-04-01')).toEqual({ days: 76 });
  });

  it('returns years and months with largestUnit years and smallestUnit months', () => {
    expect(
      until('2025-01-15', '2026-06-01', { largestUnit: 'years', smallestUnit: 'months' }),
    ).toEqual({ years: 1, months: 4 });
  });

  it('returns zero duration for identical dates', () => {
    expect(until('2025-03-15', '2025-03-15')).toEqual({ days: 0 });
  });

  it('supports YearMonth inputs by defaulting to the first of the month', () => {
    expect(until('2025-01', '2025-04-01', { largestUnit: 'months' })).toEqual({ months: 3 });
  });

  it('throws CalDateOptionsError when smallestUnit is larger than largestUnit', () => {
    expect(() =>
      until('2025-01-15', '2025-04-01', { largestUnit: 'weeks', smallestUnit: 'months' }),
    ).toThrow(CalDateOptionsError);
  });
});
