import { describe, it, expect } from 'vitest';
import { parse } from './parse';
import { CalDateFormatError } from '../errors/cal-date-format-error';
import { CalDateParseError } from '../errors/cal-date-parse-error';

describe('parse', () => {
  it('parses a full CalDate string with day, month, and year tokens', () => {
    expect(parse('15/03/2025', 'DD/MM/YYYY')).toBe('2025-03-15');
  });

  it('parses a YearMonth string without a day token', () => {
    expect(parse('03/2025', 'MM/YYYY')).toBe('2025-03');
  });

  it('parses a compact numeric date string', () => {
    expect(parse('20250315', 'YYYYMMDD')).toBe('2025-03-15');
  });

  it('parses a date string with dot separators', () => {
    expect(parse('3.15.25', 'M.DD.YY')).toBe('2025-03-15');
  });

  it('parses a YearMonth string with dots', () => {
    expect(parse('03.2025', 'MM.YYYY')).toBe('2025-03');
  });

  it('parses a month name-friendly format using only numeric tokens', () => {
    expect(parse('2025-03', 'YYYY-MM')).toBe('2025-03');
  });

  it('throws a CalDateFormatError for unsupported token sequences', () => {
    expect(() => parse('2025-03-15', 'YYYY-MMM-DD')).toThrow(CalDateFormatError);
  });

  it('throws a CalDateParseError when the value does not match the format', () => {
    expect(() => parse('15-03-2025', 'YYYY/MM/DD')).toThrow(CalDateParseError);
  });

  it('throws a CalDateParseError for invalid month/day values', () => {
    expect(() => parse('31/02/2025', 'DD/MM/YYYY')).toThrow(CalDateParseError);
  });

  it('parses two-digit years using the pivotYear option', () => {
    expect(parse('01/01/25', 'DD/MM/YY', { pivotYear: 50 })).toBe('2025-01-01');
    expect(parse('01/01/75', 'DD/MM/YY', { pivotYear: 50 })).toBe('1975-01-01');
  });
});
