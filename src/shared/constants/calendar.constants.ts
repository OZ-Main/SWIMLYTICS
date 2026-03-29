export const WEEK_STARTS_ON_MONDAY = 1 as const

export const weekOptionsMonday = {
  weekStartsOn: WEEK_STARTS_ON_MONDAY,
} as const satisfies { weekStartsOn: typeof WEEK_STARTS_ON_MONDAY }

export const ISO_DATE_STRING_LENGTH = 10

export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const CALENDAR_MONTH_PAD = 2
