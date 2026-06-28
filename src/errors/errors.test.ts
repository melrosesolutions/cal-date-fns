import { describe, it, expect } from 'vitest';
import { CalDateFormatError } from './cal-date-format-error';
import { CalDateParseError } from './cal-date-parse-error';
import { CalDateRangeError } from './cal-date-range-error';
import { CalDateOptionsError } from './cal-date-options-error';

describe('error classes', () => {
  it('CalDateFormatError is an instance of Error with the correct name and message', () => {
    const err = new CalDateFormatError('bad format string');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CalDateFormatError);
    expect(err.name).toBe('CalDateFormatError');
    expect(err.message).toBe('bad format string');
  });

  it('CalDateParseError is an instance of Error with the correct name and message', () => {
    const err = new CalDateParseError('could not parse input');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CalDateParseError);
    expect(err.name).toBe('CalDateParseError');
    expect(err.message).toBe('could not parse input');
  });

  it('CalDateRangeError is an instance of Error with the correct name and message', () => {
    const err = new CalDateRangeError('February 30th does not exist');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CalDateRangeError);
    expect(err.name).toBe('CalDateRangeError');
    expect(err.message).toBe('February 30th does not exist');
  });

  it('CalDateOptionsError is an instance of Error with the correct name and message', () => {
    const err = new CalDateOptionsError('smallestUnit cannot exceed largestUnit');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CalDateOptionsError);
    expect(err.name).toBe('CalDateOptionsError');
    expect(err.message).toBe('smallestUnit cannot exceed largestUnit');
  });

  it('error classes are distinguishable from one another', () => {
    const err = new CalDateFormatError('x');
    expect(err).not.toBeInstanceOf(CalDateParseError);
    expect(err).not.toBeInstanceOf(CalDateRangeError);
    expect(err).not.toBeInstanceOf(CalDateOptionsError);
  });
});
