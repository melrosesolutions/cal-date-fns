import { describe, it, expect } from 'vitest';
import { createDayFormatter } from './create-day-formatter';

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
      { type: 'weekday', value: 'Mon' },
      { type: 'literal', value: ' – ' },
      { type: 'weekday', value: 'Fri' },
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

describe('createDayFormatter', () => {
  it('formats day names in English and wraps numeric input', () => {
    const fmt = createDayFormatter('en-GB', 'long');

    expect(fmt.getDay('2025-03-15')).toBe('Saturday');
    expect(fmt.getDay(6)).toBe('Saturday');
    expect(fmt.getDay(13)).toBe('Saturday');
  });

  it('formats day names in French with short style', () => {
    const fmt = createDayFormatter('fr-FR', 'short');

    expect(fmt.getDay('2025-03-15')).toBe('sam.');
    const range = fmt
      .getDayRange(1, 5)
      .replace(/[\s\u202F]+/g, ' ')
      .trim();
    expect(range).toBe('lun. – ven.');
  });

  it('formats day names from an English date string with parse fallback', () => {
    const fmt = createDayFormatter('en-GB', 'long');
    expect(fmt.getDay('March 15 2025')).toBe('Saturday');
  });

  it('returns day name parts for custom rendering', () => {
    const fmt = createDayFormatter('en-GB', 'long');
    const parts = fmt.getDayParts(6);

    expect(parts).toEqual(expect.arrayContaining([{ type: 'weekday', value: 'Saturday' }]));
  });

  it('throws for invalid day input', () => {
    const fmt = createDayFormatter('en-GB', 'long');
    expect(() => fmt.getDay('not-a-day')).toThrow(TypeError);
  });

  it('uses the native formatRange implementation when available', () => {
    const result = withMockedFormatRange(() => {
      const fmt = createDayFormatter('en-GB', 'short');
      return fmt.getDayRange(1, 5);
    });

    expect(result).toBe('mock-range');
  });

  it('uses the native formatRangeToParts implementation when available', () => {
    const parts = withMockedFormatRange(() => {
      const fmt = createDayFormatter('en-GB', 'short');
      return fmt.getDayRangeParts(1, 5);
    });

    expect(parts).toEqual([
      { type: 'weekday', value: 'Mon' },
      { type: 'literal', value: ' – ' },
      { type: 'weekday', value: 'Fri' },
    ]);
  });

  it('falls back to range formatting when formatRange is unavailable', () => {
    const result = withoutFormatRange(() => {
      const fmt = createDayFormatter('en-GB', 'short');
      return fmt.getDayRange(1, 5);
    });

    expect(result.replace(/\s+/g, ' ')).toBe('Mon – Fri');
  });

  it('falls back to range parts formatting when formatRangeToParts is unavailable', () => {
    const parts = withoutFormatRange(() => {
      const fmt = createDayFormatter('en-GB', 'long');
      return fmt.getDayRangeParts(1, 5);
    });

    expect(parts).toEqual(expect.arrayContaining([{ type: 'literal', value: ' – ' }]));
    expect(parts).toEqual(expect.arrayContaining([{ type: 'weekday', value: 'Monday' }]));
  });

  it('accepts CalDateObj inputs', () => {
    const fmt = createDayFormatter('en-GB', 'long');
    const obj = { y: 2025, m: 3, d: 16 };
    expect(fmt.getDay(obj)).toBe('Sunday');
  });

  it('uses native formatRange when only formatRange exists', () => {
    const result = withMockedFormatRangeOnly(() => {
      const fmt = createDayFormatter('en-GB', 'short');
      return fmt.getDayRange(1, 5);
    });

    expect(result).toBe('mock-range-only');
  });
});
