/**
 * Thrown when date/month component values are structurally well-formed but
 * describe an impossible calendar date — e.g. month 13, or February 30th.
 */
export class CalDateRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalDateRangeError';
  }
}
