import type { AnyDateInput } from '../types/any-date-input.type';

export interface CalDateFormat {
  format(input: AnyDateInput): string;
  formatRange(start: AnyDateInput, end: AnyDateInput): string;
  formatToParts(input: AnyDateInput): Intl.DateTimeFormatPart[];
}
