import type { AnyDateInput } from '../types/any-date-input.type';
import type { Duration, DurationOptions } from '../types/duration.type';
import { since } from './since';

export function until(
  dateLeft: AnyDateInput,
  dateRight: AnyDateInput,
  options?: DurationOptions,
): Duration {
  return since(dateRight, dateLeft, options);
}
