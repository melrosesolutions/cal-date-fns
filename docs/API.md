# cal-date-fns API Reference

## Table of Contents

- [Types](#types)
- [Error Classes](#error-classes)
- [Parsing & Validation](#parsing--validation)
- [Formatting](#formatting)
- [Arithmetic — Days](#arithmetic--days)
- [Arithmetic — Weeks](#arithmetic--weeks)
- [Arithmetic — Months](#arithmetic--months)
- [Arithmetic — Quarters](#arithmetic--quarters)
- [Arithmetic — Years](#arithmetic--years)
- [Differences](#differences)
- [Comparison](#comparison)
- [Day-of-week](#day-of-week)
- [Getters](#getters)
- [Setters](#setters)
- [Start & End Boundaries](#start--end-boundaries)
- [Current Date Helpers](#current-date-helpers)
- [Is Same Comparisons](#is-same-comparisons)
- [Range Utilities](#range-utilities)
- [Human-readable Distance](#human-readable-distance)
- [Predicates](#predicates)
- [TODO: Conversion Helpers](#todo-conversion-helpers)
- [Intl API Helpers](#intl-api-helpers)
- [Month Formatter](#createmonthformatterlocale-string-style-long--short--narrow-calmontformatter)
- [Day Formatter](#createdayformatterlocale-string-style-long--short--narrow-caldayformatter)

---

## Types

```ts
// String types
type CalDate    = string   // "YYYY-MM-DD"
type YearMonth  = string   // "YYYY-MM"

// Object types
type CalDateObj   = { y: number; m: number; d: number }
type YearMonthObj = { y: number; m: number }

// Input union types
type CalDateInput = CalDate | CalDateObj
type AnyDateInput = CalDate | CalDateObj | YearMonth | YearMonthObj
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
```

---

## Parsing & Validation

### `parse(value: string, format: string, options?: ParseOptions): CalDate | YearMonth`

Parses a formatted date string into a `CalDate` or `YearMonth` using a token-based format string. Inspired by `date-fns/parse`.

The return type is inferred from the format string at compile time — if the format contains a day token (`D` or `DD`), the return type is `CalDate`; otherwise it is `YearMonth`.

```ts
parse("15/03/2025", "DD/MM/YYYY")   // => "2025-03-15"  (typed as CalDate)
parse("03/2025", "MM/YYYY")         // => "2025-03"      (typed as YearMonth)
parse("3.15.25", "M.DD.YY")         // => "2025-03-15"
parse("2025-03", "YYYY-MM")         // => "2025-03"
```

**`ParseOptions`**

```ts
interface ParseOptions {
  pivotYear?: number  // default: 50
}
```

`pivotYear` controls how two-digit years (`YY`) are resolved. Years from `00` up to and including the pivot map to 2000+; years above the pivot map to 1900+. With the default pivot of `50`: `"25"` → `2025`, `"75"` → `1975`.

**Supported format tokens:**

| Token | Matches | Example input |
|-------|---------|---------------|
| `YYYY` | 4-digit year | `2025` |
| `YY` | 2-digit year (pivot-resolved) | `25` |
| `MM` | 2-digit month, zero-padded | `03` |
| `M` | Month, 1 or 2 digits | `3` or `03` |
| `DD` | 2-digit day, zero-padded | `05` |
| `D` | Day, 1 or 2 digits | `5` or `05` |

**Throws:**
- `CalDateFormatError` — if the format string is missing required tokens (must include at least `M`/`MM` and one of `Y`/`YY`/`YYYY`), contains unrecognised tokens, or is otherwise structurally invalid
- `CalDateParseError` — if the input string does not match the format pattern or numeric components cannot be extracted
- `CalDateRangeError` — if the extracted values are structurally valid but form an impossible date (e.g. month 13, February 30th)

> **Implementation note:** The intelligent return type (`CalDate` vs `YearMonth` based on whether the format string contains a day token) is achievable using TypeScript template literal types and function overloads. The type-level check mirrors the runtime behaviour — if no `D`/`DD` token is present, no day is extracted and a `YearMonth` string is returned.

---

### `toObject(input: AnyDateInput): CalDateObj | YearMonthObj`
Normalises any input to its object form. Returns a `CalDateObj` if the input includes a day, otherwise a `YearMonthObj`.

```ts
toObject("2025-03-15")              // => { y: 2025, m: 3, d: 15 }
toObject("2025-03")                 // => { y: 2025, m: 3 }
toObject({ y: 2025, m: 3, d: 15 }) // => { y: 2025, m: 3, d: 15 }
```

### `isValid(input: unknown): boolean`
Returns `true` if the input is a valid `CalDate`, `YearMonth`, `CalDateObj`, or `YearMonthObj`.

```ts
isValid("2025-03-15")  // => true
isValid("2025-13-01")  // => false (month 13)
isValid("2025-02-29")  // => false (2025 is not a leap year)
isValid("2025-03")     // => true
```

### `isCalDate(input: unknown): input is CalDate`
Type guard. Returns `true` if the input is a valid `YYYY-MM-DD` string.

### `isYearMonth(input: unknown): input is YearMonth`
Type guard. Returns `true` if the input is a valid `YYYY-MM` string.

### `toCalDate(input: AnyDateInput): CalDate`
Converts any input to a `YYYY-MM-DD` string. When given a `YearMonth` or `YearMonthObj`, defaults to the 1st of the month.

```ts
toCalDate("2025-03")                  // => "2025-03-01"
toCalDate({ y: 2025, m: 3 })         // => "2025-03-01"
toCalDate({ y: 2025, m: 3, d: 15 })  // => "2025-03-15"
```

### `toYearMonth(input: AnyDateInput): YearMonth`
Converts any input to a `YYYY-MM` string, dropping the day component if present.

```ts
toYearMonth("2025-03-15")                // => "2025-03"
toYearMonth({ y: 2025, m: 3, d: 15 })   // => "2025-03"
```

---

## Formatting

### `format(input: AnyDateInput, formatStr: string): string`
Formats a date or month using a token-based format string.

```ts
format("2025-03-15", "DD MMM YYYY")   // => "15 Mar 2025"
format("2025-03-15", "YYYY/MM/DD")    // => "2025/03/15"
format("2025-03", "MMM YYYY")         // => "Mar 2025"
```

**Supported tokens:**

| Token | Output | Example |
|-------|--------|---------|
| `YYYY` | Full year | `2025` |
| `YY` | 2-digit year | `25` |
| `MM` | 2-digit month | `03` |
| `M` | Month (no padding) | `3` |
| `MMM` | Short month name | `Mar` |
| `MMMM` | Full month name | `March` |
| `DD` | 2-digit day | `05` |
| `D` | Day (no padding) | `5` |
| `DDD` | Short day name | `Sat` |
| `DDDD` | Full day name | `Saturday` |

---

## Arithmetic — Days

*Accepts `CalDateInput` only.*

### `addDays(input: CalDateInput, amount: number): CalDate`
```ts
addDays("2025-03-28", 5)  // => "2025-04-02"
```

### `subDays(input: CalDateInput, amount: number): CalDate`
```ts
subDays("2025-04-02", 5)  // => "2025-03-28"
```

---

## Arithmetic — Weeks

*Accepts `CalDateInput` only.*

### `addWeeks(input: CalDateInput, amount: number): CalDate`
```ts
addWeeks("2025-03-01", 2)  // => "2025-03-15"
```

### `subWeeks(input: CalDateInput, amount: number): CalDate`
```ts
subWeeks("2025-03-15", 2)  // => "2025-03-01"
```

---

## Arithmetic — Months

*Accepts `AnyDateInput`. Returns the same string type as the input.*

### `addMonths(input: CalDateInput, amount: number): CalDate`
### `addMonths(input: YearMonth | YearMonthObj, amount: number): YearMonth`
Clamps to the last day of the month if the original day does not exist in the target month.

```ts
addMonths("2025-01-31", 1)  // => "2025-02-28"
addMonths("2025-01", 3)     // => "2025-04"
```

### `subMonths(input: CalDateInput, amount: number): CalDate`
### `subMonths(input: YearMonth | YearMonthObj, amount: number): YearMonth`
```ts
subMonths("2025-03-31", 1)  // => "2025-02-28"
subMonths("2025-06", 2)     // => "2025-04"
```

---

## Arithmetic — Quarters

*Accepts `AnyDateInput`. Returns the same string type as the input.*

### `addQuarters(input: CalDateInput, amount: number): CalDate`
### `addQuarters(input: YearMonth | YearMonthObj, amount: number): YearMonth`
```ts
addQuarters("2025-01-31", 1)  // => "2025-04-30"
addQuarters("2025-01", 1)     // => "2025-04"
```

### `subQuarters(input: CalDateInput, amount: number): CalDate`
### `subQuarters(input: YearMonth | YearMonthObj, amount: number): YearMonth`

---

## Arithmetic — Years

*Accepts `AnyDateInput`. Returns the same string type as the input.*

### `addYears(input: CalDateInput, amount: number): CalDate`
### `addYears(input: YearMonth | YearMonthObj, amount: number): YearMonth`
```ts
addYears("2024-02-29", 1)  // => "2025-02-28"  (clamped, 2025 not a leap year)
addYears("2024-02", 1)     // => "2025-02"
```

### `subYears(input: CalDateInput, amount: number): CalDate`
### `subYears(input: YearMonth | YearMonthObj, amount: number): YearMonth`

---

## Differences

### `differenceInDays(dateLeft: CalDateInput, dateRight: CalDateInput): number`
```ts
differenceInDays("2025-04-01", "2025-03-01")  // => 31
```

### `differenceInWeeks(dateLeft: CalDateInput, dateRight: CalDateInput): number`
Whole weeks only.
```ts
differenceInWeeks("2025-03-22", "2025-03-01")  // => 3
```

### `differenceInMonths(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`
Exact difference — accounts for partial months.
```ts
differenceInMonths("2025-03-15", "2025-01-31")  // => 1
```

### `differenceInCalendarMonths(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`
Calendar month boundary count, regardless of day.
```ts
differenceInCalendarMonths("2025-02-01", "2025-01-31")  // => 1
```

### `differenceInQuarters(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`
Exact difference.

### `differenceInCalendarQuarters(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`

### `differenceInYears(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`
Exact difference — accounts for partial years.
```ts
differenceInYears("2025-02-28", "2024-03-01")  // => 0
```

### `differenceInCalendarYears(dateLeft: AnyDateInput, dateRight: AnyDateInput): number`
```ts
differenceInCalendarYears("2025-01-01", "2024-12-31")  // => 1
```

---

## Comparison

### `compareAsc(dateLeft: AnyDateInput, dateRight: AnyDateInput): -1 | 0 | 1`
Returns `-1` if dateLeft is before dateRight, `1` if after, `0` if equal. Useful for sorting.
```ts
["2025-03", "2025-01", "2025-02"].sort(compareAsc)
// => ["2025-01", "2025-02", "2025-03"]
```

### `compareDesc(dateLeft: AnyDateInput, dateRight: AnyDateInput): -1 | 0 | 1`

### `isAfter(date: AnyDateInput, dateToCompare: AnyDateInput): boolean`
```ts
isAfter("2025-06-01", "2025-03-15")  // => true
```

### `isBefore(date: AnyDateInput, dateToCompare: AnyDateInput): boolean`

### `isEqual(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`
```ts
isEqual("2025-03-15", { y: 2025, m: 3, d: 15 })  // => true
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

## Day-of-week

*Accepts `CalDateInput` only.*

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

## Getters

### `getDay(date: CalDateInput): number`
Day of the week. 0 = Sunday, 6 = Saturday.

### `getDate(date: CalDateInput): number`
Day of the month (1–31).

### `getDayOfYear(date: CalDateInput): number`
Day of the year (1–366).

### `getDaysInMonth(input: AnyDateInput): number`
```ts
getDaysInMonth("2025-02")  // => 28
getDaysInMonth("2024-02")  // => 29
```

### `getDaysInYear(input: AnyDateInput): number`
Returns 365 or 366.

### `getMonth(input: AnyDateInput): number`
1-based month number.
```ts
getMonth("2025-03-15")  // => 3
```

### `getYear(input: AnyDateInput): number`
```ts
getYear("2025-03-15")  // => 2025
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

## Setters

*All functions return a string of the same type as the input, unless noted.*

### `setDate(date: CalDateInput, day: number): CalDate`
Sets the day of the month.
```ts
setDate("2025-03-15", 1)   // => "2025-03-01"
```

### `setDay(date: CalDateInput, day: number): CalDate`
Sets the day of the week (0 = Sunday). Adjusts to the nearest occurrence within the same week.

### `setDayOfYear(date: CalDateInput, day: number): CalDate`
```ts
setDayOfYear("2025-03-15", 1)  // => "2025-01-01"
```

### `setMonth(input: CalDateInput, month: number): CalDate`
### `setMonth(input: YearMonth | YearMonthObj, month: number): YearMonth`
```ts
setMonth("2025-03-15", 6)  // => "2025-06-15"
setMonth("2025-03", 6)     // => "2025-06"
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

## Start & End Boundaries

### `startOfWeek(date: CalDateInput): CalDate`
Returns the Sunday of the week containing `date`.

### `endOfWeek(date: CalDateInput): CalDate`
Returns the Saturday of the week containing `date`.

### `lastDayOfWeek(date: CalDateInput): CalDate`
Alias of `endOfWeek`.

### `startOfMonth(input: AnyDateInput): CalDate`
Returns the first day of the month. Accepts both `CalDate` and `YearMonth`.
```ts
startOfMonth("2025-03-15")  // => "2025-03-01"
startOfMonth("2025-03")     // => "2025-03-01"
```

### `endOfMonth(input: AnyDateInput): CalDate`
Returns the last day of the month.
```ts
endOfMonth("2025-02")  // => "2025-02-28"
endOfMonth("2024-02")  // => "2024-02-29"
```

### `lastDayOfMonth(input: AnyDateInput): CalDate`
Alias of `endOfMonth`.

### `startOfQuarter(input: AnyDateInput): CalDate`
```ts
startOfQuarter("2025-05-15")  // => "2025-04-01"
```

### `endOfQuarter(input: AnyDateInput): CalDate`
```ts
endOfQuarter("2025-05-15")  // => "2025-06-30"
```

### `lastDayOfQuarter(input: AnyDateInput): CalDate`
Alias of `endOfQuarter`.

### `startOfYear(input: AnyDateInput): CalDate`
```ts
startOfYear("2025-06")  // => "2025-01-01"
```

### `endOfYear(input: AnyDateInput): CalDate`
```ts
endOfYear("2025-06")  // => "2025-12-31"
```

### `lastDayOfYear(input: AnyDateInput): CalDate`
Alias of `endOfYear`.

### `startOfISOWeek(date: CalDateInput): CalDate`
Returns the Monday of the ISO week containing `date`.

### `endOfISOWeek(date: CalDateInput): CalDate`
Returns the Sunday of the ISO week containing `date`.

### `lastDayOfISOWeek(date: CalDateInput): CalDate`
Alias of `endOfISOWeek`.

### `startOfISOYear(date: CalDateInput): CalDate`
Returns the first day of the ISO week-numbering year.

### `endOfISOYear(date: CalDateInput): CalDate`
Returns the last day of the ISO week-numbering year.

### `lastDayOfISOYear(date: CalDateInput): CalDate`
Alias of `endOfISOYear`.

---

## Current Date Helpers

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

## Is Same Comparisons

### `isSameDay(dateLeft: CalDateInput, dateRight: CalDateInput): boolean`

### `isSameMonth(dateLeft: AnyDateInput, dateRight: AnyDateInput): boolean`
```ts
isSameMonth("2025-03-01", "2025-03-31")  // => true
isSameMonth("2025-03-01", "2025-03")     // => true
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

## Range Utilities

### `isWithinRange(date: AnyDateInput, start: AnyDateInput, end: AnyDateInput): boolean`
```ts
isWithinRange("2025-03-15", "2025-03-01", "2025-03-31")  // => true
```

### `areRangesOverlapping(start1: AnyDateInput, end1: AnyDateInput, start2: AnyDateInput, end2: AnyDateInput): boolean`

### `getOverlappingDaysInRanges(start1: CalDateInput, end1: CalDateInput, start2: CalDateInput, end2: CalDateInput): number`

### `eachDay(start: CalDateInput, end: CalDateInput): CalDate[]`
Returns an array of every day between `start` and `end`, inclusive.
```ts
eachDay("2025-03-01", "2025-03-03")
// => ["2025-03-01", "2025-03-02", "2025-03-03"]
```

### `eachMonth(start: AnyDateInput, end: AnyDateInput): YearMonth[]`
Returns an array of every month between `start` and `end`, inclusive.
```ts
eachMonth("2025-01", "2025-04")
// => ["2025-01", "2025-02", "2025-03", "2025-04"]
```

---

## Human-readable Distance

### `formatDistance(dateLeft: AnyDateInput, dateRight: AnyDateInput): string`
Returns a human-readable description of the distance between two dates.
```ts
formatDistance("2025-06-01", "2025-03-01")  // => "3 months"
formatDistance("2025-03-20", "2025-03-15")  // => "5 days"
```

### `formatDistanceStrict(dateLeft: AnyDateInput, dateRight: AnyDateInput): string`
Same as `formatDistance` but without rounding. Always uses the largest exact unit.

### `formatDistanceToNow(date: AnyDateInput): string`
Distance between `date` and today.
```ts
// Assuming today is 2025-05-06
formatDistanceToNow("2025-03-01")  // => "2 months ago"
formatDistanceToNow("2025-07-01")  // => "in 2 months"
```

---

## Predicates

### `isFirstDayOfMonth(date: CalDateInput): boolean`
```ts
isFirstDayOfMonth("2025-03-01")  // => true
```

### `isLastDayOfMonth(date: CalDateInput): boolean`
```ts
isLastDayOfMonth("2025-02-28")  // => true
```

### `isLeapYear(input: AnyDateInput): boolean`
```ts
isLeapYear("2024-01-01")  // => true
isLeapYear("2025-03")     // => false
```

---

## TODO: Conversion Helpers

> **Status: Not yet designed.** This section is reserved for functions that convert between `CalDate`/`YearMonth` and native JavaScript types.
>
> **From native types to `CalDate` / `YearMonth`:**
> - `fromDate(date: Date): CalDate` — extract the **local** date from a `Date` object
> - `fromDateUTC(date: Date): CalDate` — extract the **UTC** date from a `Date` object
> - `fromTimestamp(ts: number): CalDate` — convert a Unix timestamp (ms) to a local `CalDate`
> - `fromTimestampUTC(ts: number): CalDate` — convert a Unix timestamp (ms) to a UTC `CalDate`
> - `fromISOString(iso: string): CalDate` — parse an ISO 8601 datetime string (e.g. `"2025-03-15T10:30:00Z"`) and extract the date portion
>
> **From `CalDate` / `YearMonth` to native types:**
> - `toDate(input: CalDateInput): Date` — returns a `Date` at midnight local time
> - `toDateUTC(input: CalDateInput): Date` — returns a `Date` at midnight UTC
> - `toTimestamp(input: CalDateInput): number` — Unix timestamp (ms) at midnight local time
> - `toTimestampUTC(input: CalDateInput): number` — Unix timestamp (ms) at midnight UTC
>
> **Design decisions still to be made:**
> - Whether `fromDate` / `fromDateUTC` should be a single function with a `utc` option flag, or two explicit functions (explicit preferred for tree-shaking and readability)
> - How `YearMonth` inputs behave in `toDate` / `toTimestamp` — default to 1st of the month, or require explicit conversion via `toCalDate` first?
> - Whether to expose a `toISOString` that round-trips cleanly with `fromISOString`

---

## Intl API Helpers

> **Status: Designed, not yet implemented.**

This section covers locale-aware date formatting via the [ECMAScript Internationalization API (`Intl.DateTimeFormat`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
`Intl.DurationFormat` and `Intl.RelativeTimeFormat` are intentionally out of scope — they work with numbers and plain strings respectively, so there is no `CalDate`/`YearMonth` bridging problem to solve.

---

### `createDateTimeFormat(locale: string, options?: CalDateTimeFormatOptions): CalDateTimeFormat`

Creates and returns a `CalDateTimeFormat` instance — a timezone-safe wrapper around `Intl.DateTimeFormat`.

```ts
const fmt = createDateTimeFormat("en-GB", { month: "long", year: "numeric" });

fmt.format("2025-03-15")   // => "March 2025"
fmt.format("2025-03")      // => "March 2025"
```

**Why a factory function rather than `new`?**
Calling `createDateTimeFormat` once and reusing the instance avoids the significant performance cost of constructing `Intl.DateTimeFormat` objects repeatedly. This matters when formatting many dates — e.g. rendering a calendar grid or processing a large dataset. The user controls the instance lifetime explicitly, which is simpler and more predictable than a hidden module-level cache.

---

### `CalDateTimeFormat`

The object returned by `createDateTimeFormat`. Mirrors the native `Intl.DateTimeFormat` interface, but all methods accept `AnyDateInput` instead of `Date`.

#### `.format(input: AnyDateInput): string`
Formats a date or month as a localised string.
```ts
const fmt = createDateTimeFormat("de", { dateStyle: "long" });
fmt.format("2025-03-15")  // => "15. März 2025"
```

#### `.formatRange(start: AnyDateInput, end: AnyDateInput): string`
Formats a date range as a localised string.
```ts
const fmt = createDateTimeFormat("en-GB", { month: "short", year: "numeric" });
fmt.formatRange("2025-03-01", "2025-05-31")  // => "Mar–May 2025"
```

#### `.formatToParts(input: AnyDateInput): Intl.DateTimeFormatPart[]`
Returns the formatted date broken into typed parts, useful for custom rendering.
```ts
const fmt = createDateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
fmt.formatToParts("2025-03-15")
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

Without this approach, a user in UTC-5 formatting `"2025-03-15"` could receive `"March 14"` because `new Date("2025-03-15")` is parsed as midnight UTC, which is 7pm on March 14 in their local timezone. By constructing as midnight UTC *and* formatting in UTC, the date is always stable regardless of where the code runs.

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
const fmt = createMonthFormatter("en-GB", "long");
fmt.getMonth("2025-03-15")  // => "March"
fmt.getMonth("2025-03")     // => "March"
fmt.getMonth(3)             // => "March"
fmt.getMonth(15)            // => "March"  (15 % 12 = 3)
```

---

### `CalMonthFormatter`

The object returned by `createMonthFormatter`.

#### `.getMonth(input: AnyDateInput | number): string`
Returns the localised month name for the given input.

When a bare number is passed, it is treated as a 1-based month number (1 = January, 12 = December). Out-of-range integers wrap cyclically via modulo: `13` → January, `0` → December, `15` → March.

```ts
const fmt = createMonthFormatter("de", "long");
fmt.getMonth(3)          // => "März"
fmt.getMonth("2025-03")  // => "März"
```

#### `.getMonthRange(start: AnyDateInput | number, end: AnyDateInput | number): string`
Returns a localised month range string using `Intl.DateTimeFormat.formatRange` under the hood, so separators and spacing are locale-appropriate.

```ts
const fmt = createMonthFormatter("en-GB", "short");
fmt.getMonthRange(3, 6)                  // => "Mar–Jun"
fmt.getMonthRange("2025-03", "2025-06")  // => "Mar–Jun"
```

#### `.getMonthParts(input: AnyDateInput | number): Intl.DateTimeFormatPart[]`
Returns the month name broken into typed parts via `formatToParts`. Useful for custom rendering where you need to style individual parts differently.

```ts
const fmt = createMonthFormatter("en-GB", "long");
fmt.getMonthParts(3)
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
const normalised = ((n - 1) % 12 + 12) % 12 + 1;  // handles negatives too
```

---

### `createDayFormatter(locale: string, style: "long" | "short" | "narrow"): CalDayFormatter`

Creates a purpose-built formatter for localised day names. Each instance owns a single `Intl.DateTimeFormat` tuned to one style.

```ts
const fmt = createDayFormatter("en-GB", "short");
fmt.getDay("2025-03-15")  // => "Sat"
fmt.getDay(6)             // => "Sat"  (1=Mon, 7=Sun)
fmt.getDay(13)            // => "Sat"  (13 % 7 = 6)
```

---

### `CalDayFormatter`

The object returned by `createDayFormatter`.

#### `.getDay(input: CalDateInput | number): string`
Returns the localised day name for the given input.

When a bare number is passed, it is treated as a 1-based ISO day number (1 = Monday, 7 = Sunday). Out-of-range integers wrap cyclically via modulo.

```ts
const fmt = createDayFormatter("de", "long");
fmt.getDay(1)             // => "Montag"
fmt.getDay("2025-03-15")  // => "Samstag"
```

#### `.getDayRange(start: CalDateInput | number, end: CalDateInput | number): string`
Returns a localised day range string using `Intl.DateTimeFormat.formatRange` under the hood.

```ts
const fmt = createDayFormatter("en-GB", "short");
fmt.getDayRange(1, 5)  // => "Mon–Fri"
```

#### `.getDayParts(input: CalDateInput | number): Intl.DateTimeFormatPart[]`
Returns the day name broken into typed parts via `formatToParts`.

```ts
const fmt = createDayFormatter("en-GB", "long");
fmt.getDayParts(1)
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
const normalised = ((n - 1) % 7 + 7) % 7 + 1;  // handles negatives too
```