/** Default lookback / bucket counts for charts and aggregates. */
export const DASHBOARD_CHART = {
  WEEKLY_WEEKS: 8,
  MONTHLY_MONTHS: 6,
  /** Recent rows on the coach dashboard activity list. */
  RECENT_SESSIONS: 5,
} as const

export const STATISTICS_AGGREGATE = {
  WEEKLY_BUCKETS_SHOWN: 8,
  MONTHLY_BUCKETS_SHOWN: 6,
} as const
