/** date-fns `weekStartsOn`: Monday = 1 */
export const WEEK_STARTS_ON_MONDAY = 1 as const

export const weekOptionsMonday = {
  weekStartsOn: WEEK_STARTS_ON_MONDAY,
} as const satisfies { weekStartsOn: typeof WEEK_STARTS_ON_MONDAY }

/** ISO 8601 date string length `yyyy-MM-dd` */
export const ISO_DATE_STRING_LENGTH = 10

/** Regex: ISO calendar date only */
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/** Zero-pad calendar month index (1–12) for stable month keys. */
export const CALENDAR_MONTH_PAD = 2
