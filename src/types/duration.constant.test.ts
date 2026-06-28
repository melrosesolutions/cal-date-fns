import { describe, it, expect } from 'vitest';
import { DURATION_UNIT_ORDER } from './duration.constant';
import type { DurationUnit } from './duration.type';

describe('DURATION_UNIT_ORDER', () => {
  it('lists every DurationUnit exactly once, ordered largest to smallest', () => {
    expect(DURATION_UNIT_ORDER).toEqual(['years', 'months', 'weeks', 'days']);
  });

  it('contains exactly the four DurationUnit values with no duplicates', () => {
    const expected: readonly DurationUnit[] = ['years', 'months', 'weeks', 'days'];
    expect(new Set(DURATION_UNIT_ORDER).size).toBe(DURATION_UNIT_ORDER.length);
    for (const unit of expected) {
      expect(DURATION_UNIT_ORDER).toContain(unit);
    }
  });
});
