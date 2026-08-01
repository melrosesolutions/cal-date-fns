import { describe, it, expect } from 'vitest';
import { toCalDate } from './to-cal-date';
import { CalDateRangeError } from '../errors/cal-date-range-error';

describe('toCalDate', () => {
  it('passes through an already-valid CalDate string', () => {
    expect(toCalDate('2025-03-15')).toBe('2025-03-15');
  });

  it('converts a YearMonth string to the 1st of that month', () => {
    expect(toCalDate('2025-03')).toBe('2025-03-01');
  });

  it('converts a CalDateObj to a CalDate string', () => {
    expect(toCalDate({ y: 2025, m: 3, d: 15 })).toBe('2025-03-15');
  });

  it('converts a YearMonthObj to the 1st of that month', () => {
    expect(toCalDate({ y: 2025, m: 3 })).toBe('2025-03-01');
  });

  it('pads single-digit months and days with a leading zero', () => {
    expect(toCalDate({ y: 2025, m: 1, d: 5 })).toBe('2025-01-05');
  });

  it('pads years under 4 digits with leading zeros', () => {
    expect(toCalDate({ y: 99, m: 1, d: 1 })).toBe('0099-01-01');
  });

  it('throws CalDateRangeError for an invalid calendar date', () => {
    expect(() => toCalDate('2025-02-30')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for a malformed string', () => {
    expect(() => toCalDate('not-a-date')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for an invalid YearMonthObj', () => {
    expect(() => toCalDate({ y: 2025, m: 13 })).toThrow(CalDateRangeError);
  });
});
