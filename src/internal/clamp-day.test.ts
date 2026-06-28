import { describe, it, expect } from 'vitest';
import { clampDay } from './clamp-day';

describe('clampDay', () => {
  it('returns the day unchanged when it is within range', () => {
    expect(clampDay(2025, 1, 15)).toBe(15);
    expect(clampDay(2025, 4, 30)).toBe(30);
  });

  it('clamps day 31 to 28 for a non-leap February', () => {
    expect(clampDay(2025, 2, 31)).toBe(28);
  });

  it('clamps day 31 to 29 for a leap February', () => {
    expect(clampDay(2024, 2, 31)).toBe(29);
  });

  it('clamps day 31 to 30 for a 30-day month', () => {
    expect(clampDay(2025, 4, 31)).toBe(30);
  });

  it("does not clamp when day exactly equals the month's max", () => {
    expect(clampDay(2025, 2, 28)).toBe(28);
    expect(clampDay(2025, 1, 31)).toBe(31);
  });
});
