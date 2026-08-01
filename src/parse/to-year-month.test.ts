import { describe, it, expect } from 'vitest';
import { toYearMonth } from './to-year-month';
import { CalDateRangeError } from '../errors/cal-date-range-error';

describe('toYearMonth', () => {
  it('passes through an already-valid YearMonth string', () => {
    expect(toYearMonth('2025-03')).toBe('2025-03');
  });

  it('drops the day component from a CalDate string', () => {
    expect(toYearMonth('2025-03-15')).toBe('2025-03');
  });

  it('converts a YearMonthObj to a YearMonth string', () => {
    expect(toYearMonth({ y: 2025, m: 3 })).toBe('2025-03');
  });

  it('drops the day component from a CalDateObj', () => {
    expect(toYearMonth({ y: 2025, m: 3, d: 15 })).toBe('2025-03');
  });

  it('pads single-digit months with a leading zero', () => {
    expect(toYearMonth({ y: 2025, m: 1 })).toBe('2025-01');
  });

  it('pads years under 4 digits with leading zeros', () => {
    expect(toYearMonth({ y: 99, m: 1 })).toBe('0099-01');
  });

  it('throws CalDateRangeError for an invalid calendar date', () => {
    expect(() => toYearMonth('2025-02-30')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for a malformed string', () => {
    expect(() => toYearMonth('not-a-date')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for an invalid month', () => {
    expect(() => toYearMonth({ y: 2025, m: 13 })).toThrow(CalDateRangeError);
  });
});
