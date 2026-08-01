import { describe, it, expect } from 'vitest';
import { isValid } from './is-valid';

describe('isValid', () => {
  it('returns true for a valid CalDate string', () => {
    expect(isValid('2025-03-15')).toBe(true);
  });

  it('returns true for a valid YearMonth string', () => {
    expect(isValid('2025-03')).toBe(true);
  });

  it('returns true for a valid CalDateObj', () => {
    expect(isValid({ y: 2025, m: 3, d: 15 })).toBe(true);
  });

  it('returns true for a valid YearMonthObj', () => {
    expect(isValid({ y: 2025, m: 3 })).toBe(true);
  });

  it('returns false for an invalid calendar date (Feb 30)', () => {
    expect(isValid('2025-02-30')).toBe(false);
  });

  it('returns false for an invalid month (13)', () => {
    expect(isValid('2025-13-01')).toBe(false);
  });

  it('returns false for a malformed string', () => {
    expect(isValid('not-a-date')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValid(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValid(undefined)).toBe(false);
  });

  it('returns false for a number', () => {
    expect(isValid(20250315)).toBe(false);
  });

  it('returns false for a native Date object', () => {
    expect(isValid(new Date())).toBe(false);
  });
});
