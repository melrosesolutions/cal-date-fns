import { describe, it, expect } from 'vitest';
import { format } from './format';
import { CalDateFormatError } from '../errors/cal-date-format-error';
import { CalDateRangeError } from '../errors/cal-date-range-error';

describe('format', () => {
  it('formats a full CalDate using zero-padded numeric tokens', () => {
    expect(format('2025-03-15', 'DD/MM/YYYY')).toBe('15/03/2025');
  });

  it('formats a CalDate into ISO-style numeric tokens', () => {
    expect(format('2025-03-15', 'YYYY-MM-DD')).toBe('2025-03-15');
  });

  it('formats a CalDateObj input using compact numeric tokens', () => {
    expect(format({ y: 2025, m: 3, d: 15 }, 'YYYYMMDD')).toBe('20250315');
  });

  it('formats a YearMonthObj input with dots and first-day fallback', () => {
    expect(format({ y: 2025, m: 3 }, 'DD.MM.YYYY')).toBe('01.03.2025');
  });

  it('formats a YearMonth input using month/year tokens only', () => {
    expect(format('2025-03', 'MM/YYYY')).toBe('03/2025');
  });

  it('formats numeric tokens without zero padding when requested', () => {
    expect(format('2025-03-15', 'D/M/YY')).toBe('15/3/25');
  });

  it('formats a complex literal string with embedded tokens', () => {
    expect(format('2025-03-15', 'This is day D, of month M, in the year YYYY')).toBe(
      'This is day 15, of month 3, in the year 2025',
    );
  });

  it('uses the first day of the month when formatting a YearMonth with day tokens', () => {
    expect(format('2025-03', 'DD/MM/YYYY')).toBe('01/03/2025');
  });

  it('throws for unsupported tokens in the format string', () => {
    expect(() => format('2025-03-15', 'YYYY-MMM-DD')).toThrow(CalDateFormatError);
  });

  it('throws when the format string is empty', () => {
    expect(() => format('2025-03-15', '')).toThrow(CalDateFormatError);
  });

  it('throws when the input is not a valid date or month', () => {
    expect(() => format('2025-02-30', 'YYYY-MM-DD')).toThrow(CalDateRangeError);
  });
});
