import type { AnyDateInput } from '../types/any-date-input.type';

export interface CalMonthFormatter {
  getMonth(input: AnyDateInput | number): string;
  getMonthRange(start: AnyDateInput | number, end: AnyDateInput | number): string;
  getMonthParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[];
  getMonthRangeParts(
    start: AnyDateInput | number,
    end: AnyDateInput | number,
  ): Intl.DateTimeFormatPart[];
}
