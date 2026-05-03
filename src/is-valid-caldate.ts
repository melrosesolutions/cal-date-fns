import { CalDate } from './types';
import { getDaysInMonth } from './get-days-in-month';

export function isValidCalDate(str: string): str is CalDate {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (regex.exec(str) === null) {
    return false;
  }

  const year = parseInt(str.slice(0, 4), 10);
  const month = parseInt(str.slice(5, 7), 10);
  const day = parseInt(str.slice(8, 10), 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const maxDays = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDays;
}
