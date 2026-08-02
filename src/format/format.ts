import type { AnyDateInput } from '../types/any-date-input.type';
import type { CalDateObj } from '../types/cal-date.type';
import { toObject } from '../parse/to-object';
import { CalDateFormatError } from '../errors/cal-date-format-error';

const VALID_TOKEN_REGEX = /Y+|M+|D+/g;
const TOKEN_REPLACER = /(YYYY|YY|MM|M|DD|D)/g;
const SUPPORTED_TOKENS = new Set(['YYYY', 'YY', 'MM', 'M', 'DD', 'D']);

interface FormatTokens {
  YYYY: string;
  YY: string;
  MM: string;
  M: string;
  DD: string;
  D: string;
}

function buildTokenValues(input: CalDateObj): FormatTokens {
  const yyyy = String(input.y).padStart(4, '0');
  const mm = String(input.m).padStart(2, '0');
  const dd = String(input.d).padStart(2, '0');

  return {
    YYYY: yyyy,
    YY: yyyy.slice(-2),
    MM: mm,
    M: String(input.m),
    DD: dd,
    D: String(input.d),
  };
}

function validateFormatString(formatStr: string): void {
  if (typeof formatStr !== 'string' || formatStr.length === 0) {
    throw new CalDateFormatError('format: format string must be a non-empty string');
  }

  const matches = formatStr.match(VALID_TOKEN_REGEX);

  if (!matches || matches.length === 0) {
    throw new CalDateFormatError('format: format string must contain at least one supported token');
  }

  for (const match of matches) {
    if (!SUPPORTED_TOKENS.has(match)) {
      throw new CalDateFormatError(`format: unsupported token: ${match}`);
    }
  }
}

export function format(input: AnyDateInput, formatStr: string): string {
  validateFormatString(formatStr);

  const normalized = toObject(input);
  const dateInput = 'd' in normalized ? normalized : { ...normalized, d: 1 };
  const tokens = buildTokenValues(dateInput);

  return formatStr.replace(TOKEN_REPLACER, (token) => tokens[token as keyof FormatTokens]);
}
