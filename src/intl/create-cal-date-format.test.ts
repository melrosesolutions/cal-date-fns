import { describe, it, expect } from 'vitest';
import { createCalDateFormat } from './create-cal-date-format';

interface DateTimeFormatWithRange {
  formatRange?(date1: Date, date2: Date): string;
}

function withUnavailableFormatRange<T>(callback: () => T): T {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRange',
  );

  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', {
    value: undefined,
    configurable: true,
  });

  try {
    return callback();
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', originalDescriptor);
    } else {
      delete (Intl.DateTimeFormat.prototype as Partial<DateTimeFormatWithRange>).formatRange;
    }
  }
}

describe('createCalDateFormat', () => {
  it('formats a CalDate in UTC with locale-specific output', () => {
    const fmt = createCalDateFormat('en-GB', { month: 'long', year: 'numeric' });
    expect(fmt.format('2025-03-15')).toBe('March 2025');
  });

  it('formats a YearMonth input using the first day of the month', () => {
    const fmt = createCalDateFormat('en-GB', { month: 'long', year: 'numeric' });
    expect(fmt.format('2025-03')).toBe('March 2025');
  });

  it('formats a date range in UTC safely', () => {
    const fmt = createCalDateFormat('en-GB', { month: 'short', year: 'numeric' });
    const result = fmt.formatRange('2025-03-01', '2025-05-31');
    expect(result.replace(/\s+/g, ' ')).toBe('Mar – May 2025');
  });

  it('returns formatted parts for a CalDate', () => {
    const fmt = createCalDateFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const parts = fmt.formatToParts('2025-03-15');
    expect(
      parts.some(
        (part: Intl.DateTimeFormatPart) => part.type === 'month' && part.value === 'March',
      ),
    ).toBe(true);
    expect(
      parts.some((part: Intl.DateTimeFormatPart) => part.type === 'day' && part.value === '15'),
    ).toBe(true);
    expect(
      parts.some((part: Intl.DateTimeFormatPart) => part.type === 'year' && part.value === '2025'),
    ).toBe(true);
  });

  it('formats a date with default UTC options when no options are provided', () => {
    const fmt = createCalDateFormat('en-GB');
    const expected = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' }).format(
      new Date(Date.UTC(2025, 2, 15)),
    );
    expect(fmt.format('2025-03-15')).toBe(expected);
  });

  it('formats weekday and day name output in English', () => {
    const fmt = createCalDateFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    expect(fmt.format('2025-03-15')).toBe('Saturday, 15 March 2025');
  });

  it('formats weekday and day name output in French', () => {
    const fmt = createCalDateFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    expect(fmt.format('2025-03-15')).toBe('samedi 15 mars 2025');
  });

  it('falls back to range formatting when formatRange is unavailable', () => {
    const result = withUnavailableFormatRange(() => {
      const fmt = createCalDateFormat('en-GB', { month: 'short', year: 'numeric' });
      return fmt.formatRange('2025-03-01', '2025-05-31');
    });

    expect(result).toBe('Mar 2025 – May 2025');
  });

  it('throws for unsupported time-related options', () => {
    const invalidOptions = { hour: 'numeric' } as unknown as Parameters<
      typeof createCalDateFormat
    >[1];
    expect(() => createCalDateFormat('en-GB', invalidOptions)).toThrow();
  });
});
