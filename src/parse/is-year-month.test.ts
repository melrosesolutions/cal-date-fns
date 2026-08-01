import { describe, it, expect } from 'vitest';
import { isYearMonth } from './is-year-month';

describe('isYearMonth', () => {
  it('returns true for a valid YearMonth string', () => {
    expect(isYearMonth('2025-03')).toBe(true);
  });

  it('returns false for a valid CalDate string (has a day component)', () => {
    expect(isYearMonth('2025-03-15')).toBe(false);
  });

  it('returns false for an invalid month (13)', () => {
    expect(isYearMonth('2025-13')).toBe(false);
  });

  it('returns false for a malformed string', () => {
    expect(isYearMonth('not-a-month')).toBe(false);
  });

  it('returns false for a YearMonthObj (string-only guard)', () => {
    expect(isYearMonth({ y: 2025, m: 3 })).toBe(false);
  });

  it('returns false for a CalDateObj', () => {
    expect(isYearMonth({ y: 2025, m: 3, d: 15 })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isYearMonth(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isYearMonth(undefined)).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isYearMonth(202503)).toBe(false);
  });

  it('narrows the type correctly when used as a guard', () => {
    const input: unknown = '2025-03';
    const result = isYearMonth(input);
    expect(result).toBe(true);
    if (!result) {
      throw new Error('expected isYearMonth to return true');
    }

    const yearMonth: string = input;
    expect(yearMonth).toBe('2025-03');
  });
});
