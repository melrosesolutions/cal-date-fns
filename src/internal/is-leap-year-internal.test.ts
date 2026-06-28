import { describe, it, expect } from 'vitest';
import { isLeapYearInternal } from './is-leap-year-internal';

describe('isLeapYearInternal', () => {
  it('returns true for years divisible by 4 but not by 100', () => {
    expect(isLeapYearInternal(2024)).toBe(true);
    expect(isLeapYearInternal(2028)).toBe(true);
  });

  it('returns false for years not divisible by 4', () => {
    expect(isLeapYearInternal(2023)).toBe(false);
    expect(isLeapYearInternal(2025)).toBe(false);
  });

  it('returns false for century years not divisible by 400', () => {
    expect(isLeapYearInternal(1900)).toBe(false);
    expect(isLeapYearInternal(2100)).toBe(false);
  });

  it('returns true for century years divisible by 400', () => {
    expect(isLeapYearInternal(2000)).toBe(true);
    expect(isLeapYearInternal(1600)).toBe(true);
  });

  it('handles year 0 and negative years consistently with the same rule', () => {
    expect(isLeapYearInternal(0)).toBe(true);
    expect(isLeapYearInternal(-4)).toBe(true);
    expect(isLeapYearInternal(-100)).toBe(false);
  });
});
