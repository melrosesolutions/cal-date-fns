import { isLeapYear } from './is-leap-year';

export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth: Record<number, number> = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  if (daysInMonth[month]) {
    return daysInMonth[month];
  }
  throw new Error(`Invalid month number: ${month.toString()}`);
}
