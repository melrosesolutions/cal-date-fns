import type { CalDate } from '../types/cal-date.type';
import type { YearMonth } from '../types/year-month.type';
import { toCalDate } from './to-cal-date';
import { toYearMonth } from './to-year-month';
import { CalDateFormatError } from '../errors/cal-date-format-error';
import { CalDateParseError } from '../errors/cal-date-parse-error';
import { CalDateRangeError } from '../errors/cal-date-range-error';

const TOKEN_PATTERNS = {
  YYYY: '\\d{4}',
  YY: '\\d{2}',
  MM: '\\d{2}',
  M: '\\d{1,2}',
  DD: '\\d{2}',
  D: '\\d{1,2}',
} as const;

type ParseToken = keyof typeof TOKEN_PATTERNS;

interface ParseOptions {
  pivotYear?: number;
}

type ParseReturnType<Format extends string> = Format extends `${string}D${string}`
  ? CalDate
  : YearMonth;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFormatRegex(format: string) {
  if (typeof format !== 'string' || format.length === 0) {
    throw new CalDateFormatError('parse: format string must be a non-empty string');
  }

  let regex = '^';
  const tokens: ParseToken[] = [];
  let containsYear = false;
  let containsMonth = false;
  let containsDay = false;

  let index = 0;
  while (index < format.length) {
    const char = format.charAt(index);

    if (char === 'Y' || char === 'M' || char === 'D') {
      const start = index;
      while (index < format.length && format.charAt(index) === char) {
        index += 1;
      }

      const runLength = index - start;
      let token: ParseToken;

      if (char === 'Y') {
        if (runLength === 2) token = 'YY';
        else if (runLength === 4) token = 'YYYY';
        else {
          throw new CalDateFormatError(
            `parse: unsupported token sequence '${format.slice(start, index)}'`,
          );
        }
        containsYear = true;
      } else if (char === 'M') {
        if (runLength === 1) token = 'M';
        else if (runLength === 2) token = 'MM';
        else {
          throw new CalDateFormatError(
            `parse: unsupported token sequence '${format.slice(start, index)}'`,
          );
        }
        containsMonth = true;
      } else {
        if (runLength === 1) token = 'D';
        else if (runLength === 2) token = 'DD';
        else {
          throw new CalDateFormatError(
            `parse: unsupported token sequence '${format.slice(start, index)}'`,
          );
        }
        containsDay = true;
      }

      tokens.push(token);
      regex += `(${TOKEN_PATTERNS[token]})`;
      continue;
    }

    regex += escapeRegExp(char);
    index += 1;
  }

  if (!containsYear || !containsMonth) {
    throw new CalDateFormatError('parse: format string must include year and month tokens');
  }

  regex += '$';
  return { regex: new RegExp(regex), tokens, containsDay };
}

function resolveTwoDigitYear(value: string, pivotYear?: number): number {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 0 || year > 99) {
    throw new CalDateFormatError('parse: invalid two-digit year');
  }

  const pivot = pivotYear ?? 50;
  if (!Number.isInteger(pivot) || pivot < 0 || pivot > 99) {
    throw new CalDateFormatError('parse: pivotYear must be an integer between 0 and 99');
  }

  return year <= pivot ? 2000 + year : 1900 + year;
}

export function parse<Format extends string>(
  value: string,
  format: Format,
  options?: ParseOptions,
): ParseReturnType<Format>;

export function parse(value: string, format: string, options?: ParseOptions): CalDate;

export function parse(value: string, format: string, options?: ParseOptions): CalDate {
  if (typeof value !== 'string' || value.length === 0) {
    throw new CalDateParseError('parse: value must be a non-empty string');
  }

  const { regex, tokens, containsDay } = buildFormatRegex(format);
  const match = regex.exec(value);

  if (!match) {
    throw new CalDateParseError(`parse: value does not match format ${format}`);
  }

  const tokenValues: Partial<Record<ParseToken, string>> = {};
  let groupIndex = 1;

  for (const token of tokens) {
    const value = match[groupIndex++];
    if (typeof value !== 'string') {
      throw new CalDateParseError('parse: unexpected parsing error');
    }
    tokenValues[token] = value;
  }

  const year = tokenValues.YYYY
    ? Number(tokenValues.YYYY)
    : tokenValues.YY
      ? resolveTwoDigitYear(tokenValues.YY, options?.pivotYear)
      : NaN;
  const month = tokenValues.MM
    ? Number(tokenValues.MM)
    : tokenValues.M
      ? Number(tokenValues.M)
      : NaN;
  const day = tokenValues.DD ? Number(tokenValues.DD) : tokenValues.D ? Number(tokenValues.D) : NaN;

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new CalDateParseError('parse: extracted year or month is invalid');
  }

  try {
    if (containsDay) {
      if (!Number.isInteger(day)) {
        throw new CalDateParseError('parse: extracted day is invalid');
      }
      return toCalDate({ y: year, m: month, d: day });
    }

    return toYearMonth({ y: year, m: month });
  } catch (error) {
    if (error instanceof CalDateRangeError) {
      throw new CalDateParseError(`parse: extracted date values are invalid: ${error.message}`);
    }

    throw error;
  }
}
