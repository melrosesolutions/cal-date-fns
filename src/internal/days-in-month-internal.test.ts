import { describe, it, expect } from 'vitest';
import { daysInMonthInternal } from './days-in-month-internal';

describe('daysInMonthInternal', () => {
  it('returns correct days for 31-day months', () => {
    expect(daysInMonthInternal(2025, 1)).toBe(31);
    expect(daysInMonthInternal(2025, 3)).toBe(31);
    expect(daysInMonthInternal(2025, 12)).toBe(31);
  });

  it('returns correct days for 30-day months', () => {
    expect(daysInMonthInternal(2025, 4)).toBe(30);
    expect(daysInMonthInternal(2025, 11)).toBe(30);
  });

  it('returns 28 for February in a non-leap year', () => {
    expect(daysInMonthInternal(2025, 2)).toBe(28);
  });

  it('returns 29 for February in a leap year', () => {
    expect(daysInMonthInternal(2024, 2)).toBe(29);
    expect(daysInMonthInternal(2000, 2)).toBe(29);
  });

  it('returns 28 for February in a century year not divisible by 400', () => {
    expect(daysInMonthInternal(1900, 2)).toBe(28);
  });

  it('throws RangeError for month 0', () => {
    expect(() => daysInMonthInternal(2025, 0)).toThrow(RangeError);
  });

  it('throws RangeError for month 13', () => {
    expect(() => daysInMonthInternal(2025, 13)).toThrow(RangeError);
  });

  it('throws RangeError for non-integer month', () => {
    expect(() => daysInMonthInternal(2025, 2.5)).toThrow(RangeError);
  });
});
