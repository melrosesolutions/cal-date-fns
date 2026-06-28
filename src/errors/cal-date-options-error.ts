/**
 * Thrown when an options object contains an invalid combination — e.g.
 * `smallestUnit` larger than `largestUnit` in `since`/`until`, or a `days`/`weeks`
 * duration passed to a `YearMonth` in `add`/`subtract`.
 */
export class CalDateOptionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalDateOptionsError';
  }
}
