# cal-date-fns — Source File Structure (Revised)

> **Status: Foundation + partial `parse/`, `arithmetic/`, and `difference/` implemented.** `types/`, `errors/`, `internal/`, `epoch/` are complete. `parse/` has `toObject`, `isValid`, `isCalDate`, `isYearMonth`, `toCalDate`, `toYearMonth` implemented — `parse.ts` itself (the format-string parser) is still pending, deliberately left for later. `arithmetic/` currently includes `add` and `subtract`, and `difference/` currently includes `since` and `until`.

One function per file, kebab-case filenames. **No per-folder barrel files** — only a single `src/index.ts` at the root, which does explicit named re-exports from every individual file. This avoids `export *` tree-shaking ambiguity entirely and keeps the full public surface visible in one place.

**Naming convention for type-only files:** any file with **zero runtime exports** (only `type`/`interface` declarations) uses a `.type.ts` suffix, e.g. `cal-date.type.ts`. This lets `vitest.config.ts` exclude all of them from coverage with a single robust glob (`src/**/*.type.ts`) rather than an explicit, easily-stale file list. If a file mixes type declarations with real runtime code (e.g. a constant), split it: the types go in `<name>.type.ts`, the runtime code goes in `<name>.constant.ts` (or `<name>.ts` if it's a function rather than a constant) and imports the types from the `.type.ts` file as needed.

```
src/
├── index.ts                      # the ONLY barrel — named re-exports from every public file below
│
├── types/
│   ├── cal-date.type.ts            # CalDate, CalDateObj, CalDateInput types (no runtime code)
│   ├── year-month.type.ts          # YearMonth, YearMonthObj types (no runtime code)
│   ├── any-date-input.type.ts      # AnyDateInput union type (no runtime code)
│   ├── duration.type.ts            # Duration, DurationUnit, DurationOptions (no runtime code)
│   └── duration.constant.ts        # DURATION_UNIT_ORDER — split out because it's runtime code
│
├── errors/
│   ├── cal-date-format-error.ts
│   ├── cal-date-parse-error.ts
│   ├── cal-date-range-error.ts
│   └── cal-date-options-error.ts
│
├── internal/                      # NOT exported from src/index.ts — implementation detail only
│   ├── is-leap-year-internal.ts    # raw y -> boolean
│   ├── days-in-month-internal.ts   # raw y,m -> number
│   ├── normalize-input.ts          # shared coercion used by to-object/to-cal-date/to-year-month
│   └── clamp-day.ts                # clamps a day to the valid range for a given y,m (used by add/subtract)
│
├── epoch/                          # PUBLIC — promoted from internal per discussion
│   ├── to-epoch-day.ts             # CalDateObj -> integer day count since epoch
│   └── from-epoch-day.ts           # integer day count -> CalDateObj
│
├── parse/
│   ├── parse.ts                    # parse(value, format, options?) — build last, most complex
│   ├── to-object.ts
│   ├── is-valid.ts
│   ├── is-cal-date.ts
│   ├── is-year-month.ts
│   ├── to-cal-date.ts
│   └── to-year-month.ts
│
├── format/
│   └── format.ts
│
├── arithmetic/
│   ├── add.ts
│   └── subtract.ts
│
├── difference/
│   ├── since.ts
│   └── until.ts
│
├── comparison/
│   ├── compare-asc.ts
│   ├── compare-desc.ts
│   ├── is-after.ts
│   ├── is-before.ts
│   ├── is-equal.ts
│   ├── is-future.ts
│   ├── is-past.ts
│   ├── is-today.ts
│   ├── is-tomorrow.ts
│   ├── is-yesterday.ts
│   ├── min.ts
│   ├── max.ts
│   ├── closest-to.ts
│   └── closest-index-to.ts
│
├── day-of-week/
│   ├── is-monday.ts
│   ├── is-tuesday.ts
│   ├── is-wednesday.ts
│   ├── is-thursday.ts
│   ├── is-friday.ts
│   ├── is-saturday.ts
│   ├── is-sunday.ts
│   └── is-weekend.ts
│
├── getters/
│   ├── get-day.ts
│   ├── get-date.ts
│   ├── get-day-of-year.ts
│   ├── get-days-in-month.ts
│   ├── get-days-in-year.ts
│   ├── get-month.ts
│   ├── get-year.ts
│   ├── get-quarter.ts
│   ├── get-iso-day.ts
│   ├── get-iso-week.ts
│   ├── get-iso-weeks-in-year.ts
│   └── get-iso-year.ts
│
├── setters/
│   ├── set-date.ts
│   ├── set-day.ts
│   ├── set-day-of-year.ts
│   ├── set-month.ts
│   ├── set-year.ts
│   ├── set-quarter.ts
│   ├── set-iso-day.ts
│   ├── set-iso-week.ts
│   └── set-iso-year.ts
│
├── boundaries/
│   ├── start-of-week.ts
│   ├── end-of-week.ts
│   ├── start-of-month.ts
│   ├── end-of-month.ts
│   ├── start-of-quarter.ts
│   ├── end-of-quarter.ts
│   ├── start-of-year.ts
│   ├── end-of-year.ts
│   ├── start-of-iso-week.ts
│   ├── end-of-iso-week.ts
│   ├── start-of-iso-year.ts
│   └── end-of-iso-year.ts
│
├── current/
│   ├── today.ts
│   ├── tomorrow.ts
│   ├── yesterday.ts
│   ├── this-month.ts
│   ├── next-month.ts
│   └── last-month.ts
│
├── is-same/
│   ├── is-same-day.ts
│   ├── is-same-month.ts
│   ├── is-same-year.ts
│   ├── is-same-quarter.ts
│   ├── is-same-week.ts
│   ├── is-same-iso-week.ts
│   ├── is-same-iso-year.ts
│   ├── is-this-month.ts
│   ├── is-this-year.ts
│   ├── is-this-week.ts
│   ├── is-this-quarter.ts
│   ├── is-this-iso-week.ts
│   └── is-this-iso-year.ts
│
├── range/
│   ├── is-within-range.ts
│   ├── are-ranges-overlapping.ts
│   ├── get-overlapping-days-in-ranges.ts
│   ├── each-day.ts
│   └── each-month.ts
│
├── distance/
│   ├── format-distance.ts
│   ├── format-distance-strict.ts
│   └── format-distance-to-now.ts
│
├── predicates/
│   ├── is-first-day-of-month.ts
│   ├── is-last-day-of-month.ts
│   └── is-leap-year.ts
│
├── conversion/
│   ├── from-date.ts
│   ├── from-date-utc.ts
│   ├── from-timestamp.ts
│   ├── from-timestamp-utc.ts
│   ├── from-timestamp-seconds.ts
│   ├── from-timestamp-seconds-utc.ts
│   ├── from-iso-string.ts
│   ├── to-date.ts
│   ├── to-timestamp.ts
│   ├── to-timestamp-seconds.ts
│   ├── to-iso-string.ts
│   ├── from-temporal.ts
│   ├── from-temporal-year-month.ts
│   ├── to-temporal.ts
│   └── to-temporal-year-month.ts
│
└── intl/
    ├── create-date-time-format.ts   # + CalDateTimeFormat, CalDateTimeFormatOptions types
    ├── create-month-formatter.ts    # + CalMonthFormatter type
    └── create-day-formatter.ts      # + CalDayFormatter type
```

---

## Changes from the original plan

1. **Kebab-case filenames** throughout (`getDaysInMonth.ts` → `get-days-in-month.ts`).

2. **No per-folder `index.ts` barrels.** Only `src/index.ts` exists, and it uses explicit named re-exports, e.g.:

   ```ts
   export { add } from './arithmetic/add';
   export { subtract } from './arithmetic/subtract';
   export { since } from './difference/since';
   // ...one line per public function/type/error
   ```

   This is fully tree-shake-safe (no `export *`) and keeps the entire public surface visible by scrolling one file. `internal/` is never referenced from `src/index.ts`.

3. **Aliases removed.** `lastDayOfWeek`, `lastDayOfMonth`, `lastDayOfQuarter`, `lastDayOfYear`, `lastDayOfISOWeek`, `lastDayOfISOYear` are dropped — `endOfWeek`/`endOfMonth`/etc are the only names going forward. **`docs/API.md` needs a small update to remove these alias entries** when we next touch it.

4. **`toEpochDay` / `fromEpochDay` promoted to a public `epoch/` folder.** These are genuinely useful to consumers doing custom calendar math and are now part of the supported API surface — **also needs adding to `docs/API.md`** as a new section, probably right after Conversion Helpers.

5. **`internal/` trimmed.** The genuinely internal versions (raw `y`/`m` number params, no input coercion) feed the public `is-leap-year.ts` and `get-days-in-month.ts`, which handle `AnyDateInput` coercion before calling them. `normalize-input.ts` and `clamp-day.ts` remain internal-only plumbing.

6. **Distance functions confirmed unrelated to Intl** — `distance/` stays a standalone folder; no dependency on `intl/`.

7. **No proof-of-concept files exist yet** in the working repo we've built here — `src/index.ts` is still the original placeholder (`export const VERSION = "0.1.0"`) from the first scaffolding session. If you have local files in your actual `C:\projects\cal-date-fns` that diverge from this, let us know what's there and we'll fold them in or discard as appropriate.

---

## Outstanding doc updates (do alongside or before implementation starts)

- [x] Remove alias function entries from `docs/API.md` (Boundaries section) — done
- [x] Add `toEpochDay` / `fromEpochDay` as a new public section in `docs/API.md` — done

## Suggested build order (unchanged)

1. `types/`, `errors/`, `internal/`, `epoch/` — foundation, nothing else compiles without these
2. `parse/` (`to-object`, `is-valid`, `to-cal-date`, `to-year-month` first — leave `parse.ts` itself until later)
3. `arithmetic/`, `difference/` — core value proposition
4. `comparison/`, `day-of-week/`, `getters/`, `setters/`, `boundaries/`, `current/`, `is-same/`, `range/`, `predicates/`
5. `format/`, `distance/`
6. `parse/parse.ts` — the format-string parser
7. `conversion/`
8. `intl/`
