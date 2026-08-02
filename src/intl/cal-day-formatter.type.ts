import type { AnyDateInput } from '../types/any-date-input.type';

export interface CalDayFormatter {
  getDay(input: AnyDateInput | number): string;
  getDayRange(start: AnyDateInput | number, end: AnyDateInput | number): string;
  getDayParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[];
  getDayRangeParts(
    start: AnyDateInput | number,
    end: AnyDateInput | number,
  ): Intl.DateTimeFormatPart[];
}
