import { describe, it, expect } from 'vitest';
import { isCalDate } from './is-cal-date';

describe('isCalDate', () => {
  it('returns true for a valid CalDate string', () => {
    expect(isCalDate('2025-03-15')).toBe(true);
  });

  it('returns false for a valid YearMonth string (no day component)', () => {
    expect(isCalDate('2025-03')).toBe(false);
  });

  it('returns false for an invalid calendar date (Feb 30)', () => {
    expect(isCalDate('2025-02-30')).toBe(false);
  });

  it('returns false for a malformed string', () => {
    expect(isCalDate('not-a-date')).toBe(false);
  });

  it('returns false for a CalDateObj (string-only guard)', () => {
    expect(isCalDate({ y: 2025, m: 3, d: 15 })).toBe(false);
  });

  it('returns false for a YearMonthObj', () => {
    expect(isCalDate({ y: 2025, m: 3 })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isCalDate(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isCalDate(undefined)).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isCalDate(20250315)).toBe(false);
  });

  it('narrows the type correctly when used as a guard', () => {
    const input: unknown = '2025-03-15';
    const result = isCalDate(input);
    expect(result).toBe(true);
    if (!result) {
      throw new Error('expected isCalDate to return true');
    }

    const calDate: string = input;
    expect(calDate).toBe('2025-03-15');
  });
});
