# Using cal-date-fns with Highcharts

> **Status:** ⚪ Stub — to be written once the core library is implemented and a working CodePen/example exists.

[Highcharts v12+](https://www.highcharts.com/) added native support for `YYYY-MM-DD` string dates on category axes, which pairs naturally with `cal-date-fns` — no `Date` object juggling, no timezone conversion, just pass the same ISO strings straight through.

## Planned content for this page

- A short framing paragraph: why string-based calendar dates are a good fit for chart data (no timezone bugs when categories cross midnight, easy to generate with `eachDay`/`eachMonth`, trivial to sort/compare)
- A minimal working example: generating a month of category labels with `eachDay`, formatting them with `createDateTimeFormat` or `format`, and feeding them into a Highcharts series
- A second example showing month-grouped data using `YearMonth` + `eachMonth`, likely a common reporting/dashboard use case
- Embedded CodePen(s) once built — see `docs/examples/README.md` (to be created) for the index of all live examples
- A short note on what Highcharts version is required (v12+) and a link to the relevant Highcharts changelog/docs entry for string-date category axis support

## Other integration pages to consider (not yet started)

This file lives in `docs/examples/` so it can sit alongside similar pages for other charting/UI libraries where calendar-string dates are a natural fit. Candidates to evaluate once the core library ships:

- **Chart.js** — time/category axis handling
- **ApexCharts** — datetime/category axis handling
- **Any datepicker/calendar UI library** that accepts ISO date strings directly (e.g. for highlighting ranges, disabling dates)
- **AG Grid / TanStack Table** — sorting/filtering columns of calendar-string dates

No commitments yet on which of these get a full page — listed here just so the idea isn't lost.
