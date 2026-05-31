# cal-date-fns

A TypeScript utility library for working with calendar dates — no time zones, no timestamps, no surprises.

Inspired by [date-fns](https://date-fns.org), but purpose-built for **ISO 8601 calendar strings**: `YYYY-MM-DD` and `YYYY-MM`. If your app works with dates as strings (booking systems, scheduling, reporting, data pipelines), this library is for you.

## Why cal-date-fns?

JavaScript's `Date` object is a point in time, not a calendar date. This causes well-known pain: time zone shifts, DST bugs, and off-by-one errors when all you wanted was "the last day of March". `cal-date-fns` sidesteps all of that by working directly with ISO date strings.

```ts
import { addMonths, endOfMonth, isWeekend } from 'cal-date-fns';

addMonths('2025-01-31', 1); // => "2025-02-28"
endOfMonth('2025-02'); // => "2025-02-28"
isWeekend('2025-03-15'); // => true
```

## Installation

```bash
npm install cal-date-fns
```

## Core Concepts

### Input Types

Most functions accept either a string or an object:

```ts
// String forms
type CalDate = string; // "YYYY-MM-DD"
type YearMonth = string; // "YYYY-MM"

// Object forms
type CalDateObj = { y: number; m: number; d: number };
type YearMonthObj = { y: number; m: number };
```

Functions that need a day component accept `CalDateInput = CalDate | CalDateObj`.
Functions that work with either dates or months accept `AnyDateInput = CalDate | CalDateObj | YearMonth | YearMonthObj`.

### Output Types

Functions always return string types (`CalDate` or `YearMonth`). This makes results easy to store, serialize, and compare.

### Month Numbering

Months are **1-based** (January = 1), consistent with ISO 8601.

## Quick Examples

```ts
import {
  addDays,
  addMonths,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  format,
  isAfter,
  eachMonth,
} from 'cal-date-fns';

// Arithmetic
addDays('2025-03-28', 5); // => "2025-04-02"
addMonths('2025-01-31', 1); // => "2025-02-28"
addMonths('2025-01', 3); // => "2025-04"

// Boundaries
startOfMonth('2025-03-15'); // => "2025-03-01"
startOfMonth('2025-03'); // => "2025-03-01"
endOfMonth('2025-02'); // => "2025-02-28"

// Differences
differenceInDays('2025-04-01', '2025-03-01'); // => 31

// Ranges
eachMonth('2025-01', '2025-03');
// => ["2025-01", "2025-02", "2025-03"]

// Comparison
isAfter('2025-06-01', '2025-03-15'); // => true

// Formatting
format('2025-03-15', 'DD MMM YYYY'); // => "15 Mar 2025"
```

## Object Input

All functions also accept object forms:

```ts
addDays({ y: 2025, m: 3, d: 28 }, 5); // => "2025-04-02"
endOfMonth({ y: 2025, m: 2 }); // => "2025-02-28"
```

## Full API

See [docs/API.md](./docs/API.md) for the complete function reference.

## Contributing

Contributions are welcome! Please open an issue before submitting a PR for anything beyond a bug fix.

## License

MIT
