import { describe, it, expect } from 'vitest';
import { normalizeInput, isCalDateObj } from './normalize-input';

describe('normalizeInput', () => {
  describe('CalDate strings', () => {
    it('parses a valid CalDate string', () => {
      expect(normalizeInput('2025-03-15')).toEqual({ y: 2025, m: 3, d: 15 });
    });

    it('parses the first and last day of a month', () => {
      expect(normalizeInput('2025-01-01')).toEqual({ y: 2025, m: 1, d: 1 });
      expect(normalizeInput('2025-01-31')).toEqual({ y: 2025, m: 1, d: 31 });
    });

    it('parses Feb 29 in a leap year', () => {
      expect(normalizeInput('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
    });

    it('rejects Feb 29 in a non-leap year', () => {
      expect(normalizeInput('2025-02-29')).toBeNull();
    });

    it('rejects Feb 30', () => {
      expect(normalizeInput('2025-02-30')).toBeNull();
    });

    it('rejects April 31st (April has 30 days)', () => {
      expect(normalizeInput('2025-04-31')).toBeNull();
    });

    it('rejects month 00', () => {
      expect(normalizeInput('2025-00-15')).toBeNull();
    });

    it('rejects month 13', () => {
      expect(normalizeInput('2025-13-15')).toBeNull();
    });

    it('rejects day 00', () => {
      expect(normalizeInput('2025-03-00')).toBeNull();
    });

    it('rejects malformed strings (wrong separators, lengths)', () => {
      expect(normalizeInput('2025/03/15')).toBeNull();
      expect(normalizeInput('25-03-15')).toBeNull();
      expect(normalizeInput('2025-3-15')).toBeNull();
      expect(normalizeInput('2025-03-1')).toBeNull();
    });
  });

  describe('YearMonth strings', () => {
    it('parses a valid YearMonth string', () => {
      expect(normalizeInput('2025-03')).toEqual({ y: 2025, m: 3 });
    });

    it('parses month 01 and month 12', () => {
      expect(normalizeInput('2025-01')).toEqual({ y: 2025, m: 1 });
      expect(normalizeInput('2025-12')).toEqual({ y: 2025, m: 12 });
    });

    it('rejects month 00', () => {
      expect(normalizeInput('2025-00')).toBeNull();
    });

    it('rejects month 13', () => {
      expect(normalizeInput('2025-13')).toBeNull();
    });

    it('rejects malformed strings', () => {
      expect(normalizeInput('2025-3')).toBeNull();
      expect(normalizeInput('25-03')).toBeNull();
    });
  });

  describe('CalDateObj input', () => {
    it('accepts a valid CalDateObj', () => {
      expect(normalizeInput({ y: 2025, m: 3, d: 15 })).toEqual({
        y: 2025,
        m: 3,
        d: 15,
      });
    });

    it('rejects an object with an invalid day for the given month', () => {
      expect(normalizeInput({ y: 2025, m: 2, d: 30 })).toBeNull();
    });

    it('rejects an object with non-integer fields', () => {
      expect(normalizeInput({ y: 2025.5, m: 3, d: 15 })).toBeNull();
      expect(normalizeInput({ y: 2025, m: 3.5, d: 15 })).toBeNull();
      expect(normalizeInput({ y: 2025, m: 3, d: 15.5 })).toBeNull();
    });

    it('rejects an object with non-number fields', () => {
      expect(normalizeInput({ y: '2025', m: 3, d: 15 })).toBeNull();
    });

    it('rejects an object where d is present but not a number', () => {
      expect(normalizeInput({ y: 2025, m: 3, d: '15' })).toBeNull();
    });
  });

  describe('YearMonthObj input', () => {
    it('accepts a valid YearMonthObj', () => {
      expect(normalizeInput({ y: 2025, m: 3 })).toEqual({ y: 2025, m: 3 });
    });

    it('rejects an object with an invalid month', () => {
      expect(normalizeInput({ y: 2025, m: 13 })).toBeNull();
    });
  });

  describe('invalid input types', () => {
    it('rejects null', () => {
      expect(normalizeInput(null)).toBeNull();
    });

    it('rejects undefined', () => {
      expect(normalizeInput(undefined)).toBeNull();
    });

    it('rejects numbers', () => {
      expect(normalizeInput(20250315)).toBeNull();
    });

    it('rejects arrays', () => {
      expect(normalizeInput([2025, 3, 15])).toBeNull();
    });

    it('rejects objects missing required fields', () => {
      expect(normalizeInput({ y: 2025 })).toBeNull();
      expect(normalizeInput({ m: 3 })).toBeNull();
      expect(normalizeInput({})).toBeNull();
    });

    it('rejects a plain Date object', () => {
      expect(normalizeInput(new Date())).toBeNull();
    });
  });
});

describe('isCalDateObj', () => {
  it('returns true for a CalDateObj', () => {
    expect(isCalDateObj({ y: 2025, m: 3, d: 15 })).toBe(true);
  });

  it('returns false for a YearMonthObj', () => {
    expect(isCalDateObj({ y: 2025, m: 3 })).toBe(false);
  });
});
