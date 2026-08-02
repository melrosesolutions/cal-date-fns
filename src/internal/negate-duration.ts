import type { Duration } from '../types/duration.type';

export function negateDuration(duration: Duration): Duration {
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
