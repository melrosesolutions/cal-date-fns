export interface CalDateFormatterOptions {
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
  year?: Intl.DateTimeFormatOptions['year'];
  month?: Intl.DateTimeFormatOptions['month'];
  day?: Intl.DateTimeFormatOptions['day'];
  weekday?: Intl.DateTimeFormatOptions['weekday'];
  era?: Intl.DateTimeFormatOptions['era'];
  calendar?: Intl.DateTimeFormatOptions['calendar'];
  numberingSystem?: Intl.DateTimeFormatOptions['numberingSystem'];
  localeMatcher?: Intl.DateTimeFormatOptions['localeMatcher'];
}
