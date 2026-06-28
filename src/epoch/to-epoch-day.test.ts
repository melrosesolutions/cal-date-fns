import { describe, it, expect } from 'vitest';
import { toEpochDay } from './to-epoch-day';
import { CalDateRangeError } from '../errors/cal-date-range-error';

describe('toEpochDay', () => {
  it('returns 0 for the epoch date 1970-01-01', () => {
    expect(toEpochDay('1970-01-01')).toBe(0);
  });

  it('returns 1 for the day after the epoch', () => {
    expect(toEpochDay('1970-01-02')).toBe(1);
  });

  it('returns -1 for the day before the epoch', () => {
    expect(toEpochDay('1969-12-31')).toBe(-1);
  });

  it('matches a known reference date (2000-01-01 = day 10957)', () => {
    expect(toEpochDay('2000-01-01')).toBe(10957);
  });

  it('matches a known reference date (2025-01-01)', () => {
    // Days from 1970-01-01 to 2025-01-01: 55 years, 14 of which are leap (1972..2024 step 4, minus century exceptions)
    // Verified against Howard Hinnant's reference algorithm.
    expect(toEpochDay('2025-01-01')).toBe(20089);
  });

  it('increases monotonically across a month boundary', () => {
    expect(toEpochDay('2025-01-31') + 1).toBe(toEpochDay('2025-02-01'));
  });

  it('increases monotonically across a leap-year February', () => {
    expect(toEpochDay('2024-02-28') + 1).toBe(toEpochDay('2024-02-29'));
    expect(toEpochDay('2024-02-29') + 1).toBe(toEpochDay('2024-03-01'));
  });

  it('increases monotonically across a non-leap-year February', () => {
    expect(toEpochDay('2025-02-28') + 1).toBe(toEpochDay('2025-03-01'));
  });

  it('increases monotonically across a year boundary', () => {
    expect(toEpochDay('2025-12-31') + 1).toBe(toEpochDay('2026-01-01'));
  });

  it('increases monotonically across a century boundary (non-leap century)', () => {
    expect(toEpochDay('1899-12-31') + 1).toBe(toEpochDay('1900-01-01'));
    expect(toEpochDay('1900-02-28') + 1).toBe(toEpochDay('1900-03-01')); // 1900 not a leap year
  });

  it('increases monotonically across a 400-year era boundary', () => {
    expect(toEpochDay('1999-12-31') + 1).toBe(toEpochDay('2000-01-01'));
    expect(toEpochDay('2000-02-28') + 1).toBe(toEpochDay('2000-02-29')); // 2000 IS a leap year
  });

  it('accepts a CalDateObj', () => {
    expect(toEpochDay({ y: 1970, m: 1, d: 1 })).toBe(0);
  });

  it('handles dates well before the epoch (negative years relative to 1970)', () => {
    expect(toEpochDay('1900-01-01')).toBeLessThan(0);
  });

  it('handles a year before year 0 (exercises the negative-era branch)', () => {
    // year 0, month <= 2 makes the internal yAdj negative, exercising the
    // negative branch of the era calculation in the Hinnant algorithm.
    expect(() => toEpochDay({ y: 0, m: 1, d: 1 })).not.toThrow();
    expect(toEpochDay({ y: 0, m: 1, d: 1 })).toBe(-719528);
  });

  it('throws CalDateRangeError for an invalid date', () => {
    expect(() => toEpochDay('2025-02-30')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for a YearMonth string (no day component)', () => {
    expect(() => toEpochDay('2025-02')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for a malformed string', () => {
    expect(() => toEpochDay('not-a-date')).toThrow(CalDateRangeError);
  });
});
