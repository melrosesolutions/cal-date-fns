import { describe, it, expect } from 'vitest';
import { isValidCalDate } from './is-valid-caldate';

describe('isValidCalDate', () => {
  describe('invalid format', () => {
    it('returns false for empty string', () => {
      expect(isValidCalDate('')).toBe(false);
    });

    it('returns false for wrong separator', () => {
      expect(isValidCalDate('2024/01/01')).toBe(false);
    });

    it('returns false for non-numeric characters', () => {
      expect(isValidCalDate('abcd-ef-gh')).toBe(false);
    });

    it('returns false for incomplete date', () => {
      expect(isValidCalDate('2024-01')).toBe(false);
    });
  });

  describe('invalid month', () => {
    it('returns false for month 00', () => {
      expect(isValidCalDate('2024-00-01')).toBe(false);
    });

    it('returns false for month 13', () => {
      expect(isValidCalDate('2024-13-01')).toBe(false);
    });
  });

  describe('invalid day', () => {
    it('returns false for day 00', () => {
      expect(isValidCalDate('2024-01-00')).toBe(false);
    });

    it('returns false for day 32 in January', () => {
      expect(isValidCalDate('2024-01-32')).toBe(false);
    });

    it('returns false for day 31 in April', () => {
      expect(isValidCalDate('2024-04-31')).toBe(false);
    });

    it('returns false for day 31 in June', () => {
      expect(isValidCalDate('2024-06-31')).toBe(false);
    });

    it('returns false for day 30 in February non-leap year', () => {
      expect(isValidCalDate('2023-02-30')).toBe(false);
    });

    it('returns false for day 29 in February non-leap year', () => {
      expect(isValidCalDate('2023-02-29')).toBe(false);
    });
  });

  describe('valid dates', () => {
    it('returns true for January max day', () => {
      expect(isValidCalDate('2024-01-31')).toBe(true);
    });

    it('returns true for February 28 in non-leap year', () => {
      expect(isValidCalDate('2023-02-28')).toBe(true);
    });

    it('returns true for February 29 in leap year', () => {
      expect(isValidCalDate('2024-02-29')).toBe(true);
    });

    it('returns true for April max day', () => {
      expect(isValidCalDate('2024-04-30')).toBe(true);
    });

    it('returns true for December max day', () => {
      expect(isValidCalDate('2024-12-31')).toBe(true);
    });
  });
});
