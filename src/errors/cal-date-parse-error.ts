/**
 * Thrown when an input string does not match the format pattern passed to
 * `parse()`, or its numeric components cannot be extracted.
 */
export class CalDateParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalDateParseError';
  }
}
