import { describe, it, expect } from 'vitest';
import { createMonthFormatter } from './create-month-formatter';

interface DateTimeFormatWithRange {
  formatRange?(date1: Date, date2: Date): string;
  formatRangeToParts?(date1: Date, date2: Date): Intl.DateTimeFormatPart[];
}

function withoutFormatRange<T>(callback: () => T): T {
  const descriptorRange = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRange',
  );
  const descriptorRangeToParts = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRangeToParts',
  );

  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', {
    value: undefined,
    configurable: true,
  });
  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRangeToParts', {
    value: undefined,
    configurable: true,
  });

  try {
    return callback();
  } finally {
    if (descriptorRange) {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', descriptorRange);
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRange;
    }

    if (descriptorRangeToParts) {
      Object.defineProperty(
        Intl.DateTimeFormat.prototype,
        'formatRangeToParts',
        descriptorRangeToParts,
      );
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRangeToParts;
    }
  }
}

function withMockedFormatRange<T>(callback: () => T): T {
  const descriptorRange = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRange',
  );
  const descriptorRangeToParts = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRangeToParts',
  );

  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', {
    value: () => 'mock-range',
    configurable: true,
  });
  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRangeToParts', {
    value: () => [
      { type: 'month', value: 'Mar' },
      { type: 'literal', value: ' – ' },
      { type: 'month', value: 'Jun' },
    ],
    configurable: true,
  });

  try {
    return callback();
  } finally {
    if (descriptorRange) {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', descriptorRange);
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRange;
    }

    if (descriptorRangeToParts) {
      Object.defineProperty(
        Intl.DateTimeFormat.prototype,
        'formatRangeToParts',
        descriptorRangeToParts,
      );
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRangeToParts;
    }
  }
}

function withMockedFormatRangeOnly<T>(callback: () => T): T {
  const descriptorRange = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRange',
  );
  const descriptorRangeToParts = Object.getOwnPropertyDescriptor(
    Intl.DateTimeFormat.prototype,
    'formatRangeToParts',
  );

  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', {
    value: () => 'mock-range-only',
    configurable: true,
  });
  Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRangeToParts', {
    value: undefined,
    configurable: true,
  });

  try {
    return callback();
  } finally {
    if (descriptorRange) {
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'formatRange', descriptorRange);
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRange;
    }

    if (descriptorRangeToParts) {
      Object.defineProperty(
        Intl.DateTimeFormat.prototype,
        'formatRangeToParts',
        descriptorRangeToParts,
      );
    } else {
      delete (Intl.DateTimeFormat.prototype as DateTimeFormatWithRange).formatRangeToParts;
    }
  }
}

describe('createMonthFormatter', () => {
  it('formats month names in English and wraps numeric input', () => {
    const fmt = createMonthFormatter('en-GB', 'long');

    expect(fmt.getMonth('2025-03-15')).toBe('March');
    expect(fmt.getMonth(3)).toBe('March');
    expect(fmt.getMonth(15)).toBe('March');
  });

  it('formats month names in German with short style', () => {
    const fmt = createMonthFormatter('de', 'short');

    expect(fmt.getMonth('2025-03')).toBe('Mär');
    const range = fmt
      .getMonthRange(3, 6)
      .replace(/[\s\u202F]+/g, ' ')
      .trim();
    expect(range).toBe('Mär – Jun');
  });

  it('formats month names from an English date string with parse fallback', () => {
    const fmt = createMonthFormatter('en-GB', 'long');
    expect(fmt.getMonth('March 15 2025')).toBe('March');
  });

  it('returns month name parts for custom rendering', () => {
    const fmt = createMonthFormatter('en-GB', 'long');
    const parts = fmt.getMonthParts(3);

    expect(parts).toEqual(expect.arrayContaining([{ type: 'month', value: 'March' }]));
  });

  it('throws for invalid month input', () => {
    const fmt = createMonthFormatter('en-GB', 'long');
    expect(() => fmt.getMonth('not-a-month')).toThrow(TypeError);
  });

  it('uses the native formatRange implementation when available', () => {
    const result = withMockedFormatRange(() => {
      const fmt = createMonthFormatter('en-GB', 'short');
      return fmt.getMonthRange(3, 6);
    });

    expect(result).toBe('mock-range');
  });

  it('uses the native formatRangeToParts implementation when available', () => {
    const parts = withMockedFormatRange(() => {
      const fmt = createMonthFormatter('en-GB', 'short');
      return fmt.getMonthRangeParts(3, 6);
    });

    expect(parts).toEqual([
      { type: 'month', value: 'Mar' },
      { type: 'literal', value: ' – ' },
      { type: 'month', value: 'Jun' },
    ]);
  });

  it('falls back to range formatting when formatRange is unavailable', () => {
    const result = withoutFormatRange(() => {
      const fmt = createMonthFormatter('en-GB', 'short');
      return fmt.getMonthRange(3, 5);
    });

    expect(result.replace(/\s+/g, ' ')).toBe('Mar – May');
  });

  it('falls back to range parts formatting when formatRangeToParts is unavailable', () => {
    const parts = withoutFormatRange(() => {
      const fmt = createMonthFormatter('en-GB', 'long');
      return fmt.getMonthRangeParts(3, 5);
    });

    expect(parts).toEqual(expect.arrayContaining([{ type: 'literal', value: ' – ' }]));
    expect(parts).toEqual(expect.arrayContaining([{ type: 'month', value: 'March' }]));
  });

  it('accepts YearMonthObj inputs', () => {
    const fmt = createMonthFormatter('en-GB', 'long');
    const ym = { y: 2025, m: 3 };
    expect(fmt.getMonth(ym)).toBe('March');
  });

  it('uses native formatRange when only formatRange exists', () => {
    const result = withMockedFormatRangeOnly(() => {
      const fmt = createMonthFormatter('en-GB', 'short');
      return fmt.getMonthRange(3, 6);
    });

    expect(result).toBe('mock-range-only');
  });
});
