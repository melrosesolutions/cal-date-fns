import type { AnyDateInput } from '../types/any-date-input.type';
import type { Duration } from '../types/duration.type';
import { add } from './add';

function negateDuration(duration: Duration): Duration {
  const negated: Duration = {};

  if (duration.years !== undefined) {
    negated.years = -duration.years;
  }

  if (duration.months !== undefined) {
    negated.months = -duration.months;
  }

  if (duration.weeks !== undefined) {
    negated.weeks = -duration.weeks;
  }

  if (duration.days !== undefined) {
    negated.days = -duration.days;
  }

  return negated;
}

export function subtract(input: AnyDateInput, duration: Duration): string {
  return add(input, negateDuration(duration));
}
