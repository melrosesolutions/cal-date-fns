import { describe, it, expect } from 'vitest';
import { add } from './add';
import { CalDateOptionsError } from '../errors/cal-date-options-error';

describe('add', () => {
  it('adds a simple day duration to a CalDate string', () => {
    expect(add('2025-01-15', { days: 10 })).toBe('2025-01-25');
  });

  it('adds months and days to a CalDate string in the expected order', () => {
    expect(add('2025-01-15', { months: 2, days: 5 })).toBe('2025-03-20');
  });

  it('clamps the day when adding months to a month with fewer days', () => {
    expect(add('2025-01-31', { months: 1 })).toBe('2025-02-28');
  });

  it('clamps a leap-day when adding one year', () => {
    expect(add('2024-02-29', { years: 1 })).toBe('2025-02-28');
  });

  it('adds months to a YearMonth string', () => {
    expect(add('2025-01', { months: 3 })).toBe('2025-04');
  });

  it('adds years and months to a YearMonth object', () => {
    expect(add({ y: 2025, m: 1 }, { years: 1, months: 2 })).toBe('2026-03');
  });

  it('accepts negative day durations on CalDate input', () => {
    expect(add('2025-03-15', { days: -5 })).toBe('2025-03-10');
  });

  it('accepts negative month durations on CalDate input', () => {
    expect(add('2025-03-31', { months: -1 })).toBe('2025-02-28');
  });

  it('accepts negative month durations on YearMonth input', () => {
    expect(add('2025-03', { months: -1 })).toBe('2025-02');
  });

  it('throws CalDateOptionsError when applying days to YearMonth input', () => {
    expect(() => add('2025-03', { days: 1 })).toThrow(CalDateOptionsError);
  });

  it('throws CalDateOptionsError when applying weeks to YearMonth input', () => {
    expect(() => add('2025-03', { weeks: 1 })).toThrow(CalDateOptionsError);
  });
});
