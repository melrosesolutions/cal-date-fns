import type { AnyDateInput } from '../types/any-date-input.type';
import type { Duration } from '../types/duration.type';
import { add } from './add';
import { negateDuration } from '../internal/negate-duration';

export function subtract(input: AnyDateInput, duration: Duration): string {
  return add(input, negateDuration(duration));
}
