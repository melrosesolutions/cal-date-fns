import { describe, it, expect } from 'vitest';
import { getDaysInMonth } from './get-days-in-month';

describe('getDaysInMonth', () => {
  describe('months with 31 days', () => {
    it('returns 31 for January', () => {
      expect(getDaysInMonth(2024, 1)).toBe(31);
    });

    it('returns 31 for March', () => {
      expect(getDaysInMonth(2024, 3)).toBe(31);
    });

    it('returns 31 for May', () => {
      expect(getDaysInMonth(2024, 5)).toBe(31);
    });

    it('returns 31 for July', () => {
      expect(getDaysInMonth(2024, 7)).toBe(31);
    });

    it('returns 31 for August', () => {
      expect(getDaysInMonth(2024, 8)).toBe(31);
    });

    it('returns 31 for October', () => {
      expect(getDaysInMonth(2024, 10)).toBe(31);
    });

    it('returns 31 for December', () => {
      expect(getDaysInMonth(2024, 12)).toBe(31);
    });
  });

  describe('months with 30 days', () => {
    it('returns 30 for April', () => {
      expect(getDaysInMonth(2024, 4)).toBe(30);
    });

    it('returns 30 for June', () => {
      expect(getDaysInMonth(2024, 6)).toBe(30);
    });

    it('returns 30 for September', () => {
      expect(getDaysInMonth(2024, 9)).toBe(30);
    });

    it('returns 30 for November', () => {
      expect(getDaysInMonth(2024, 11)).toBe(30);
    });
  });

  describe('February', () => {
    it('returns 28 for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 2)).toBe(28);
    });

    it('returns 29 for February in leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });
  });
});
