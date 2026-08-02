import { describe, it, expect } from 'vitest';
import { negateDuration } from './negate-duration';

describe('negateDuration', () => {
  it('negates all defined duration fields', () => {
    expect(negateDuration({ years: 1, months: 2, weeks: 3, days: 4 })).toEqual({
      years: -1,
      months: -2,
      weeks: -3,
      days: -4,
    });
  });

  it('preserves undefined fields by omitting them', () => {
    expect(negateDuration({ years: 1, days: 5 })).toEqual({ years: -1, days: -5 });
  });

  it('negates negative values to positive values', () => {
    expect(negateDuration({ years: -2, weeks: -1 })).toEqual({ years: 2, weeks: 1 });
  });
});
