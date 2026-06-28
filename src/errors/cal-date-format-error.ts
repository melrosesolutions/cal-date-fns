/**
 * Thrown when a format string passed to `parse()` is structurally invalid —
 * missing required tokens, unrecognised tokens, or otherwise malformed.
 */
export class CalDateFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalDateFormatError';
  }
}
