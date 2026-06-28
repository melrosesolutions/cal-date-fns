# cal-date-fns

> **⚠️ Status: API design phase.** The interface described below is finalised, but implementation hasn't started yet. Nothing in this package is installable/usable as real code just yet — see [docs/API.md](./docs/API.md) for per-function status. Star/watch the repo to follow progress.

A TypeScript utility library for working with calendar dates — no time zones, no timestamps, no surprises.

Inspired by [date-fns](https://date-fns.org), but purpose-built for **ISO 8601 calendar strings**: `YYYY-MM-DD` and `YYYY-MM`. If your app works with dates as strings (booking systems, scheduling, reporting, data pipelines), this library is for you.

## Why cal-date-fns?

JavaScript's `Date` object is a point in time, not a calendar date. This causes well-known pain: time zone shifts, DST bugs, and off-by-one errors when all you wanted was "the last day of March". `cal-date-fns` sidesteps all of that by working directly with ISO date strings.

```ts
import { add, endOfMonth, isWeekend } from 'cal-date-fns';

add('2025-01-31', { months: 1 }); // => "2025-02-28"
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
import { add, since, startOfMonth, endOfMonth, format, isAfter, eachMonth } from 'cal-date-fns';

// Arithmetic — a single duration object instead of separate addDays/addMonths/etc
add('2025-03-28', { days: 5 }); // => "2025-04-02"
add('2025-01-31', { months: 1 }); // => "2025-02-28"
add('2025-01', { months: 3 }); // => "2025-04"

// Boundaries
startOfMonth('2025-03-15'); // => "2025-03-01"
startOfMonth('2025-03'); // => "2025-03-01"
endOfMonth('2025-02'); // => "2025-02-28"

// Differences — returns a Duration object, mirroring the Temporal API
since('2025-04-01', '2025-03-01');
// => { days: 31 }

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
add({ y: 2025, m: 3, d: 28 }, { days: 5 }); // => "2025-04-02"
endOfMonth({ y: 2025, m: 2 }); // => "2025-02-28"
```

## Full API

See [docs/API.md](./docs/API.md) for the complete function reference.

## Contributing

Contributions are welcome! Please open an issue before submitting a PR for anything beyond a bug fix.

## License

MIT
