import { describe, it, expect } from 'vitest';
import { subtract } from './subtract';
import { CalDateOptionsError } from '../errors/cal-date-options-error';

describe('subtract', () => {
  it('subtracts months and days from a CalDate string', () => {
    expect(subtract('2025-03-20', { months: 2, days: 5 })).toBe('2025-01-15');
  });

  it('clamps the day when subtracting a month from a CalDate string', () => {
    expect(subtract('2025-03-31', { months: 1 })).toBe('2025-02-28');
  });

  it('subtracts months from a YearMonth string', () => {
    expect(subtract('2025-04', { months: 2 })).toBe('2025-02');
  });

  it('subtracts a year from a CalDate string', () => {
    expect(subtract('2025-03-15', { years: 1 })).toBe('2024-03-15');
  });

  it('subtracts a week from a CalDate string', () => {
    expect(subtract('2025-03-15', { weeks: 1 })).toBe('2025-03-08');
  });

  it('accepts negative durations and behaves like add', () => {
    expect(subtract('2025-03-15', { days: -5 })).toBe('2025-03-20');
  });

  it('throws CalDateOptionsError when applying days to YearMonth input', () => {
    expect(() => subtract('2025-03', { days: 1 })).toThrow(CalDateOptionsError);
  });
});
