import { describe, it, expect } from 'vitest';
import { fromEpochDay, fromEpochDayObj } from './from-epoch-day';
import { toEpochDay } from './to-epoch-day';

describe('fromEpochDay', () => {
  it('returns 1970-01-01 for epoch day 0', () => {
    expect(fromEpochDay(0)).toBe('1970-01-01');
  });

  it('returns the day after the epoch for day 1', () => {
    expect(fromEpochDay(1)).toBe('1970-01-02');
  });

  it('returns the day before the epoch for day -1', () => {
    expect(fromEpochDay(-1)).toBe('1969-12-31');
  });

  it('matches a known reference date', () => {
    expect(fromEpochDay(20089)).toBe('2025-01-01');
  });

  it('handles a deeply negative epoch day (exercises the negative-era branch)', () => {
    // Round-trips the year-0 case used in to-epoch-day.test.ts, which sits
    // on the negative side of the era calculation in both directions.
    expect(fromEpochDay(-719528)).toBe('0000-01-01');
  });

  it('pads single-digit months and days with a leading zero', () => {
    expect(fromEpochDay(toEpochDay('2025-01-05'))).toBe('2025-01-05');
  });

  it('handles a leap day correctly', () => {
    expect(fromEpochDay(toEpochDay('2024-02-29'))).toBe('2024-02-29');
  });

  it('throws RangeError for a non-integer input', () => {
    expect(() => fromEpochDay(1.5)).toThrow(RangeError);
  });

  it('throws RangeError for NaN', () => {
    expect(() => fromEpochDay(NaN)).toThrow(RangeError);
  });

  describe('round-trip with toEpochDay', () => {
    it('round-trips a representative sample of dates, including edge cases', () => {
      const sampleDates = [
        '1970-01-01',
        '1969-12-31',
        '1900-01-01',
        '1900-02-28',
        '1900-03-01', // 1900 is NOT a leap year
        '2000-02-28',
        '2000-02-29',
        '2000-03-01', // 2000 IS a leap year
        '2024-02-29',
        '2025-12-31',
        '2026-01-01',
        '1850-06-15',
        '2100-01-01',
      ];

      for (const date of sampleDates) {
        expect(fromEpochDay(toEpochDay(date))).toBe(date);
      }
    });

    it('round-trips every day across a multi-year span without drift', () => {
      let epochDay = toEpochDay('2020-01-01');
      const endEpochDay = toEpochDay('2026-12-31');

      while (epochDay <= endEpochDay) {
        const dateStr = fromEpochDay(epochDay);
        expect(toEpochDay(dateStr)).toBe(epochDay);
        epochDay += 1;
      }
    });

    it('round-trips across a wide range spanning deep negative years to far future years', () => {
      // Regression test: an earlier version of the era calculation carried over
      // a C++-specific truncating-division adjustment that is incorrect under
      // JavaScript's Math.floor (which already floors correctly for negative
      // numbers). That bug only manifested for years before 0 — this test
      // exercises that exact region directly via fromEpochDayObj/toEpochDay,
      // since CalDate strings cannot represent negative years.
      //
      // Sampling every 37th day (a prime, to avoid accidentally only hitting
      // one weekday/pattern) across roughly 4000 years keeps the test fast
      // while still covering every month, every leap year, and every era
      // boundary in range at least once.
      const startEpochDay = -800_000; // ~ year -2160
      const endEpochDay = 800_000; // ~ year 4140
      const step = 37;

      for (let epochDay = startEpochDay; epochDay <= endEpochDay; epochDay += step) {
        const obj = fromEpochDayObj(epochDay);
        const back = toEpochDay(obj);
        expect(back).toBe(epochDay);
      }
    });
  });
});

describe('fromEpochDayObj', () => {
  it('returns the object form directly', () => {
    expect(fromEpochDayObj(0)).toEqual({ y: 1970, m: 1, d: 1 });
  });

  it("matches fromEpochDay's components", () => {
    const obj = fromEpochDayObj(20089);
    expect(obj).toEqual({ y: 2025, m: 1, d: 1 });
  });

  it('throws RangeError for a non-integer input', () => {
    expect(() => fromEpochDayObj(1.5)).toThrow(RangeError);
  });
});
