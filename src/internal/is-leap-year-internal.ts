/**
 * INTERNAL — not exported from src/index.ts.
 *
 * Returns whether `year` is a leap year, per the Gregorian calendar rule:
 * divisible by 4, except centuries, except every 4th century.
 *
 * Takes a raw year number with no input coercion. The public `isLeapYear`
 * (in src/predicates/) accepts `AnyDateInput` and delegates here.
 */
export function isLeapYearInternal(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
