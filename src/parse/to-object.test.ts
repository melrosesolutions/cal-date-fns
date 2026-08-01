import { describe, it, expect } from 'vitest';
import { toObject } from './to-object';
import { CalDateRangeError } from '../errors/cal-date-range-error';

describe('toObject', () => {
  it('converts a CalDate string to a CalDateObj', () => {
    expect(toObject('2025-03-15')).toEqual({ y: 2025, m: 3, d: 15 });
  });

  it('converts a YearMonth string to a YearMonthObj', () => {
    expect(toObject('2025-03')).toEqual({ y: 2025, m: 3 });
  });

  it('passes through an already-valid CalDateObj', () => {
    expect(toObject({ y: 2025, m: 3, d: 15 })).toEqual({ y: 2025, m: 3, d: 15 });
  });

  it('passes through an already-valid YearMonthObj', () => {
    expect(toObject({ y: 2025, m: 3 })).toEqual({ y: 2025, m: 3 });
  });

  it('throws CalDateRangeError for an invalid CalDate string', () => {
    expect(() => toObject('2025-02-30')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for a malformed string', () => {
    expect(() => toObject('not-a-date')).toThrow(CalDateRangeError);
  });

  it('throws CalDateRangeError for null', () => {
    expect(() => toObject(null as never)).toThrow(CalDateRangeError);
  });

  it('includes the offending input in the error message', () => {
    expect(() => toObject('bad-input')).toThrow(/bad-input/);
  });
});
