# cal-date-fns API Reference

**Status legend:** 🟢 Implemented &nbsp;·&nbsp; 🟡 Designed (spec finalised, not yet coded) &nbsp;·&nbsp; ⚪ Draft (still being discussed)

> Everything below is 🟡 **Designed** unless marked otherwise. This reflects the spec, not what you can currently `npm install` and use.

## Table of Contents

- [Types](#types)
- [Error Classes](#error-classes)
- [Parsing & Validation](#parsing--validation) 🟡
- [Formatting](#formatting) 🟡
- [Arithmetic](#arithmetic) 🟡
- [Differences](#differences) 🟡
- [Comparison](#comparison) 🟡
- [Day-of-week](#day-of-week) 🟡
- [Getters](#getters) 🟡
- [Setters](#setters) 🟡
- [Start & End Boundaries](#start--end-boundaries) 🟡
- [Current Date Helpers](#current-date-helpers) 🟡
- [Is Same Comparisons](#is-same-comparisons) 🟡
- [Range Utilities](#range-utilities) 🟡
- [Human-readable Distance](#human-readable-distance) 🟡
- [Predicates](#predicates) 🟡
- [Epoch Helpers](#epoch-helpers) 🟢
- [Conversion Helpers](#conversion-helpers) 🟡
- [Intl API Helpers](#intl-api-helpers) 🟡
- [Month Formatter](#createmonthformatterlocale-string-style-long--short--narrow-calmontformatter) 🟡
- [Day Formatter](#createdayformatterlocale-string-style-long--short--narrow-caldayformatter) 🟡

---

## Types

```ts
// String types
type CalDate = string; // "YYYY-MM-DD"
type YearMonth = string; // "YYYY-MM"

// Object types
type CalDateObj = { y: number; m: number; d: number };
type YearMonthObj = { y: number; m: number };

// Input union types
type CalDateInput = CalDate | CalDateObj;
type AnyDateInput = CalDate | CalDateObj | YearMonth | YearMonthObj;

// Duration — used by add(), subtract(), since(), until()
interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
}

type DurationUnit = 'years' | 'months' | 'weeks' | 'days';

interface DurationOptions {
  largestUnit?: DurationUnit; // default: "days"
  smallestUnit?: DurationUnit; // default: same as largestUnit, or "days"
}
```

**Month numbering is 1-based** throughout (January = 1), consistent with ISO 8601.

Functions that require a day component accept `CalDateInput`.
Functions that work with either dates or months accept `AnyDateInput`.
All functions return string types (`CalDate` or `YearMonth`), except where noted.

### Error Classes

```ts
// Thrown when a format string passed to parse() is structurally invalid —
// missing required tokens, unrecognised tokens, or ambiguous structure.
class CalDateFormatError extends Error {}

// Thrown when the input string does not match the format pattern,
// or cannot be extracted into valid numeric components.
class CalDateParseError extends Error {}

// Thrown when the extracted values form a structurally valid but impossible
// date — e.g. month 13, or February 30th.
class CalDateRangeError extends Error {}

// Thrown when an options object contains an invalid combination —
// e.g. smallestUnit larger than largestUnit, or a days duration passed to a YearMonth.
class CalDateOptionsError extends Error {}
```

---

## Parsing & Validation 🟡

### `parse(value: string, format: string, options?: ParseOptions): CalDate | YearMonth`

Parses a formatted date string into a `CalDate` or `YearMonth` using a token-based format string. Inspired by `date-fns/parse`.

The return type is inferred from the format string at compile time — if the format contains a day token (`D` or `DD`), the return type is `CalDate`; otherwise it is `YearMonth`.

```ts
parse('15/03/2025', 'DD/MM/YYYY'); // => "2025-03-15"  (typed as CalDate)
parse('03/2025', 'MM/YYYY'); // => "2025-03"      (typed as YearMonth)
parse('3.15.25', 'M.DD.YY'); // => "2025-03-15"
parse('2025-03', 'YYYY-MM'); // => "2025-03"
```

**`ParseOptions`**

```ts
interface ParseOptions {
  pivotYear?: number; // default: 50
}
```

`pivotYear` controls how two-digit years (`YY`) are resolved. Years from `00` up to and including the pivot map to 2000+; years above the pivot map to 1900+. With the default pivot of `50`: `"25"` → `2025`, `"75"` → `1975`.

**Supported format tokens:**

| Token  | Matches                       | Example input |
| ------ | ----------------------------- | ------------- |
| `YYYY` | 4-digit year                  | `2025`        |
| `YY`   | 2-digit year (pivot-resolved) | `25`          |
| `MM`   | 2-digit month, zero-padded    | `03`          |
| `M`    | Month, 1 or 2 digits          | `3` or `03`   |
| `DD`   | 2-digit day, zero-padded      | `05`          |
| `D`    | Day, 1 or 2 digits            | `5` or `05`   |

**Throws:**

- `CalDateFormatError` — if the format string is missing required tokens (must include at least `M`/`MM` and one of `Y`/`YY`/`YYYY`), contains unrecognised tokens, or is otherwise structurally invalid
- `CalDateParseError` — if the input string does not match the format pattern or numeric components cannot be extracted
- `CalDateRangeError` — if the extracted values are structurally valid but form an impossible date (e.g. month 13, February 30th)

> **Implementation note:** The intelligent return type (`CalDate` vs `YearMonth` based on whether the format string contains a day token) is achievable using TypeScript template literal types and function overloads. The type-level check mirrors the runtime behaviour — if no `D`/`DD` token is present, no day is extracted and a `YearMonth` string is returned.

---

### `toObject(input: AnyDateInput): CalDateObj | YearMonthObj`

Normalises any input to its object form. Returns a `CalDateObj` if the input includes a day, otherwise a `YearMonthObj`.

```ts
toObject('2025-03-15'); // => { y: 2025, m: 3, d: 15 }
toObject('2025-03'); // => { y: 2025, m: 3 }
toObject({ y: 2025, m: 3, d: 15 }); // => { y: 2025, m: 3, d: 15 }
```

### `isValid(input: unknown): boolean`

Returns `true` if the input is a valid `CalDate`, `YearMonth`, `CalDateObj`, or `YearMonthObj`.

```ts
isValid('2025-03-15'); // => true
isValid('2025-13-01'); // => false (month 13)
isValid('2025-02-29'); // => false (2025 is not a leap year)
isValid('2025-03'); // => true
```

### `isCalDate(input: unknown): input is CalDate`

Type guard. Returns `true` if the input is a valid `YYYY-MM-DD` string.

### `isYearMonth(input: unknown): input is YearMonth`

Type guard. Returns `true` if the input is a valid `YYYY-MM` string.

### `toCalDate(input: AnyDateInput): CalDate`

Converts any input to a `YYYY-MM-DD` string. When given a `YearMonth` or `YearMonthObj`, defaults to the 1st of the month.

```ts
toCalDate('2025-03'); // => "2025-03-01"
toCalDate({ y: 2025, m: 3 }); // => "2025-03-01"
toCalDate({ y: 2025, m: 3, d: 15 }); // => "2025-03-15"
```

### `toYearMonth(input: AnyDateInput): YearMonth`

Converts any input to a `YYYY-MM` string, dropping the day component if present.

```ts
toYearMonth('2025-03-15'); // => "2025-03"
toYearMonth({ y: 2025, m: 3, d: 15 }); // => "2025-03"
```

---

## Formatting 🟡

### `format(input: AnyDateInput, formatStr: string): string`

Formats a date or month using a token-based format string.

```ts
format('2025-03-15', 'DD MMM YYYY'); // => "15 Mar 2025"
format('2025-03-15', 'YYYY/MM/DD'); // => "2025/03/15"
format('2025-03', 'MMM YYYY'); // => "Mar 2025"
```

**Supported tokens:**

| Token  | Output             | Example    |
| ------ | ------------------ | ---------- |
| `YYYY` | Full year          | `2025`     |
| `YY`   | 2-digit year       | `25`       |
| `MM`   | 2-digit month      | `03`       |
| `M`    | Month (no padding) | `3`        |
| `MMM`  | Short month name   | `Mar`      |
| `MMMM` | Full month name    | `March`    |
| `DD`   | 2-digit day        | `05`       |
| `D`    | Day (no padding)   | `5`        |
| `DDD`  | Short day name     | `Sat`      |
| `DDDD` | Full day name      | `Saturday` |

---

## Arithmetic 🟡

### `add(input: CalDateInput, duration: Duration): CalDate`

### `add(input: YearMonth | YearMonthObj, duration: Duration): YearMonth`

Adds a duration to a date or month. Returns the same string type as the input.

All `Duration` fields are optional — include only the units you need. Month and year arithmetic clamps to the last day of the month when the original day does not exist in the target month.

```ts
add('2025-01-15', { days: 10 }); // => "2025-01-25"
add('2025-01-15', { months: 2, days: 5 }); // => "2025-03-20"
add('2025-01-31', { months: 1 }); // => "2025-02-28"  (clamped)
add('2024-02-29', { years: 1 }); // => "2025-02-28"  (clamped)
add('2025-01', { months: 3 }); // => "2025-04"
add('2025-01', { years: 1, months: 2 }); // => "2026-03"
```

**Throws `CalDateOptionsError`** if a `days` or `weeks` duration is passed with a `YearMonth` input.

---

### `subtract(input: CalDateInput, duration: Duration): CalDate`

### `subtract(input: YearMonth | YearMonthObj, duration: Duration): YearMonth`

Subtracts a duration from a date or month. Follows the same rules as `add`.

```ts
subtract('2025-03-20', { months: 2, days: 5 }); // => "2025-01-13"
subtract('2025-03-31', { months: 1 }); // => "2025-02-28"  (clamped)
subtract('2025-04', { months: 2 }); // => "2025-02"
```

**Throws `CalDateOptionsError`** if a `days` or `weeks` duration is passed with a `YearMonth` input.

---

## Differences 🟡

### `since(dateLeft: AnyDateInput, dateRight: AnyDateInput, options?: DurationOptions): Duration`

Returns how far `dateRight` is before `dateLeft` as a `Duration`. Positive values mean `dateRight` is earlier. Mirrors `Temporal.PlainDate.prototype.since`.

Units are populated from `largestUnit` down to `smallestUnit`. Units smaller than `smallestUnit` are discarded. Default `largestUnit` is `"days"`.

```ts
since('2025-04-01', '2025-03-01');
// => { days: 31 }

since('2025-04-01', '2025-01-15', { largestUnit: 'months' });
// => { months: 2, days: 17 }

since('2026-06-01', '2024-01-15', { largestUnit: 'years', smallestUnit: 'months' });
// => { years: 2, months: 4 }  (days discarded)
```

**Throws `CalDateOptionsError`** if `smallestUnit` is larger than `largestUnit`.

---

### `until(dateLeft: AnyDateInput, dateRight: AnyDateInput, options?: DurationOptions): Duration`

Returns how far `dateRight` is after `dateLeft` as a `Duration`. Positive values mean `dateRight` is later. Mirrors `Temporal.PlainDate.prototype.until`.

```ts
until('2025-01-15', '2025-04-01');
// => { days: 75 }

until('2025-01-15', '2026-06-01', { largestUnit: 'years', smallestUnit: 'months' });
// => { years: 1, months: 4 }  (days discarded)
```

**Throws `CalDateOptionsError`** if `smallestUnit` is larger than `largestUnit`.

---

## Comparison 🟡

### `compareAsc(dateLeft: AnyDateInput, dateRight: AnyDateInput): -1 | 0 | 1`

Returns `-1` if dateLeft is before dateRight, `1` if after, `0` if equal. Useful for sorting.

```ts
['2025-03', '2025-01', '2025-02'].sort(compareAsc);
// => ["2025-01", "2025-02", "2025-03"]
```

### `compareDesc(dateLeft: AnyDateInput, dateRight: AnyDateInput): -1 | 0 | 1`

### `isAfter(date: AnyDateInput, dateToCompare: AnyDateInput): boolean`

```ts
isAfter('2025-06-01', '2025-03-15'); // => true
```

### `isBefore(date: AnyDateInput, dateToCompare: AnyDateInput): boolean`

### `isEqual(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`

```ts
isEqual('2025-03-15', { y: 2025, m: 3, d: 15 }); // => true
```

### `isFuture(date: AnyDateInput): boolean`

Compared to today's date.

### `isPast(date: AnyDateInput): boolean`

Compared to today's date.

### `isToday(date: CalDateInput): boolean`

### `isTomorrow(date: CalDateInput): boolean`

### `isYesterday(date: CalDateInput): boolean`

### `min(dates: AnyDateInput[]): CalDate | YearMonth`

Returns the earliest date in the array, in the same string type as the inputs.

### `max(dates: AnyDateInput[]): CalDate | YearMonth`

Returns the latest date in the array.

### `closestTo(date: AnyDateInput, dates: AnyDateInput[]): CalDate | YearMonth`

Returns the date from `dates` that is closest to `date`.

### `closestIndexTo(date: AnyDateInput, dates: AnyDateInput[]): number`

Returns the index of the closest date.

---

## Day-of-week 🟡

_Accepts `CalDateInput` only._

### `isMonday(date: CalDateInput): boolean`

### `isTuesday(date: CalDateInput): boolean`

### `isWednesday(date: CalDateInput): boolean`

### `isThursday(date: CalDateInput): boolean`

### `isFriday(date: CalDateInput): boolean`

### `isSaturday(date: CalDateInput): boolean`

### `isSunday(date: CalDateInput): boolean`

### `isWeekend(date: CalDateInput): boolean`

Returns `true` if the date falls on Saturday or Sunday.

---

## Getters 🟡

### `getDay(date: CalDateInput): number`

Day of the week. 0 = Sunday, 6 = Saturday.

### `getDate(date: CalDateInput): number`

Day of the month (1–31).

### `getDayOfYear(date: CalDateInput): number`

Day of the year (1–366).

### `getDaysInMonth(input: AnyDateInput): number`

```ts
getDaysInMonth('2025-02'); // => 28
getDaysInMonth('2024-02'); // => 29
```

### `getDaysInYear(input: AnyDateInput): number`

Returns 365 or 366.

### `getMonth(input: AnyDateInput): number`

1-based month number.

```ts
getMonth('2025-03-15'); // => 3
```

### `getYear(input: AnyDateInput): number`

```ts
getYear('2025-03-15'); // => 2025
```

### `getQuarter(input: AnyDateInput): number`

Returns 1–4.

### `getISODay(date: CalDateInput): number`

ISO day of the week. 1 = Monday, 7 = Sunday.

### `getISOWeek(date: CalDateInput): number`

ISO week number (1–53).

### `getISOWeeksInYear(input: AnyDateInput): number`

Returns 52 or 53.

### `getISOYear(date: CalDateInput): number`

The ISO week-numbering year. May differ from the calendar year near year boundaries.

---

## Setters 🟡

_All functions return a string of the same type as the input, unless noted._

### `setDate(date: CalDateInput, day: number): CalDate`

Sets the day of the month.

```ts
setDate('2025-03-15', 1); // => "2025-03-01"
```

### `setDay(date: CalDateInput, day: number): CalDate`

Sets the day of the week (0 = Sunday). Adjusts to the nearest occurrence within the same week.

### `setDayOfYear(date: CalDateInput, day: number): CalDate`

```ts
setDayOfYear('2025-03-15', 1); // => "2025-01-01"
```

### `setMonth(input: CalDateInput, month: number): CalDate`

### `setMonth(input: YearMonth | YearMonthObj, month: number): YearMonth`

```ts
setMonth('2025-03-15', 6); // => "2025-06-15"
setMonth('2025-03', 6); // => "2025-06"
```

### `setYear(input: CalDateInput, year: number): CalDate`

### `setYear(input: YearMonth | YearMonthObj, year: number): YearMonth`

### `setQuarter(input: CalDateInput, quarter: number): CalDate`

### `setQuarter(input: YearMonth | YearMonthObj, quarter: number): YearMonth`

### `setISODay(date: CalDateInput, day: number): CalDate`

Sets the ISO day of the week (1 = Monday, 7 = Sunday).

### `setISOWeek(date: CalDateInput, week: number): CalDate`

Sets the ISO week number, keeping the ISO day of the week.

### `setISOYear(date: CalDateInput, year: number): CalDate`

Sets the ISO week-numbering year.

---

## Start & End Boundaries 🟡

### `startOfWeek(date: CalDateInput): CalDate`

Returns the Sunday of the week containing `date`.

### `endOfWeek(date: CalDateInput): CalDate`

Returns the Saturday of the week containing `date`.

### `startOfMonth(input: AnyDateInput): CalDate`

Returns the first day of the month. Accepts both `CalDate` and `YearMonth`.

```ts
startOfMonth('2025-03-15'); // => "2025-03-01"
startOfMonth('2025-03'); // => "2025-03-01"
```

### `endOfMonth(input: AnyDateInput): CalDate`

Returns the last day of the month.

```ts
endOfMonth('2025-02'); // => "2025-02-28"
endOfMonth('2024-02'); // => "2024-02-29"
```

### `startOfQuarter(input: AnyDateInput): CalDate`

```ts
startOfQuarter('2025-05-15'); // => "2025-04-01"
```

### `endOfQuarter(input: AnyDateInput): CalDate`

```ts
endOfQuarter('2025-05-15'); // => "2025-06-30"
```

### `startOfYear(input: AnyDateInput): CalDate`

```ts
startOfYear('2025-06'); // => "2025-01-01"
```

### `endOfYear(input: AnyDateInput): CalDate`

```ts
endOfYear('2025-06'); // => "2025-12-31"
```

### `startOfISOWeek(date: CalDateInput): CalDate`

Returns the Monday of the ISO week containing `date`.

### `endOfISOWeek(date: CalDateInput): CalDate`

Returns the Sunday of the ISO week containing `date`.

### `startOfISOYear(date: CalDateInput): CalDate`

Returns the first day of the ISO week-numbering year.

### `endOfISOYear(date: CalDateInput): CalDate`

Returns the last day of the ISO week-numbering year.

---

## Current Date Helpers 🟡

### `today(): CalDate`

Returns today's date as a `YYYY-MM-DD` string.

### `tomorrow(): CalDate`

Returns tomorrow's date.

### `yesterday(): CalDate`

Returns yesterday's date.

### `thisMonth(): YearMonth`

Returns the current month as a `YYYY-MM` string.

### `nextMonth(): YearMonth`

Returns next month as a `YYYY-MM` string.

### `lastMonth(): YearMonth`

Returns last month as a `YYYY-MM` string.

---

## Is Same Comparisons 🟡

### `isSameDay(dateLeft: CalDateInput, dateRight: CalDateInput): boolean`

### `isSameMonth(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`

```ts
isSameMonth('2025-03-01', '2025-03-31'); // => true
isSameMonth('2025-03-01', '2025-03'); // => true
```

### `isSameYear(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`

### `isSameQuarter(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`

### `isSameWeek(dateLeft: CalDateInput, dateRight: CalDateInput): boolean`

### `isSameISOWeek(dateLeft: CalDateInput, dateRight: CalDateInput): boolean`

### `isSameISOYear(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`

### `isThisMonth(date: AnyDateInput): boolean`

### `isThisYear(date: AnyDateInput): boolean`

### `isThisWeek(date: CalDateInput): boolean`

### `isThisQuarter(date: AnyDateInput): boolean`

### `isThisISOWeek(date: CalDateInput): boolean`

### `isThisISOYear(date: AnyDateInput): boolean`

---

## Range Utilities 🟡

### `isWithinRange(date: AnyDateInput, start: AnyDateInput, end: AnyDateInput): boolean`

```ts
isWithinRange('2025-03-15', '2025-03-01', '2025-03-31'); // => true
```

### `areRangesOverlapping(start1: AnyDateInput, end1: AnyDateInput, start2: AnyDateInput, end2: AnyDateInput): boolean`

### `getOverlappingDaysInRanges(start1: CalDateInput, end1: CalDateInput, start2: CalDateInput, end2: CalDateInput): number`

### `eachDay(start: CalDateInput, end: CalDateInput): CalDate[]`

Returns an array of every day between `start` and `end`, inclusive.

```ts
eachDay('2025-03-01', '2025-03-03');
// => ["2025-03-01", "2025-03-02", "2025-03-03"]
```

### `eachMonth(start: AnyDateInput, end: AnyDateInput): YearMonth[]`

Returns an array of every month between `start` and `end`, inclusive.

```ts
eachMonth('2025-01', '2025-04');
// => ["2025-01", "2025-02", "2025-03", "2025-04"]
```

---

## Human-readable Distance 🟡

### `formatDistance(dateLeft: AnyDateInput, dateRight: AnyDateInput): string`

Returns a human-readable description of the distance between two dates.

```ts
formatDistance('2025-06-01', '2025-03-01'); // => "3 months"
formatDistance('2025-03-20', '2025-03-15'); // => "5 days"
```

### `formatDistanceStrict(dateLeft: AnyDateInput, dateRight: AnyDateInput): string`

Same as `formatDistance` but without rounding. Always uses the largest exact unit.

### `formatDistanceToNow(date: AnyDateInput): string`

Distance between `date` and today.

```ts
// Assuming today is 2025-05-06
formatDistanceToNow('2025-03-01'); // => "2 months ago"
formatDistanceToNow('2025-07-01'); // => "in 2 months"
```

---

## Predicates 🟡

### `isFirstDayOfMonth(date: CalDateInput): boolean`

```ts
isFirstDayOfMonth('2025-03-01'); // => true
```

### `isLastDayOfMonth(date: CalDateInput): boolean`

```ts
isLastDayOfMonth('2025-02-28'); // => true
```

### `isLeapYear(input: AnyDateInput): boolean`

```ts
isLeapYear('2024-01-01'); // => true
isLeapYear('2025-03'); // => false
```

---

## Epoch Helpers 🟢

Low-level primitives for converting between a `CalDateObj` and a single integer day count. These are the building blocks the rest of the library uses internally for arithmetic, comparison, and differences — exposed publicly because they're also genuinely useful for consumers doing custom calendar math (e.g. building a calendar grid UI, calculating business days, implementing your own date algorithms on top of this library).

### `toEpochDay(input: CalDateInput): number`

Converts a calendar date to an integer count of days since a fixed epoch (currently 1970-01-01, i.e. `toEpochDay("1970-01-01") === 0`; the exact epoch is an implementation detail and not part of the public contract — only that it is internally consistent and monotonic is guaranteed).

```ts
toEpochDay('1970-01-01'); // => 0
toEpochDay('2025-03-15'); // => 20162
```

### `fromEpochDay(epochDay: number): CalDate`

Converts an integer day count back to a `CalDate` string. Round-trips cleanly with `toEpochDay`.

```ts
fromEpochDay(toEpochDay('2025-03-15')); // => "2025-03-15"
```

**Why expose this?**

Most calendar arithmetic — adding days, comparing dates, computing differences — reduces cleanly to integer arithmetic once a date is expressed as a single day count. Consumers building custom logic beyond what this library provides (e.g. "every 3rd weekday", custom recurrence rules, business-day calculators) can use `toEpochDay`/`fromEpochDay` as a foundation rather than reimplementing calendar math from scratch.

---

Functions for converting between `CalDate`/`YearMonth` and native JavaScript types. All conversions involving `Date` objects or timestamps use **UTC** exclusively to avoid timezone-related date shifts — see implementation notes below.

---

### From native types to `CalDate`

#### `fromDate(date: Date): CalDate`

Extracts the **local** calendar date from a `Date` object.

```ts
// Assuming local timezone is UTC+1
fromDate(new Date('2025-03-15T00:30:00+01:00')); // => "2025-03-15"
```

#### `fromDateUTC(date: Date): CalDate`

Extracts the **UTC** calendar date from a `Date` object.

```ts
fromDateUTC(new Date('2025-03-15T00:30:00+01:00')); // => "2025-03-14"  (UTC)
```

#### `fromTimestamp(ts: number): CalDate`

Converts a Unix timestamp in **milliseconds** to a local `CalDate`.

```ts
fromTimestamp(1741996800000); // => "2025-03-15"  (local)
```

#### `fromTimestampUTC(ts: number): CalDate`

Converts a Unix timestamp in **milliseconds** to a UTC `CalDate`.

```ts
fromTimestampUTC(1741996800000); // => "2025-03-15"  (UTC)
```

#### `fromTimestampSeconds(ts: number): CalDate`

Converts a Unix timestamp in **seconds** (common in databases and server APIs) to a local `CalDate`.

```ts
fromTimestampSeconds(1741996800); // => "2025-03-15"  (local)
```

#### `fromTimestampSecondsUTC(ts: number): CalDate`

Converts a Unix timestamp in **seconds** to a UTC `CalDate`.

#### `fromISOString(iso: string): CalDate`

Extracts the date portion from an ISO 8601 datetime string. The timezone offset in the string is respected — the date is extracted after adjusting to UTC.

```ts
fromISOString('2025-03-15T10:30:00Z'); // => "2025-03-15"
fromISOString('2025-03-15T00:30:00+01:00'); // => "2025-03-14"  (UTC date)
fromISOString('2025-03-15T00:30:00-05:00'); // => "2025-03-15"  (UTC date)
```

---

### From `CalDate` / `YearMonth` to native types

#### `toDate(input: CalDateInput): Date`

Returns a `Date` at **midnight UTC** for the given calendar date.

```ts
toDate('2025-03-15'); // => Date("2025-03-15T00:00:00.000Z")
```

#### `toTimestamp(input: CalDateInput): number`

Returns a Unix timestamp in **milliseconds** at midnight UTC.

```ts
toTimestamp('2025-03-15'); // => 1741996800000
```

#### `toTimestampSeconds(input: CalDateInput): number`

Returns a Unix timestamp in **seconds** at midnight UTC.

```ts
toTimestampSeconds('2025-03-15'); // => 1741996800
```

#### `toISOString(input: CalDateInput): string`

Returns an ISO 8601 datetime string at midnight UTC. Round-trips cleanly with `fromISOString`.

```ts
toISOString('2025-03-15'); // => "2025-03-15T00:00:00.000Z"
```

---

### Temporal conversions

#### `fromTemporal(date: Temporal.PlainDate): CalDate`

Converts a `Temporal.PlainDate` to a `CalDate` string.

```ts
fromTemporal(Temporal.PlainDate.from('2025-03-15')); // => "2025-03-15"
```

#### `fromTemporalYearMonth(ym: Temporal.PlainYearMonth): YearMonth`

Converts a `Temporal.PlainYearMonth` to a `YearMonth` string.

```ts
fromTemporalYearMonth(Temporal.PlainYearMonth.from('2025-03')); // => "2025-03"
```

#### `toTemporal(input: CalDateInput): Temporal.PlainDate`

Converts a `CalDate` or `CalDateObj` to a `Temporal.PlainDate`.

```ts
toTemporal('2025-03-15'); // => Temporal.PlainDate { year: 2025, month: 3, day: 15 }
```

#### `toTemporalYearMonth(input: AnyDateInput): Temporal.PlainYearMonth`

Converts any input to a `Temporal.PlainYearMonth`.

```ts
toTemporalYearMonth('2025-03-15'); // => Temporal.PlainYearMonth { year: 2025, month: 3 }
toTemporalYearMonth('2025-03'); // => Temporal.PlainYearMonth { year: 2025, month: 3 }
```

---

### Implementation Notes

> These notes are intended to guide the implementation. They are not part of the public API.

**Why UTC throughout**

All `toDate`, `toTimestamp`, and `toISOString` functions produce midnight UTC. This ensures the calendar date is always preserved regardless of the runtime's local timezone. A user in UTC-5 calling `toDate("2025-03-15")` should always get March 15th, not March 14th at 7pm local time.

**`fromDate` vs `fromDateUTC`**

These are intentionally two explicit functions rather than a single function with a `utc` flag. The distinction is meaningful and the explicit names make the intent clear at the call site — a `utc` boolean parameter is easy to pass incorrectly or misread.

**`YearMonth` in `toDate` / `toTimestamp`**

`toDate` and `toTimestamp` accept `CalDateInput` only. Users with a `YearMonth` should call `toCalDate` first to make the day explicit, rather than having the library silently default to the 1st. This avoids surprising implicit behaviour.

**Temporal feature detection**

The Temporal conversion functions should check for `Temporal` availability at runtime and throw a clear error if it is not available, rather than failing with a cryptic reference error. Temporal is available in Node.js 22+ and modern browsers as of 2025, but may not be present in all environments.

---

## Intl API Helpers 🟡

> **Status: Designed, not yet implemented.**

This section covers locale-aware date formatting via the [ECMAScript Internationalization API (`Intl.DateTimeFormat`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
`Intl.DurationFormat` and `Intl.RelativeTimeFormat` are intentionally out of scope — they work with numbers and plain strings respectively, so there is no `CalDate`/`YearMonth` bridging problem to solve.

---

### `createDateTimeFormat(locale: string, options?: CalDateTimeFormatOptions): CalDateTimeFormat`

Creates and returns a `CalDateTimeFormat` instance — a timezone-safe wrapper around `Intl.DateTimeFormat`.

```ts
const fmt = createDateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

fmt.format('2025-03-15'); // => "March 2025"
fmt.format('2025-03'); // => "March 2025"
```

**Why a factory function rather than `new`?**
Calling `createDateTimeFormat` once and reusing the instance avoids the significant performance cost of constructing `Intl.DateTimeFormat` objects repeatedly. This matters when formatting many dates — e.g. rendering a calendar grid or processing a large dataset. The user controls the instance lifetime explicitly, which is simpler and more predictable than a hidden module-level cache.

---

### `CalDateTimeFormat`

The object returned by `createDateTimeFormat`. Mirrors the native `Intl.DateTimeFormat` interface, but all methods accept `AnyDateInput` instead of `Date`.

#### `.format(input: AnyDateInput): string`

Formats a date or month as a localised string.

```ts
const fmt = createDateTimeFormat('de', { dateStyle: 'long' });
fmt.format('2025-03-15'); // => "15. März 2025"
```

#### `.formatRange(start: AnyDateInput, end: AnyDateInput): string`

Formats a date range as a localised string.

```ts
const fmt = createDateTimeFormat('en-GB', { month: 'short', year: 'numeric' });
fmt.formatRange('2025-03-01', '2025-05-31'); // => "Mar–May 2025"
```

#### `.formatToParts(input: AnyDateInput): Intl.DateTimeFormatPart[]`

Returns the formatted date broken into typed parts, useful for custom rendering.

```ts
const fmt = createDateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
fmt.formatToParts('2025-03-15');
// => [
//   { type: "day", value: "15" },
//   { type: "literal", value: " " },
//   { type: "month", value: "March" },
//   ...
// ]
```

#### `.formatRangeToParts(start: AnyDateInput, end: AnyDateInput): Intl.DateTimeRangeFormatPart[]`

Returns a formatted date range broken into typed parts.

---

### `CalDateTimeFormatOptions`

A strict subset of `Intl.DateTimeFormatOptions` with all time-related fields removed. Prevents accidentally requesting time components that would be meaningless for calendar dates.

**Included fields:**
`dateStyle`, `year`, `month`, `day`, `weekday`, `era`, `calendar`, `numberingSystem`, `localeMatcher`

**Removed fields:**
`timeStyle`, `hour`, `minute`, `second`, `fractionalSecondDigits`, `hour12`, `hourCycle`, `dayPeriod`, `timeZone`

> `timeZone` is excluded from the public options intentionally — see implementation notes below.

---

### Implementation Notes

> These notes are intended to guide the implementation. They are not part of the public API.

**UTC-midnight conversion**

`Intl.DateTimeFormat` requires a native `Date` object. When a `CalDate` or `YearMonth` is passed to any formatting method, it must be converted internally to a `Date` at **midnight UTC**:

```ts
// "2025-03-15" -> new Date("2025-03-15T00:00:00.000Z")
// "2025-03"    -> new Date("2025-03-01T00:00:00.000Z")
```

The underlying `Intl.DateTimeFormat` instance must always be constructed with `timeZone: "UTC"` baked in, regardless of the user-supplied options. This is the key to timezone safety — it ensures the calendar date passed in is always the calendar date rendered in the output.

**Why this matters**

Without this approach, a user in UTC-5 formatting `"2025-03-15"` could receive `"March 14"` because `new Date("2025-03-15")` is parsed as midnight UTC, which is 7pm on March 14 in their local timezone. By constructing as midnight UTC _and_ formatting in UTC, the date is always stable regardless of where the code runs.

**`YearMonth` inputs**

`"2025-03"` is converted to `"2025-03-01T00:00:00.000Z"` internally. This is safe because users formatting a `YearMonth` are only requesting month/year level output anyway — the day component is irrelevant.

**`timeZone` in options**

`timeZone` is stripped from `CalDateTimeFormatOptions` and must not be passed through to the underlying `Intl.DateTimeFormat` constructor. Always override with `"UTC"` internally. Allowing the user to set `timeZone` would silently undermine the entire timezone-safety guarantee.

**Runtime `Intl` dependency**

This library relies entirely on the runtime's `Intl` implementation — no locale data is bundled. This keeps the bundle size minimal but requires a modern environment (Node.js 13+, all current browsers). This is an acceptable constraint for a library targeting ISO date strings.

---

### `createMonthFormatter(locale: string, style: "long" | "short" | "narrow"): CalMonthFormatter`

Creates a purpose-built formatter for localised month names. Each instance owns a single `Intl.DateTimeFormat` tuned to one style — create once and reuse to avoid repeated construction costs.

```ts
const fmt = createMonthFormatter('en-GB', 'long');
fmt.getMonth('2025-03-15'); // => "March"
fmt.getMonth('2025-03'); // => "March"
fmt.getMonth(3); // => "March"
fmt.getMonth(15); // => "March"  (15 % 12 = 3)
```

---

### `CalMonthFormatter`

The object returned by `createMonthFormatter`.

#### `.getMonth(input: AnyDateInput | number): string`

Returns the localised month name for the given input.

When a bare number is passed, it is treated as a 1-based month number (1 = January, 12 = December). Out-of-range integers wrap cyclically via modulo: `13` → January, `0` → December, `15` → March.

```ts
const fmt = createMonthFormatter('de', 'long');
fmt.getMonth(3); // => "März"
fmt.getMonth('2025-03'); // => "März"
```

#### `.getMonthRange(start: AnyDateInput | number, end: AnyDateInput | number): string`

Returns a localised month range string using `Intl.DateTimeFormat.formatRange` under the hood, so separators and spacing are locale-appropriate.

```ts
const fmt = createMonthFormatter('en-GB', 'short');
fmt.getMonthRange(3, 6); // => "Mar–Jun"
fmt.getMonthRange('2025-03', '2025-06'); // => "Mar–Jun"
```

#### `.getMonthParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[]`

Returns the month name broken into typed parts via `formatToParts`. Useful for custom rendering where you need to style individual parts differently.

```ts
const fmt = createMonthFormatter('en-GB', 'long');
fmt.getMonthParts(3);
// => [{ type: "month", value: "March" }]
```

#### `.getMonthRangeParts(start: AnyDateInput | number, end: AnyDateInput | number): Intl.DateTimeRangeFormatPart[]`

Returns a month range broken into typed parts via `formatRangeToParts`.

---

### Implementation Notes — `CalMonthFormatter`

> These notes are intended to guide the implementation. They are not part of the public API.

**Internal Date construction**

Month name formatting does not require a real calendar date — only the month value matters. Internally, always construct the `Date` using the 1st of the month at midnight UTC:

```ts
// month number 3 -> new Date("2025-03-01T00:00:00.000Z")  (year is arbitrary)
```

The `Intl.DateTimeFormat` instance must be constructed with `{ month: style, timeZone: "UTC" }` — no other date fields, so the output contains only the month name.

**Modulo wrapping**

For bare number inputs, normalise to a valid 1-based month before constructing the internal `Date`:

```ts
const normalised = ((((n - 1) % 12) + 12) % 12) + 1; // handles negatives too
```

---

### `createDayFormatter(locale: string, style: "long" | "short" | "narrow"): CalDayFormatter`

Creates a purpose-built formatter for localised day names. Each instance owns a single `Intl.DateTimeFormat` tuned to one style.

```ts
const fmt = createDayFormatter('en-GB', 'short');
fmt.getDay('2025-03-15'); // => "Sat"
fmt.getDay(6); // => "Sat"  (1=Mon, 7=Sun)
fmt.getDay(13); // => "Sat"  (13 % 7 = 6)
```

---

### `CalDayFormatter`

The object returned by `createDayFormatter`.

#### `.getDay(input: CalDateInput | number): string`

Returns the localised day name for the given input.

When a bare number is passed, it is treated as a 1-based ISO day number (1 = Monday, 7 = Sunday). Out-of-range integers wrap cyclically via modulo.

```ts
const fmt = createDayFormatter('de', 'long');
fmt.getDay(1); // => "Montag"
fmt.getDay('2025-03-15'); // => "Samstag"
```

#### `.getDayRange(start: CalDateInput | number, end: CalDateInput | number): string`

Returns a localised day range string using `Intl.DateTimeFormat.formatRange` under the hood.

```ts
const fmt = createDayFormatter('en-GB', 'short');
fmt.getDayRange(1, 5); // => "Mon–Fri"
```

#### `.getDayParts(input: CalDateInput | number): Intl.DateTimeFormatPart[]`

Returns the day name broken into typed parts via `formatToParts`.

```ts
const fmt = createDayFormatter('en-GB', 'long');
fmt.getDayParts(1);
// => [{ type: "weekday", value: "Monday" }]
```

#### `.getDayRangeParts(start: CalDateInput | number, end: CalDateInput | number): Intl.DateTimeRangeFormatPart[]`

Returns a day range broken into typed parts via `formatRangeToParts`.

---

### Implementation Notes — `CalDayFormatter`

> These notes are intended to guide the implementation. They are not part of the public API.

**Internal Date construction**

Day name formatting only requires a `Date` that falls on the correct day of the week — the actual calendar date is irrelevant. Pick a known fixed Monday as an anchor (e.g. `2000-01-03`, which was a Monday) and offset by the ISO day number:

```ts
// ISO day 1 (Monday) -> new Date("2000-01-03T00:00:00.000Z")
// ISO day 6 (Saturday) -> new Date("2000-01-08T00:00:00.000Z")
const ANCHOR_MONDAY = Date.UTC(2000, 0, 3);
const ms = ANCHOR_MONDAY + (isoDay - 1) * 86_400_000;
```

The `Intl.DateTimeFormat` instance must be constructed with `{ weekday: style, timeZone: "UTC" }` — no other date fields.

When a `CalDateInput` is passed, extract the ISO day number first (reusing `getISODay` from the main API), then apply the same anchor offset.

**Modulo wrapping for bare numbers**

```ts
const normalised = ((((n - 1) % 7) + 7) % 7) + 1; // handles negatives too
```
